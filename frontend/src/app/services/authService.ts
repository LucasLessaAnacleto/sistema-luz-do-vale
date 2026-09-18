import type { LoginRequest, LoginResponse } from "@/app/types/auth";
import { loginMock } from "./mocks/authMock";

export async function loginService(dados: LoginRequest): Promise<LoginResponse> {
  return loginMock(dados);
}
