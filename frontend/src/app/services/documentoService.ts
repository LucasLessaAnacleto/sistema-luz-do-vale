import { Pagina } from "../types/pagina";
import api from "./api";

import type { Documento, DocumentoDetalhes, DocumentoLista } from "@/app/types/documentos";


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