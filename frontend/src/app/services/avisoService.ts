import type { Aviso, CriarAvisoRequest } from "@/app/types/avisos";
import type { Pagina } from "@/app/types/pagina";
import api from "./api";

export async function listarAvisos(pagina = 0, ativo?: boolean): Promise<Pagina<Aviso>> {

    const response = await api.get<Pagina<Aviso>>("/avisos", {
        params: { pagina, ativo }
    });
    return response.data;
}

export async function buscarAviso(id: number): Promise<Aviso> {

    const response = await api.get<Aviso>(`/avisos/${id}`);
    return response.data;
}

export async function criarAviso(dados: CriarAvisoRequest): Promise<void> {

    await api.post("/avisos", dados);
}

export async function desativarAviso(id: number): Promise<void> {

    await api.patch(`/avisos/${id}/desativar`);
}