import axios from "axios"

export class Requests {

  static getProjectCategories() {
    return axios.get("/v1/project-categories");
  }

  static getProjectSortingStrategies() {
    return axios.get("/v1/project-sorting-strategies");
  }

  static getProjects(limit, offset, categories, query, sort) {
    return axios.get("/v1/projects", {
        params: {limit, offset, categories, q: query, sort}
    });
  }

}
