import axios from 'axios'

axios.defaults.baseURL = window.location.href.includes('localhost') ? 'http://localhost:6388' : ''

export default {

}