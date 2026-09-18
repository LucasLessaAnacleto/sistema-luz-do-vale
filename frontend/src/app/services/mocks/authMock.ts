import type { LoginRequest, LoginResponse } from "@/app/types/auth";
import { Usuario } from "@/app/types/usuarios";

const usuario = new Usuario(1, "Equipe de demonstração", "demo@reabilitah.com.br", "ATIVO", "");

export async function loginMock(dados: LoginRequest): Promise<LoginResponse> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  if (dados.email.trim().toLowerCase() !== usuario.email || dados.senha !== "Demo123!") {
    throw new Error("Email ou senha inválidos.");
  }
  return { usuario: { ...usuario }, token: "demo-token" };
}
