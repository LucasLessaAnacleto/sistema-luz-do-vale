import axios from "axios";
import Cookies from "js-cookie";
import { logout } from "../redux/slices/authSlice";
import { store } from "../redux/store";


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");

  if (token && token !== "demo-token") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use((response) => response, (error) => {

    const status = error.response?.status;
    const mensagemBackend = error.response?.data?.message;

    if (status === 401) {

        const isLogin = error.config?.url?.includes("/auth/login");
        
        if (!isLogin) {
            store.dispatch(logout());
            // window.location.replace("/login");
            return Promise.reject(new Error("Sua sessão expirou. Entre novamente."));
        }

        return Promise.reject(new Error("E-mail ou senha inválidos."));
    }

    if (status === 403) {

        return Promise.reject(new Error( mensagemBackend || "Você não tem permissão para realizar esta ação." ));
    }


    if (mensagemBackend) {

        return Promise.reject(
            new Error(mensagemBackend)
        );
    }


    return Promise.reject(error);
  }
);

export default api;