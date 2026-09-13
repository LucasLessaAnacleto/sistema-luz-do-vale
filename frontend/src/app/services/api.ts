import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3010",
  withCredentials: true,
  timeout: 15000,
});

export default api;
