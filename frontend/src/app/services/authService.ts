// import type { LoginRequest, LoginResponse } from "@/app/types/auth";
// import { loginMock } from "./mocks/authMock";

// export async function loginService(dados: LoginRequest): Promise<LoginResponse> {
//   return loginMock(dados);
// }

import type {LoginRequest, LoginApiResponse,} from "@/app/types/auth";
import { loginMock } from "./mocks/authMock";
import api from "./api";


export async function loginService(dados: LoginRequest): Promise<LoginApiResponse> {
  if (process.env.NEXT_PUBLIC_USE_AUTH_MOCK === "true") {
    const resultado = await loginMock(dados);

    return { token: resultado.token };
  }

  const resultado = await api.post<LoginApiResponse>("/auth/login", dados);

  return resultado.data;
}
