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

let usuarioLogado = usuario;
const admin: Usuario = {
  ...usuario,
  id: 2,
  nome: "Administrador de teste",
  email: "admin@teste.com",
  role: "ROLE_ADMIN",
};

export async function loginMock(dados: LoginRequest): Promise<LoginResponse> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const conta = [usuario, admin].find(
    (item) => item.email === dados.email.trim().toLowerCase(),
  );
  if (!conta || dados.senha !== "123") {
    throw new Error("Email ou senha inválidos.");
  }

  usuarioLogado = conta;
  return { usuario: { ...usuarioLogado }, token: "demo-token" };
}

export async function buscarUsuarioLogadoMock(): Promise<Usuario> {
  return { ...usuarioLogado };
}
