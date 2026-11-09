"use client";

import { MouseEvent } from "react";

export default function BotaoPreencherTeste() {
    function preencherDados(event: MouseEvent<HTMLButtonElement>) {
        const form = event.currentTarget.form;

        if (!form) return;

        const dados = {
            nome: "Lucas de Oliveira",
            apelido: "Luquinha",
            cpf: "52998224725",
            rg: "123456789",
            dtNasc: "1998-05-15",
            telefone: "48999998888",

            rua: "Rua das Flores",
            numero: "120",
            bairro: "Centro",
            municipio: "Criciúma",
            estado: "SC",

            responsavelNome: "Maria de Oliveira",
            responsavelParentesco: "Mãe",
            responsavelDtNasc: "1975-08-20",
            responsavelCpf: "11144477735",
            responsavelRg: "987654321",
            responsavelTelefone: "48988887777",

            responsavelRua: "Rua das Flores",
            responsavelNumero: "120",
            responsavelBairro: "Centro",
            responsavelMunicipio: "Criciúma",
            responsavelEstado: "SC",

            nacionalidade: "Brasileira",
            naturalidade: "Criciúma",
            nomePai: "João de Oliveira",
            nomeMae: "Maria de Oliveira",
            escolaridade: "Ensino médio completo",
            profissao: "Auxiliar de produção",
            cor: "Branca",
            estadoCivil: "Solteiro",
            filhos: "true",

            tiposDependencia: "Álcool, Cocaína, Tabaco",
            primeiraDrogaLicita: "Álcool",
            idadePrimeiraDrogaLicita: "15",
            primeiraDrogaIlicita: "Maconha",
            idadePrimeiraDrogaIlicita: "17",
        };

        for (const nome in dados) {
            const campo = form.elements.namedItem(nome);

            if (campo instanceof HTMLInputElement || campo instanceof HTMLSelectElement) {
                campo.value = dados[nome as keyof typeof dados];
                campo.dispatchEvent(new Event("input", { bubbles: true }));
                campo.dispatchEvent(new Event("change", { bubbles: true }));
            }
        }
    };
    
    return (
        <button onClick={preencherDados} className="cursor-pointer rounded-xl p-2 text-sm">
            Preencher dados de teste
        </button>
    );
}