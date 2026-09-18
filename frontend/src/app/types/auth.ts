import type { Usuario } from "./usuarios";

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  usuario: Usuario;
  token: string;
}

export interface AuthState {
  usuario: Usuario | null;
  token: string;
  status: "verificando" | "autenticado" | "naoAutenticado";
}

export interface LoginFormState {
  email: string;
  senha: string;
  erro: string;
  tentativa: number;
}