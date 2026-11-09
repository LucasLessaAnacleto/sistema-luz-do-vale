"use client";

import { use, useEffect, useState } from "react";
import { ClipboardList, UserRound, Users } from "lucide-react";

import type { OpcaoLista } from "@/app/types/documentos";
import type { PacienteDetalhes } from "@/app/types/pacientes";

import { buscarPaciente } from "@/app/services/pacienteService";
import { buscarLista } from "@/app/services/listaService";

import Card from "@/app/components/ui/Card";

function formatarDataNascimento(data: string | null) {

    if (!data) {
        return "-";
    }

    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function texto(valor: unknown) {

    if (valor === null || valor === undefined || valor === "") {
        return "-";
    }

    if (valor === true) {
        return "Sim";
    }

    if (valor === false) {
        return "Não";
    }

    return String(valor);
}

function rotuloLista(lista: OpcaoLista[], valor: unknown) {

    if (valor === null || valor === undefined || valor === "") {
        return "-";
    }

    const opcao = lista.find((item) => item.valor === String(valor));

    return opcao ? opcao.rotulo : String(valor);
}

export default function PacientePage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = use(params);

    const [paciente, setPaciente] = useState<PacienteDetalhes | null>(null);

    const [dependencias, setDependencias] = useState<OpcaoLista[]>([]);
    const [dependenciasLicitas, setDependenciasLicitas] = useState<OpcaoLista[]>([]);
    const [dependenciasIlicitas, setDependenciasIlicitas] = useState<OpcaoLista[]>([]);

    useEffect(() => {
        carregarDados();
    }, [id]);

    async function carregarDados() {

        try {
            const dadosPaciente = await buscarPaciente(Number(id));

            setPaciente(dadosPaciente);

            setDependencias(await buscarLista("TIPO_DEPENDENCIA"));
            setDependenciasLicitas(await buscarLista("TIPO_DEPENDENCIA_LICITA"));
            setDependenciasIlicitas(await buscarLista("TIPO_DEPENDENCIA_ILICITA"));

        } catch (error) {

            if (error instanceof Error) {
                alert(error.message);
            }

        }
    }


    if (!paciente) {
        return <p className="text-sm text-muted-foreground">Carregando prontuário...</p>;
    }


    const ficha = paciente.fichaAcolhimento;

    const acolhido = (ficha?.dados.acolhido || {}) as Record<string, unknown>;
    const dependencia = (ficha?.dados.dependencia || {}) as Record<string, unknown>;

    const tiposDependencia = Array.isArray(dependencia.tipos)
        ? dependencia.tipos.map((tipo) => String(tipo))
        : [];


    const dadosAcolhido = [
        { label: "Nome completo", value: paciente.nome },
        { label: "Apelido", value: paciente.apelido || "-" },
        { label: "CPF", value: paciente.cpf || "-" },
        { label: "RG", value: paciente.rg || "-" },
        { label: "Data de nascimento", value: formatarDataNascimento(paciente.dtNasc) },
        { label: "Telefone", value: paciente.telefone || "-" },
        { label: "Nacionalidade", value: texto(acolhido.nacionalidade) },
        { label: "Naturalidade", value: texto(acolhido.naturalidade) },
        { label: "Nome do pai", value: texto(acolhido.nomePai) },
        { label: "Nome da mãe", value: texto(acolhido.nomeMae) },
        { label: "Escolaridade", value: texto(acolhido.escolaridade) },
        { label: "Profissão", value: texto(acolhido.profissao) },
        { label: "Cor", value: texto(acolhido.cor) },
        { label: "Estado civil", value: texto(acolhido.estadoCivil) },
        { label: "Possui filhos", value: texto(acolhido.filhos) },
        { label: "Rua", value: paciente.endereco?.rua || "-" },
        { label: "Número", value: paciente.endereco?.numero || "-" },
        { label: "Bairro", value: paciente.endereco?.bairro || "-" },
        { label: "Município", value: paciente.endereco?.municipio || "-" },
        { label: "Estado", value: paciente.endereco?.estado || "-" },
    ];


    const dadosDependencia = [
        {
            label: "Primeira droga lícita",
            value: rotuloLista(dependenciasLicitas, dependencia.primeiraDrogaLicita),
        },
        {
            label: "Idade da primeira droga lícita",
            value: texto(dependencia.idadePrimeiraDrogaLicita),
        },
        {
            label: "Primeira droga ilícita",
            value: rotuloLista(dependenciasIlicitas, dependencia.primeiraDrogaIlicita),
        },
        {
            label: "Idade da primeira droga ilícita",
            value: texto(dependencia.idadePrimeiraDrogaIlicita),
        },
    ];


    const responsavel = paciente.responsavel;

    const dadosResponsavel = responsavel ? [
        { label: "Nome completo", value: responsavel.nome },
        { label: "Parentesco", value: responsavel.parentesco || "-" },
        { label: "CPF", value: responsavel.cpf || "-" },
        { label: "RG", value: responsavel.rg || "-" },
        { label: "Data de nascimento", value: formatarDataNascimento(responsavel.dtNasc) },
        { label: "Telefone", value: responsavel.telefone || "-" },
        { label: "Rua", value: responsavel.endereco?.rua || "-" },
        { label: "Número", value: responsavel.endereco?.numero || "-" },
        { label: "Bairro", value: responsavel.endereco?.bairro || "-" },
        { label: "Município", value: responsavel.endereco?.municipio || "-" },
        { label: "Estado", value: responsavel.endereco?.estado || "-" },
    ] : [];


    return (
        <div className="space-y-5">

            <Card>

                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                    <UserRound className="h-5 w-5 shrink-0 text-primary" />
                    Dados do Acolhido
                </h2>

                <dl className="divide-y divide-border">

                    {dadosAcolhido.map((campo) => (

                        <div
                            key={campo.label}
                            className="grid grid-cols-[minmax(0,120px)_minmax(0,1fr)] items-start gap-3 py-2 sm:grid-cols-[160px_minmax(0,1fr)]"
                        >
                            <dt className="text-xs leading-5 text-muted-foreground">
                                {campo.label}
                            </dt>

                            <dd className="break-words text-sm">
                                {campo.value}
                            </dd>
                        </div>

                    ))}

                </dl>

            </Card>


            <Card>

                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                    <ClipboardList className="h-5 w-5 shrink-0 text-primary" />
                    Tipos de Dependência
                </h2>

                {tiposDependencia.length ? (

                    <div className="mb-4 flex flex-wrap gap-2">

                        {tiposDependencia.map((tipo) => (

                            <span key={tipo} className="rounded-full bg-accent px-3 py-1 text-sm text-primary-dark">
                                {rotuloLista(dependencias, tipo)}
                            </span>

                        ))}

                    </div>

                ) : (

                    <p className="mb-4 text-sm text-muted-foreground">
                        Nenhum tipo de dependência informado.
                    </p>

                )}


                <dl className="divide-y divide-border">

                    {dadosDependencia.map((campo) => (

                        <div key={campo.label} className="grid grid-cols-[minmax(0,140px)_minmax(0,1fr)] items-start gap-3 py-2 sm:grid-cols-[220px_minmax(0,1fr)]">
                            <dt className="text-xs leading-5 text-muted-foreground">
                                {campo.label}
                            </dt>

                            <dd className="break-words text-sm">
                                {campo.value}
                            </dd>
                        </div>

                    ))}

                </dl>

            </Card>


            <Card>

                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                    <Users className="h-5 w-5 shrink-0 text-primary" />
                    Dados do Responsável
                </h2>

                {responsavel ? (

                    <dl className="divide-y divide-border">

                        {dadosResponsavel.map((campo) => (

                            <div
                                key={campo.label}
                                className="grid grid-cols-[minmax(0,120px)_minmax(0,1fr)] items-start gap-3 py-2 sm:grid-cols-[160px_minmax(0,1fr)]"
                            >
                                <dt className="text-xs leading-5 text-muted-foreground">
                                    {campo.label}
                                </dt>

                                <dd className="break-words text-sm">
                                    {campo.value}
                                </dd>
                            </div>

                        ))}

                    </dl>

                ) : (

                    <p className="text-sm text-muted-foreground">
                        Nenhum responsável informado.
                    </p>

                )}

            </Card>

        </div>
    );
}