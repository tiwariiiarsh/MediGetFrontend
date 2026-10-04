import axios from "axios";


export const BACKEND_URL = (import.meta.env.VITE_BACK_END_URL || "").replace(/\/+$/, "");

const api  = axios.create({
  baseURL:`${BACKEND_URL}/api`,
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
