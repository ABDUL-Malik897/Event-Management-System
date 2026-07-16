import axios from 'axios';

const API = axios.create({
    baseURL : "http://localhost:4000/api"
});
API.interceptors.request.use((config) => {
    const auth = JSON.parse(localStorage.getItem("user"))
    if (auth?.token) {
        config.headers.Authorization = `Bearer ${auth.token}`
    }
    return config
})

export default API;