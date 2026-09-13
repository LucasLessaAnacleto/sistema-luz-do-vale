import type { LoginRequest, LoginResponse } from "@/app/types/auth";
import type { Usuario } from "@/app/types/usuarios";

// Apenas demonstração local. Este marcador não concede acesso a uma API.
const SESSION_KEY = "reabilitah.mock.sessao";
const usuario: Usuario = {
  id: 1,
  nome: "Equipe de demonstração",
  email: "demo@reabilitah.com.br",
};

export async function loginMock(dados: LoginRequest): Promise<LoginResponse> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  if (dados.email.trim().toLowerCase() !== usuario.email || dados.senha !== "Demo123!") {
    throw new Error("Email ou senha inválidos.");
  }
  try {
    sessionStorage.setItem(SESSION_KEY, "ativa");
  } catch {
    throw new Error("Permita o armazenamento neste navegador para entrar na demonstração.");
  }
  return { usuario: { ...usuario } };
}

export async function buscarSessaoMock(): Promise<Usuario | null> {
  return sessionStorage.getItem(SESSION_KEY) === "ativa" ? { ...usuario } : null;
}

export async function logoutMock(): Promise<void> {
  sessionStorage.removeItem(SESSION_KEY);
}
