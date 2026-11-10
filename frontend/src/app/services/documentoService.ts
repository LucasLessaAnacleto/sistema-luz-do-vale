import { Pagina } from "../types/pagina";
import api from "./api";

import type { CriarDocumentoRequest, Documento, DocumentoDetalhes, DocumentoLista } from "@/app/types/documentos";


export async function criarDocumento(dados: CriarDocumentoRequest): Promise<Documento> {

    const response = await api.post<Documento>("/documentos", dados);

    return response.data;
}

export async function listarDocumentos(pagina = 0): Promise<Pagina<DocumentoLista>> {

  const response = await api.get<Pagina<DocumentoLista>>("/documentos",{ params: { pagina } });

  return response.data;
}


export async function listarDocumentosRecentes(): Promise<DocumentoLista[]> {

  const response = await api.get<DocumentoLista[]>("/documentos/recentes");

  return response.data;
}


export async function buscarDocumento(id: number): Promise<DocumentoDetalhes> {

  const response = await api.get<DocumentoDetalhes>(`/documentos/${id}`);

  return response.data;
}

export async function buscarHtmlDocumento(id: number): Promise<string> {

    const response = await api.get<string>(`/documentos/${id}/html`);

    return response.data;
}


export async function buscarPdfDocumento(id: number): Promise<Blob> {

    const response = await api.get<Blob>(`/documentos/${id}/pdf`, {
        responseType: "blob",
    });

    return response.data;
}