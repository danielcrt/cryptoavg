import * as axios from 'axios'
import { API_URL } from '../constants'

axios.defaults.baseURL = API_URL;
axios.defaults.headers.common.Accept = 'application/json';
//axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true; // pass cookies

export default axios