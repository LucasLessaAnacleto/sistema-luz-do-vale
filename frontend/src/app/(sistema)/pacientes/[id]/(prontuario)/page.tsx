"use client";

import { use, useEffect, useState } from "react";
import { ClipboardList, Download, UserRound, Users } from "lucide-react";

import type { OpcaoLista } from "@/app/types/documentos";
import type { PacienteDetalhes } from "@/app/types/pacientes";

import { buscarPaciente } from "@/app/services/pacienteService";
import { buscarLista } from "@/app/services/listaService";
import { buscarPdfDocumento } from "@/app/services/documentoService";

import Card from "@/app/components/ui/Card";
import ListaDetalhes from "@/app/components/ListaDetalhes";
import ModalErro from "@/app/components/ModalErro";
import CarregandoConteudo from "@/app/components/CarregandoConteudo";
import ErroCarregamento from "@/app/components/ErroCarregamento";
import { mensagemErro } from "@/app/util";

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
    const [baixandoPdf, setBaixandoPdf] = useState(false);
    const [erro, setErro] = useState("");
    const [erroAcao, setErroAcao] = useState("");

    useEffect(() => {
        carregarDados();
    }, [id]);

    async function carregarDados() {

        try {
            const dadosPaciente = await buscarPaciente(Number(id));

            setPaciente(dadosPaciente);

            const [listaDependencias, listaLicitas, listaIlicitas] = await Promise.all([
                buscarLista("TIPO_DEPENDENCIA"),
                buscarLista("TIPO_DEPENDENCIA_LICITA"),
                buscarLista("TIPO_DEPENDENCIA_ILICITA"),
            ]);

            setDependencias(listaDependencias);
            setDependenciasLicitas(listaLicitas);
            setDependenciasIlicitas(listaIlicitas);

        } catch (error) {
            setErro(mensagemErro(error, "Erro ao carregar o prontuário."));
        }
    }

    async function baixarFichaPdf() {
        if (!paciente?.fichaAcolhimento) {
            return;
        }

        try {
            setBaixandoPdf(true);

            const fichaId = paciente.fichaAcolhimento.id;
            const pdf = await buscarPdfDocumento(fichaId);

            const url = URL.createObjectURL(pdf);
            const link = document.createElement("a");

            link.href = url;
            link.download = `ficha-acolhimento-${paciente.id}.pdf`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(url);

        } catch (error) {
            setErroAcao(mensagemErro(error, "Erro ao baixar ficha de acolhimento."));
        } finally {
            setBaixandoPdf(false);
        }
    }


    if (!paciente) {
        return erro ? <ErroCarregamento mensagem={erro} /> : <CarregandoConteudo mensagem="Carregando prontuário..." />;
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

            {erro && (
                <ErroCarregamento mensagem={erro} />
            )}

            <Card>
                <div className="mb-4 flex items-center justify-between gap-3">

                    <h2 className="flex items-center gap-2 text-lg font-semibold">
                        <UserRound className="h-5 w-5 shrink-0 text-primary" />
                        Dados do Acolhido
                    </h2>

                    {ficha && (
                        <button
                            type="button"
                            onClick={baixarFichaPdf}
                            disabled={baixandoPdf}
                            title="Baixar ficha de acolhimento"
                            aria-label="Baixar ficha de acolhimento"
                            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary/10 text-primary-dark transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Download className="h-4 w-4" />
                        </button>
                    )}

                </div>

                <ListaDetalhes campos={dadosAcolhido} />
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

                <ListaDetalhes campos={dadosDependencia} />
            </Card>


            <Card>

                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                    <Users className="h-5 w-5 shrink-0 text-primary" />
                    Dados do Responsável
                </h2>

                {responsavel ? (

                    <ListaDetalhes campos={dadosResponsavel} />

                ) : (

                    <p className="text-sm text-muted-foreground">
                        Nenhum responsável informado.
                    </p>

                )}

            </Card>

            <ModalErro aberto={erroAcao !== ""} mensagem={erroAcao} onFechar={() => setErroAcao("")} />

        </div>
    );
}