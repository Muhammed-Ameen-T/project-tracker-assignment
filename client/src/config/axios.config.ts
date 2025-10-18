import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 20000,
})

export default api