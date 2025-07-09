import axios from 'axios';
import { setCookies, getCookie  } from 'cookies-next';
import { getApiUrl } from '../config/api';

export const API_URL = getApiUrl();

const $api = axios.create({
    //withCredentials: true,
    baseURL: API_URL
})

$api.interceptors.request.use((config) => {
    let token = getCookie('token'); // => 'value'
    if(token && typeof window !== 'undefined') {
        config.headers.Authorizations =  `Bearer ${token}`;
    }
    return config;
})

$api.interceptors.response.use((config)=> {
    return config;
},  async (error) => {
    const originalRequest = error.config;
    if(error?.response?.status == 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await $api.get(`api/users/refresh-token/`)
           // localStorage.setItem('token', response.data.access_token)
            setCookies('token', response.data.access_token)
            return $api.request(originalRequest);
        }catch (e){
            console.log('НЕ АВТОРИЗОВАН')
            // let location = window.location.pathname;
            // // if(location !== '/login' &&  location !== '/registration') {
            // //     window.location.replace('/login')
            // // }
        }
    }
    throw error;
})


export default $api;
