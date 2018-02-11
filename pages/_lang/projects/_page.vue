<template>
  <div id="project-list">
    <b-row>
      <b-col md="9">
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

                      </div>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </b-container>
          </li>
        </ul>

        <div id="project-list-footer">
          <b-pagination-nav class="d-inline-flex" base-url="/projects/" :number-of-pages="maxPages" v-model.number="page" use-router></b-pagination-nav>
        </div>
      </b-col>

      <b-col md="3">
        <b-card id="category-selection">
          <h6 slot="header" class="mb-0">Categories</h6>
          <ul>
            <li v-for="category in categories" v-bind:key="category.title">
              <nuxt-link :to="generateCategoryLink($store.state.locale, category.id)">
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
  import Component from "nuxt-class-component"
  import axios from "axios"
  import Tag from "../../../components/Tag"

  @Component({
    components: {
      Tag
    }
  })
  export default class ProjectList extends Vue {

    queriedCategories = [];

    validate({params, query}) {
      return /^\d+$/.test(params.page) && /^(\d+)?(,\d+)*/.test(query.categories)
    }

    async asyncData({params, query, error}) {
      let page = parseInt(params.page);
      let perPage = 30;

      let categories = query.categories ? "&categories=" + query.categories : "";

      return axios.all(
        [
          axios.get("projects?limit=" + perPage + "&offset=" + (page - 1) * perPage + categories),
          axios.get("categories")
        ]
      ).then(axios.spread((projects, categories) => {
          let maxPages = Math.ceil(projects.data.projectCount / perPage);

          if (page > maxPages) {
            error({statusCode: 404, message: 'Page Not Found'})
          } else {
            return {
              projects: projects.data.projects,
              categories: categories.data,
              page: page,
              maxPages: maxPages
            }
          }
        })
      ).catch((e) => {
        error({statusCode: 500, message: e.message})
      });
    }

    created() {
      this.queriedCategories = this.$nuxt.$route.query.categories ? this.$nuxt.$route.query.categories.split(",").map(category => parseInt(category)) : [];
    }

    get getCategoryStringList() {
      let categories = "";

      this.queriedCategories.forEach(category => {
        categories += category + ",";
      });

      return categories.substring(0, categories.length - 1);
    }

    generateCategoryLink(locale, categoryID) {
      if (this.queriedCategories.indexOf(categoryID) >= 0) {
        return {path: '/' + locale + '/projects/1', query: {categories: "true"}}
      } else {
        return {path: '/' + locale + '/projects/1', query: {categories: this.getCategoryStringList + "," + categoryID}}
      }
    }
  }
</script>

<style lang="scss">
  @import "../../../node_modules/sponge-web-commons/styles/variables";

  .card {
    border-radius: 0;

    .card-header, .card-footer {
      background: $sponge_grey;
      color: #ffffff;

      &:first-child, &:last-child {
        border-radius: 0;
      }
    }
  }

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

    #category-selection {
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

            svg {
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
