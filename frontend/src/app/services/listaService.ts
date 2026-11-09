import api from "./api";

import type { OpcaoLista } from "@/app/types/documentos";


export async function buscarLista(nomeLista: string): Promise<OpcaoLista[]> {

    const response = await api.get<OpcaoLista[]>(`/listas/${nomeLista}`);

    return response.data;
}