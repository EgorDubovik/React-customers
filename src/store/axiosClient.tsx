import axios, { AxiosResponse } from "axios";
import env from "./env";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const axiosClient = axios.create({
   baseURL : env.API_URL,
   timeout : 10000,
});


axiosClient.interceptors.request.use((config)=>{
   const token = cookies.get('_auth');
   if(token){
      config.headers.Authorization = `Bearer ${token}`;
   }
   return config;
});

axiosClient.interceptors.response.use((response) =>{
   return response;
},
(error)=>{
   // Handle response errors
   if (error.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      console.error('Response Error:', error.response.data);
      console.error('Status Code:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request Error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
});

export default axiosClient;