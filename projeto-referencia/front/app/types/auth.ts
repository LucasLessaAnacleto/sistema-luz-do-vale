import { Usuario } from "./usuarios";

export interface LoginResponse{
    token: string
}

export interface LoginRequest{
    email: string,
    senha: string
}

export interface AuthState {
    usuario: Usuario | null; 
    token: string;
    status: "verificando" | "autenticado" | "naoAutenticado";
}