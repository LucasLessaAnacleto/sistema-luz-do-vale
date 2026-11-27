import { redirect } from "next/navigation";

import type { PerfilRequest } from "@/app/types/perfis";
import { criarPerfil } from "@/app/services/perfilService";

import { montarPerfilRequest } from "./montarPerfilRequest";
import { mensagemErro } from "@/app/util";

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
            erro: mensagemErro(error, "Erro ao cadastrar perfil."),
            valores: dados
        };
    }

    redirect("/configuracoes/perfis");
}
