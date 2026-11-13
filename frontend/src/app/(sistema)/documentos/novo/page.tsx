"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, FileText, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import type { TipoDocumento } from "@/app/types/documentos";
import type { Paciente } from "@/app/types/pacientes";

import { listarTiposDocumento } from "@/app/services/tipoDocumentoService";
import { buscarListaPacientes } from "@/app/services/pacienteService";

import { normalizeSearch } from "@/app/util";

import BotaoVoltar from "@/app/components/ui/BotaoVoltar";
import BarraPesquisa from "@/app/components/ui/BarraPesquisa";
import AvatarIniciais from "@/app/components/ui/AvatarIniciais";
import BadgeStatus from "@/app/components/ui/BudgeStatus";
import Card from "@/app/components/ui/Card";
import ItemsVazio from "@/app/components/ItemsVazio";
import CarregandoConteudo from "@/app/components/CarregandoConteudo";
import ErroCarregamento from "@/app/components/ErroCarregamento";
import BotaoVoltarEtapa from "@/app/components/ui/BotaoVoltarEtapa";


export default function NovoDocumentoPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const pacienteId = searchParams.get("paciente");

    const [search, setSearch] = useState("");

    const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
    const [pacientes, setPacientes] = useState<Paciente[]>([]);

    const [tipoSelecionado, setTipoSelecionado] = useState<TipoDocumento | null>(null);

    const [carregandoTipos, setCarregandoTipos] = useState(true);
    const [carregandoPacientes, setCarregandoPacientes] = useState(false);

    const [erroTipos, setErroTipos] = useState("");
    const [erroPacientes, setErroPacientes] = useState("");

    useEffect(() => {
        carregarTiposDocumento();
    }, []);

    async function carregarTiposDocumento() {
        try {
            setCarregandoTipos(true);
            setErroTipos("");

            const dados = await listarTiposDocumento();
            setTiposDocumento(
                dados.filter((tipo) => tipo.nome !== "Ficha de Acolhimento")
            );
        } catch (error) {
            setErroTipos( error instanceof Error ? error.message : "Erro ao carregar os tipos de documento.");
        } finally {
            setCarregandoTipos(false);
        }
    }


    async function carregarPacientes() {
        try {
            setCarregandoPacientes(true);
            setErroPacientes("");
            
            const dados = await buscarListaPacientes(true);
            setPacientes(dados);
        } catch (error) {
            setErroPacientes(error instanceof Error ? error.message : "Erro ao carregar os pacientes.");
        } finally {
            setCarregandoPacientes(false);
        }
    }


    function selecionarTipo(tipo: TipoDocumento) {
        if (pacienteId) {
            router.push(`/documentos/novo/${tipo.id}?paciente=${pacienteId}`);
            return;
        }

        setTipoSelecionado(tipo);
        setSearch("");
        if (!pacientes.length) {
            carregarPacientes();
        }
    }


    function selecionarPaciente(paciente: Paciente) {
        if (!tipoSelecionado) {
            return;
        }

        router.push(`/documentos/novo/${tipoSelecionado.id}?paciente=${paciente.id}`);
    }

    function voltarParaTipos() {
        setTipoSelecionado(null);
        setSearch("");
    }

    const selecionandoPaciente = !pacienteId && tipoSelecionado !== null;
    const tiposFiltrados = tiposDocumento.filter((tipo) =>
        normalizeSearch(`${tipo.nome} ${tipo.descricao ?? ""}`).includes(normalizeSearch(search))
    );

    const pacientesFiltrados = pacientes.filter((paciente) =>
        normalizeSearch(`${paciente.nome} ${paciente.apelido ?? ""}`).includes(
            normalizeSearch(search)
        )
    );

    const voltarHref = pacienteId ? `/pacientes/${pacienteId}` : "/documentos";
    return (
        <>
            <section className="border-b border-border bg-card">
                <div className="mx-auto max-w-3xl px-5 py-6 sm:px-8">
                    <div className="flex items-center gap-3">

                        {selecionandoPaciente ? (
                            <BotaoVoltarEtapa onClick={voltarParaTipos}/>
                        ) : (
                            <BotaoVoltar href={voltarHref} />
                        )}

                        <div>
                            <h1 className="text-2xl font-semibold">
                                {selecionandoPaciente ? "Selecionar paciente" : "Novo documento"}
                            </h1>

                            <p className="mt-0.5 text-xs text-muted-foreground">
                                {selecionandoPaciente ? `Paciente para ${tipoSelecionado?.nome}` : "Selecione o tipo de documento"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5">
                        <BarraPesquisa value={search} onChange={setSearch} 
                            placeholder={selecionandoPaciente ? "Buscar por nome ou apelido..." : "Buscar tipo de documento..."}
                        />
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-3xl space-y-3 px-5 py-6 sm:px-8">
                {selecionandoPaciente ? (

                    carregandoPacientes ? (
                        
                        <CarregandoConteudo mensagem="Carregando pacientes..." />

                    ) : erroPacientes ? (

                        <ErroCarregamento mensagem={erroPacientes} onRetry={carregarPacientes}/>

                    ) : pacientesFiltrados.length ? (

                        pacientesFiltrados.map((paciente) => (
                            <button key={paciente.id} type="button" onClick={() => selecionarPaciente(paciente)}
                                className="block w-full cursor-pointer text-left"
                            >
                                <Card className="flex items-center gap-4 transition-colors hover:border-primary/40">
                                    <AvatarIniciais nome={paciente.nome} tamanho="md"/>

                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-sm font-medium">
                                            {paciente.nome}
                                        </h2>

                                        {paciente.apelido && (
                                            <p className="mt-0.5 text-xs text-muted-foreground">{paciente.apelido}</p>
                                        )}
                                    </div>

                                    <BadgeStatus texto="Ativo" tipo="sucesso"/>
                                </Card>
                            </button>
                        ))
                    ) : (

                        <ItemsVazio
                            titulo="Nenhum paciente encontrado"
                            descricao="Tente buscar por outro nome ou apelido."
                            icon={Search}
                        />
                    )

                ) : (

                    carregandoTipos ? (

                        <CarregandoConteudo mensagem="Carregando tipos de documento..." />

                    ) : erroTipos ? (

                        <ErroCarregamento mensagem={erroTipos} onRetry={carregarTiposDocumento}/>

                    ) : tiposFiltrados.length ? (

                        tiposFiltrados.map((tipo) => (

                            <button
                                key={tipo.id}
                                type="button"
                                onClick={() => selecionarTipo(tipo)}
                                className="block w-full cursor-pointer text-left"
                            >
                                <Card className="flex items-center gap-4 transition-colors hover:border-primary/40">
                                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <FileText className="h-5 w-5" />
                                    </span>

                                    <div className="min-w-0 flex-1">

                                        <h2 className="text-sm font-medium">{tipo.nome}</h2>

                                        <p className="mt-0.5 text-xs text-muted-foreground">{tipo.descricao}</p>

                                        {tipo.exigeAssinatura && (
                                            <p className="mt-1 text-xs text-warning">Exige assinatura</p>
                                        )}
                                    </div>
                                </Card>
                            </button>
                        ))

                    ) : (

                        <ItemsVazio
                            titulo="Nenhum documento encontrado"
                            descricao="Tente buscar por outro tipo de documento."
                            icon={Search}
                        />

                    )

                )}
            </section>
        </>
    );
}