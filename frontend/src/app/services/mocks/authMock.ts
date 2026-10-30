import type { LoginRequest, LoginResponse } from "@/app/types/auth";
import { Usuario } from "@/app/types/usuarios";

const usuario: Usuario = {
  id: 1,
  profissionalId: null,
  nome: "Usuário de teste",
  telefone: null,
  regProfissional: null,
  cpf: null,
  dtNasc: null,
  endereco: null,
  email: "teste@teste.com",
  role: "ROLE_USER",
  perfilId: null,
  perfil: null,
  ativo: true,
  dtCriacao: "2026-10-29T00:00:00",
  dtDesativado: null,
};

export async function loginMock(dados: LoginRequest): Promise<LoginResponse> {
  
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  if (dados.email.trim().toLowerCase() !== usuario.email || dados.senha !== "123") {
    throw new Error("Email ou senha inválidos.");
  }
  return { usuario: { ...usuario }, token: "demo-token" };
}
