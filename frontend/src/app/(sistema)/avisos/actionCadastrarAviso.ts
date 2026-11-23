import { criarAviso } from "@/app/services/avisoService";
import { CriarAvisoRequest } from "@/app/types/avisos";

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
            erro: error instanceof Error ? error.message : "Erro ao cadastrar aviso.",
            sucesso: false,
            valores
        };

    }
}