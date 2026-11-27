"use client";

import { CriarDocumentoRequest } from "@/app/types/documentos";
import { criarDocumento } from "@/app/services/documentoService";
import { mensagemErro } from "@/app/util";

export interface EstadoFormularioDocumento {
    erro: string;
    documentoId: number | null;
    valores: Record<string, string>;
};

export async function actionCadastrarDocumento(_estado: EstadoFormularioDocumento, form: FormData): Promise<EstadoFormularioDocumento> {

    const valores: Record<string, string> = {};

    for (const [nome, valor] of form.entries()) {

        if (nome !== "tipoDocumentoVersaoId" && nome !== "pacienteId" && nome !== "observacao" && nome !== "documentoOrigemId") {
            valores[nome] = String(valor);
        }
    }


    const origem = form.get("documentoOrigemId");

    const dados: CriarDocumentoRequest = {
        tipoDocumentoVersaoId: Number(form.get("tipoDocumentoVersaoId")),
        pacienteId: Number(form.get("pacienteId")),
        observacao: String(form.get("observacao") || "") || null,
        dados: valores,
        documentoOrigemId: origem ? Number(origem) : null,
    };

    try {
        const documento = await criarDocumento(dados);

        return {
            erro: "",
            documentoId: documento.id,
            valores: {},
        };
    } catch (error) {
        
        return {
            erro: mensagemErro(error, "Erro ao criar documento."),
            documentoId: null,
            valores,
        };
    }
}