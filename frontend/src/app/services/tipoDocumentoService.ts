import api from "./api";

import type { FormularioDocumento, TipoDocumento } from "@/app/types/documentos";


export async function listarTiposDocumento(): Promise<TipoDocumento[]> {

    const response = await api.get<TipoDocumento[]>("/tipos-documento");

    return response.data;
}


export async function buscarFormularioDocumento(tipoDocumentoId: number, pacienteId: number): Promise<FormularioDocumento> {

    const response = await api.get<FormularioDocumento>(
        `/tipos-documento/${tipoDocumentoId}/formulario`, { params: { pacienteId } }
    );

    return response.data;
}