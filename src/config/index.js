import axios from 'axios'

axios.defaults.baseURL = window.location.href.includes('localhost') ? 'http://localhost:6388' : 'https://imgserver.dashao.me:2'

export default {

}