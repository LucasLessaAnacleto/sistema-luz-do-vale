import type { Perfil, PerfilRequest } from "@/app/types/perfis";
import api from "./api";

export async function listarPerfis(): Promise<Perfil[]> {

    const response = await api.get<Perfil[]>("/perfis");

    return response.data;
}

export async function buscarPerfil(id: number): Promise<Perfil> {

    const response = await api.get<Perfil>(`/perfis/${id}`);

    return response.data;
}

export async function criarPerfil(dados: PerfilRequest): Promise<Perfil> {

    const response = await api.post<Perfil>("/perfis", dados);

    return response.data;
}

export async function editarPerfil(id: number, dados: PerfilRequest): Promise<Perfil> {

    const response = await api.put<Perfil>(`/perfis/${id}`, dados);

    return response.data;
}
