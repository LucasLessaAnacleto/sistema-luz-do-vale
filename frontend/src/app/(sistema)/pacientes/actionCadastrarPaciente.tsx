import { redirect } from "next/navigation";

import { criarPaciente } from "@/app/services/pacienteService";
import { montarPacienteRequest } from "./montarPacienteRequest";

export type EstadoFormulario = {
    erro: string;
    valores?: Record<string, string>;
};

export async function actionCadastrarPaciente(_estado: EstadoFormulario, form: FormData): Promise<EstadoFormulario> {

    const valores: Record<string, string> = {};
    for (const campo of form.entries()) {
        const chave = campo[0];
        const valor = campo[1] ?? "";
        valores[chave] = String(valor).trim();
    }

    valores.tiposDependencia = form.getAll("tiposDependencia").map((tipo) => String(tipo)).join(",");

    const dados = montarPacienteRequest(form);

    let paciente;

    try {

        paciente = await criarPaciente(dados);

    } catch (error) {
        
        console.error("Erro ao cadastrar paciente:", error);
        return { 
            erro: error instanceof Error ? error.message : "Erro ao cadastrar paciente.",
            valores
        };
    }

    redirect(`/pacientes/${paciente.id}`);
}