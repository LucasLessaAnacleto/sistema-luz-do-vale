import { criarAviso } from "@/app/services/avisoService";
import { CriarAvisoRequest } from "@/app/types/avisos";
import { mensagemErro } from "@/app/util";

interface EstadoFormulario {
    erro: string;
    sucesso: boolean;
    valores: {
        mensagem?: string;
        dtFinalizacao?: string;
    };
}

export async function actionCadastrarAviso(estadoAnterior: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
    
    const mensagem = String(formData.get("mensagem") ?? "").trim();
    const dtFinalizacao = String(formData.get("dtFinalizacao") ?? "");

    const valores = { mensagem, dtFinalizacao};

    const dados: CriarAvisoRequest = {
        mensagem,
        dtFinalizacao: dtFinalizacao || null
    };

    try {
        await criarAviso(dados);

        return {
            erro: "",
            sucesso: true,
            valores: {}
        };
    } catch (error) {

        return { 
            erro: mensagemErro(error, "Erro ao cadastrar aviso."),
            sucesso: false,
            valores
        };

    }
}