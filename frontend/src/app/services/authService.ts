import type {LoginRequest, LoginApiResponse,} from "@/app/types/auth";
import api from "./api";


export async function loginService(dados: LoginRequest): Promise<LoginApiResponse> {

    const resultado = await api.post<LoginApiResponse>("/auth/login", dados);

    return resultado.data;
}
