import { LoginRequest, LoginResponse } from "../types/auth";
import api from "./api";

export async function loginService(login:LoginRequest) : Promise<LoginResponse> {

       var loginResult = await api.post<LoginResponse>('http://localhost:8080/auth/login',
                login);

        return loginResult.data;
    
}