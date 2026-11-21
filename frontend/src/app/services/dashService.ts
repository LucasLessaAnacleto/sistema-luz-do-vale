import type { DashResponse } from "@/app/types/dash";
import api from "./api";

export async function indicadoresGerais(): Promise<DashResponse> {

    const response = await api.get<DashResponse>("/dashboard");
    return response.data;
}

export async function contarDocumentosMes(ano: number, mes: number): Promise<number> {

    const response = await api.get<number>("/dashboard/documentos-mes", {
        params: { ano, mes }
    });

    return response.data;
}