import type { LoginRequest, LoginResponse } from "@/app/types/auth";
import type { Usuario } from "@/app/types/usuarios";
import { buscarSessaoMock, loginMock, logoutMock } from "./mocks/authMock";

// Na integração, substituir somente estas implementações por chamadas ao api.ts.
// O backend estabelecerá a sessão por cookie HttpOnly; a UI recebe só dados públicos.
export async function loginService(dados: LoginRequest): Promise<LoginResponse> {
  return loginMock(dados);
}

export async function buscarUsuarioLogado(): Promise<Usuario | null> {
  return buscarSessaoMock();
}

export async function logoutService(): Promise<void> {
  return logoutMock();
}
