import { redirect } from "next/navigation";

import type { PacienteRequest } from "@/app/types/pacientes";
import { criarPaciente } from "@/app/services/pacienteService";

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

    valores.tiposDependencia = form.getAll("tiposDependencia")
        .map((tipo) => String(tipo))
        .join(",");

    const tiposDependencia = form.getAll("tiposDependencia")
        .map((tipo) => String(tipo));


    const valorTexto = (campo: string): string | null => {
        const valor = String(form.get(campo) ?? "").trim();

        return valor || null;
    };

    const valorNumero = (campo: string): number | null => {
        const valor = valorTexto(campo);

        if (!valor) {
            return null;
        }

        const numero = Number(valor);

        return Number.isFinite(numero) ? numero : null;
    };

    const filhos = valorTexto("filhos");

    const dados: PacienteRequest = {

        nome: String(form.get("nome") ?? "").trim(),
        apelido: valorTexto("apelido"),
        cpf: String(form.get("cpf") ?? "").trim(),
        rg: String(form.get("rg") ?? "").trim(),
        telefone: valorTexto("telefone"),
        dtNasc: valorTexto("dtNasc"),

        endereco: {
            rua: valorTexto("rua"),
            numero: valorTexto("numero"),
            bairro: valorTexto("bairro"),
            municipio: valorTexto("municipio"),
            estado: valorTexto("estado"),
        },

        responsavel: {

            nome: String(form.get("responsavelNome") ?? "").trim(),
            parentesco: valorTexto("responsavelParentesco"),
            cpf: valorTexto("responsavelCpf"),
            rg: valorTexto("responsavelRg"),
            telefone: valorTexto("responsavelTelefone"),
            dtNasc: valorTexto("responsavelDtNasc"),

            endereco: {
                rua: valorTexto("responsavelRua"),
                numero: valorTexto("responsavelNumero"),
                bairro: valorTexto("responsavelBairro"),
                municipio: valorTexto("responsavelMunicipio"),
                estado: valorTexto("responsavelEstado"),
            },
        },

        fichaAcolhimento: {

            nacionalidade: valorTexto("nacionalidade"),
            naturalidade: valorTexto("naturalidade"),
            nomePai: valorTexto("nomePai"),
            nomeMae: valorTexto("nomeMae"),
            escolaridade: valorTexto("escolaridade"),
            profissao: valorTexto("profissao"),
            cor: valorTexto("cor"),
            estadoCivil: valorTexto("estadoCivil"),

            filhos: filhos === null
                ? null
                : filhos === "true",

            tiposDependencia,

            primeiraDrogaLicita: valorTexto("primeiraDrogaLicita"),
            idadePrimeiraDrogaLicita: valorNumero("idadePrimeiraDrogaLicita"),

            primeiraDrogaIlicita: valorTexto("primeiraDrogaIlicita"),
            idadePrimeiraDrogaIlicita: valorNumero("idadePrimeiraDrogaIlicita"),
        },
    };

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