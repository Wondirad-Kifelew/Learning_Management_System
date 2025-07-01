import axios from "axios";
const api = import.meta.env.MODE === 'development'?
            import.meta.env.VITE_BACKEND_URL_PRODUCTION:
            
            // import.meta.env.VITE_BACKEND_URL_DEVELOPMENT:
            import.meta.env.VITE_BACKEND_URL_PRODUCTION
const axiosInstance = axios.create({
    baseURL: 'https://lms-backend-rrhg.onrender.com',
    withCredentials:true
})

export default axiosInstance