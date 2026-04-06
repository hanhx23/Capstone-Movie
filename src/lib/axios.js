import { LOCAL_STORAGE_KEYS } from "@/constant";
import axios from "axios";

export const api = axios.create({
    baseURL: 'https://movienew.cybersoft.edu.vn/api',
})

// Thêm interceptor để tự động thêm header vào tất cả các request
api.interceptors.request.use((config)=>{
    config.headers = {
        ...config.headers,
        Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)}`,
        TokenCybersoft: import.meta.env.VITE_TOKEN_CYBERSOFT
    }
    return config
})

