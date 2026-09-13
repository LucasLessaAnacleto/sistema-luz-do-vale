import type { Usuario } from "./usuarios";

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  usuario: Usuario;
}

export interface AuthState {
  usuario: Usuario | null;
  status: "verificando" | "autenticado" | "naoAutenticado" | "erro";
}
