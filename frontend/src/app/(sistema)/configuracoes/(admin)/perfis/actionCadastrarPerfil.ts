import { redirect } from "next/navigation";

import type { PerfilRequest } from "@/app/types/perfis";
import { criarPerfil } from "@/app/services/perfilService";

import { montarPerfilRequest } from "./montarPerfilRequest";

interface EstadoFormulario {
    erro: string;
    valores: PerfilRequest;
}

export async function actionCadastrarPerfil(estadoAnterior: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {

    const dados = montarPerfilRequest(formData);

    try {

        await criarPerfil(dados);

    } catch (error) {

        return {
            erro: error instanceof Error ? error.message : "Erro ao cadastrar perfil.",
            valores: dados
        };
    }

    redirect("/configuracoes/perfis");
}
