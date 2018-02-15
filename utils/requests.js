import axios from "axios"

export class Requests {

  static getCategories() {
    return axios.get("/v1/categories");
  }

  static getProjects(limit, offset, categories, query) {
    return axios.get("/v1/projects", {
        params: {limit: limit, offset: offset, categories: categories, q: query}
    });
  }

}
