import Vue from 'vue'
import SpongeVue from 'sponge-web-commons'
import axios from "axios"

Vue.use(SpongeVue);

import "sponge-web-commons/styles/global.scss"

// Configures axios
axios.defaults.baseURL = "http://localhost:9000/api/v1";
axios.defaults.timeout = 10000;
axios.defaults.headers = {};
