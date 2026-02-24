import axios from "axios";


const api  = axios.create({
  baseURL:`${import.meta.env.VITE_BACK_END_URL}/api`,
  withCredentials:true,
});


// ✅ Request interceptor to attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    if (authData?.jwtToken) {
      config.headers.Authorization = `Bearer ${authData.jwtToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
