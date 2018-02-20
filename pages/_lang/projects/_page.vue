<template>
  <div id="project-list">
    <b-row>
      <b-col md="9">
        <b-input-group id="project-search">
          <b-form-input v-model="query" @keydown.enter.native="search"></b-form-input>
          <b-input-group-append>
            <b-btn variant="sponge-yellow" v-on:click="search">Search</b-btn>
          </b-input-group-append>
        </b-input-group>

        <ul id="projects">
          <li v-for="project in projects" v-bind:key="project.name">
            <b-container>
              <b-row>
                <b-col md="1">

                </b-col>
                <b-col md="11">
                  <b-row>
                    <b-col sm="12" lg="7">
                      <nuxt-link v-bind:to="project.href" class="project-name">
                        {{ project.name }}
                      </nuxt-link>
                    </b-col>
                    <b-col class="d-none d-lg-block" lg="5">
                      <div class="project-stats">
                        <span>
                          <fa-icon :icon="['fas', 'eye']"/>
                          {{ project.views }}
                        </span>
                        <span>
                          <fa-icon :icon="['fas', 'download']"/>
                          {{ project.downloads }}
                        </span>
                        <span>
                          <fa-icon :icon="['fas', 'star']"/>
                          {{ project.stars }}
                        </span>
                        <span>
                          <fa-icon :icon="['fas', project.category.icon]"/>
                        </span>
                      </div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col sm="12" lg="6">
                      <div class="project-description">
                        {{ project.description }}
                      </div>
                    </b-col>
                    <b-col sm="12" lg="6">
                      <div class="project-tags">
                       <tag v-for="tag in project.recommended.tags" :name="tag.name" :data="tag.data" :color="tag.backgroundColor" :key="tag.name"></tag>
                      </div>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </b-container>
          </li>
        </ul>

        <div id="project-list-footer">
          <b-pagination-nav class="d-inline-flex" :link-gen="generatePaginationLink" :number-of-pages="maxPages" v-model.number="page" use-router></b-pagination-nav>
        </div>
      </b-col>

      <b-col md="3">
        <b-form-select v-model="selectedStrategy" :options="strategies" v-on:input="changeSorting"></b-form-select>
        <b-card id="categories">
          <h6 slot="header">
            Categories
            <fa-icon :icon="['fas', 'times']" :fixed-width="true" v-if="queriedCategories.length > 0" v-on:click="resetCategoryFilter()" />
          </h6>
          <ul>
            <li v-for="category in categories" v-bind:key="category.title">
              <nuxt-link :to="generateCategoryLink($store.state.locale, category.id)" exact :class="{active: isCategoryActive(category.id)}">
                <fa-icon :icon="['fas', category.icon]" :fixed-width="true"/>
                <span>{{ category.title }}</span>
              </nuxt-link>
            </li>
          </ul>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import Vue from "vue"
  import {Component} from "nuxt-property-decorator"
  import axios from "axios"
  import Tag from "../../../components/Tag"
  import {Utils} from "../../../utils/utils";
  import {Requests} from "../../../utils/requests";
  import {stringify} from "qs"

  @Component({
    components: {
      Tag
    },
    watchQuery: ['categories', 'sort', 'q']
  })
  export default class ProjectList extends Vue {

    validate({params, query}) {
      return /^\d+$/.test(params.page) // page param has to be an integer
        && /^\d+$/.test(query.sort || 0) // sort param has to be an integer
        && /^(\d+)?(,\d+)*/.test(query.categories || 0) // categories query has to be an integer or a comma separated integer list (e.g. 1 or 1,2,3)
    }

    async asyncData({params, query, error, redirect}) {
      let page = parseInt(params.page); // params.page is already validated to be an integer, see https://nuxtjs.org/api/pages-validate/
      let perPage = process.env.PROJECTS_PER_PAGE || 25;

      return axios.all([Requests.getProjects(perPage, (page - 1) * perPage, query.categories, query.q, query.sort), Requests.getProjectCategories(), Requests.getProjectSortingStrategies()])
        .then(axios.spread((projects, categories, strategies) => {
          let maxPages = Math.ceil(projects.data.projectCount / perPage);
          let queriedCategories = [];

          // Checks if the page exists
          if (page > maxPages) {
            error({statusCode: 404, message: 'Page Not Found'}) //todo error type and message
          }

          // If filter contains all available categories, reset the category filter
          if (query.categories != null && Utils.stringListToArray(query.categories).length >= categories.data.length) {
            delete query.categories;

            redirect('/projects/1', query);
          } else if (query.categories != null) {
            // params.categories is already validated to be a comma separated integer list, see https://nuxtjs.org/api/pages-validate/
            queriedCategories = Utils.stringListToArray(query.categories).map(category => parseInt(category));
          }

          return {
            projects: projects.data.projects,
            categories: categories.data,
            page: page,
            maxPages: maxPages,
            queriedCategories: queriedCategories,
            strategies: strategies.data.strategies.map(strategy => {
              return {value: strategy.id, text: strategy.title};
            }),
            selectedStrategy: query.sort || strategies.data.default.id,
            query: query.q || null
          }
        }))
        .catch((e) => {
          error({statusCode: 500, message: e.message}) //todo error type and message
        });
    }

    getQueriedCategories(ignoredCategory) {
      let list = this.queriedCategories.slice(0);

      if (list.indexOf(ignoredCategory) >= 0) {
        list.splice(list.indexOf(ignoredCategory), 1);
      }

      return Utils.arrayToStringList(list);
    }

    generateCategoryLink(locale, categoryID) {
      let query = Object.assign({}, this.$nuxt.$route.query);

      if (this.isCategoryActive(categoryID)) {
        let queried = this.getQueriedCategories(categoryID);

        if (!queried) {
          delete query.categories;
        } else {
          query.categories = queried;
        }
      } else {
        query.categories = (this.getQueriedCategories() ? this.getQueriedCategories() + "," : "") + categoryID;
      }

      return {path: '/' + locale + '/projects/1', query};
    }

    isCategoryActive(categoryID) {
      return this.queriedCategories.indexOf(categoryID) >= 0;
    }

    resetCategoryFilter() {
      let query = Object.assign({}, this.$nuxt.$route.query);

      delete query.categories;

      this.$nuxt.$router.push({ path: '/projects/1', query});
    }

    generatePaginationLink(page) {
      return "/projects/" + page + "?" + stringify(this.$nuxt.$route.query);
    }

    changeSorting(value) {
      this.$nuxt.$router.push({ path: '/projects/1', query: {...this.$nuxt.$route.query, sort: value}});
    }

    search() {
      if(this.query) {
        this.$nuxt.$router.push({ path: '/projects/1', query: {...this.$nuxt.$route.query, q: this.query}});
      } else {
        let query = Object.assign({}, this.$nuxt.$route.query);

        delete query.q;

        this.$nuxt.$router.push({ path: '/projects/1', query});
      }
    }
  }
</script>

<style lang="scss">
  $item-background: #ffffff;
  $item-border: 1px solid #ddd;
  $project-stats-color: #808080;

  #project-list {
    ul#projects {
      list-style: none;
      padding: 0;
      margin-bottom: 0;

      li {
        border: $item-border;
        border-top: 0;
        padding: 1rem 0;
        background: $item-background;

        &:first-child {
          border-top: $item-border;
        }

        .project-name {
          font-size: 1.2rem;
          font-weight: 600;

          &:hover {
            text-decoration: none;
          }
        }

        .project-description {
          font-size: 0.9rem;
        }

        .project-stats {
          text-align: right;
          color: $project-stats-color;

          span {
            margin-left: 0.5rem;
          }
        }

        .project-tags {
          text-align: right;

          .tags {
            .tag {
              margin-top: 0;
              margin-bottom: 0;
            }

            &:last-child .tag:last-child {
              margin-right: 0;
            }
          }
        }
      }
    }

    #project-list-footer {
      background: $sponge_grey;
      text-align: center;

      .pagination {
        margin-bottom: 0;
        padding: 0.5rem;

        .page-item {
          &:first-child .page-link, &:last-child .page-link {
            border-radius: 0;
          }

          &.active .page-link {
            background: $sponge_yellow;
            border: 1px solid $sponge_yellow;
            color: darken($sponge_yellow_dark, 10);
          }

          &.disabled .page-link {
            color: $sponge_grey_lighter;
          }

          &:not(.disabled):not(:disabled) {
            .page-link:focus {
              box-shadow: 0 0 0 0.1rem rgba($sponge_grey_lighter, 1)
            }

            &.active .page-link:focus {
              box-shadow: 0 0 0 0.1rem rgba($sponge_yellow, 1)
            }
          }

          .page-link {
            background: $sponge_grey_light;
            border: 1px solid $sponge_grey_lighter;
            color: #ffffff;

            span {
              color: #ffffff;
            }
          }
        }
      }
    }

    #categories {
      .card-header h6 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0;

        svg {
          cursor: pointer;
        }
      }

      .card-body {
        padding: 0;
      }

      ul {
        list-style: none;
        padding: 0;
        margin-bottom: 0;

        li {
          border-bottom: 1px solid #ddd;

          a {
            display: block;
            padding: 0.5rem 1rem;
            color: $sponge_grey;

            &.active {
              box-shadow: inset -10px 0px 0px 0px $sponge_yellow;
            }

            &:hover {
              text-decoration: none;
            }

            svg {
              color: $sponge_grey_dark;
              margin-right: 1rem;
            }
          }

          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
  }
</style>
