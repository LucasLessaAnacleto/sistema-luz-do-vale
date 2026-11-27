import { redirect } from "next/navigation";

import { criarUsuario } from "@/app/services/usuarioService";
import { montarUsuarioRequest } from "./montarUsuarioRequest";
import { mensagemErro } from "@/app/util";

export type EstadoFormulario = {
    erro: string;
    valores?: Record<string, string>;
};

export async function actionCadastrarUsuario(_estado: EstadoFormulario, form: FormData): Promise<EstadoFormulario> {

    const valores: Record<string, string> = {};
    for (const campo of form.entries()) {
        const chave = campo[0];
        const valor = campo[1] ?? "";
        valores[chave] = String(valor).trim();
    }

    const dados = montarUsuarioRequest(form);

    let usuario;

    try {

        usuario = await criarUsuario(dados);

    } catch (error) {

        console.error("Erro ao cadastrar usuário:", error);
        return {
            erro: mensagemErro(error, "Erro ao cadastrar usuário."),
            valores
        };
    }

    redirect(`/configuracoes/equipe/${usuario.id}`);
}
