import axios from "axios"

// Configures axios
axios.defaults.baseURL = process.env.API_URL;
axios.defaults.timeout = process.env.REQUEST_TIMEOUT;
axios.defaults.headers = {};
