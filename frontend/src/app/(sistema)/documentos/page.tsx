"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText, Funnel, Search } from "lucide-react";

import type { DocumentoLista } from "@/app/types/documentos";
import type { UsuarioNome } from "@/app/types/usuarios";
import type { Paciente } from "@/app/types/pacientes";
import { listarDocumentos } from "@/app/services/documentoService";
import { listarNomesUsuarios } from "@/app/services/usuarioService";
import { buscarListaPacientes } from "@/app/services/pacienteService";
import { formatarData, mensagemErro } from "@/app/util";

import BarraPesquisa from "@/app/components/ui/BarraPesquisa";
import BotaoNovo from "@/app/components/ui/BotaoNovo";
import BudgetFiltros from "@/app/components/ui/BudgetFiltros";
import BudgetStatus from "@/app/components/ui/BudgeStatus";
import Selecao from "@/app/components/ui/Selecao";
import AvatarIniciais from "@/app/components/ui/AvatarIniciais";
import Card from "@/app/components/ui/Card";
import ItemsVazio from "@/app/components/ItemsVazio";
import ErroCarregamento from "@/app/components/ErroCarregamento";
import CarregandoConteudo from "@/app/components/CarregandoConteudo";
import DocumentosRecentes from "../home/components/DocumentosRecentes";
import BotaoVoltarHistorico from "@/app/components/ui/BotaoVoltarHistorico";

export default function DocumentosPage() {
    const searchParams = useSearchParams();
    const origem = searchParams.get("origem");

    const [documentos, setDocumentos] = useState<DocumentoLista[]>([]);
    const [pagina, setPagina] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [totalDocumentos, setTotalDocumentos] = useState(0);

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");   

    const [search, setSearch] = useState("");
    const [busca, setBusca] = useState("");

    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    const [funcionarios, setFuncionarios] = useState<UsuarioNome[]>([]);
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [erroFuncionarios, setErroFuncionarios] = useState(false);
    const [erroPacientes, setErroPacientes] = useState(false);

    const [criadoPor, setCriadoPor] = useState("");
    const [pacienteId, setPacienteId] = useState("");
    const [tipoData, setTipoData] = useState("dia");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [situacao, setSituacao] = useState("ativos");
    
    type FiltroDocumento = "todos" | "pendentes" | "finalizados";
    const [filtro, setFiltro] = useState<FiltroDocumento>("todos");

    const status = filtro === "pendentes" ? "PENDENTE" :
        filtro === "finalizados" ? "FINALIZADO" :
        undefined;

    let filtrosAtivos = 0;
    if (criadoPor) filtrosAtivos++;
    if (pacienteId) filtrosAtivos++;
    if (dataInicio || dataFim) filtrosAtivos++;
    if (situacao === "inativos") filtrosAtivos++;

    const estiloData = "h-9 rounded-lg border border-border bg-input-background px-2.5 text-sm focus:ring-2 focus:ring-ring focus:outline-none";

    useEffect(() => {
        let cancelado = false;

        async function carregarDocumentos() {
            try {
                setCarregando(true);
                setErro("");

                const dados = await listarDocumentos(pagina, {
                    status,
                    busca,
                    usuarioId: criadoPor ? Number(criadoPor) : undefined,
                    pacienteId: pacienteId ? Number(pacienteId) : undefined,
                    dataInicio: dataInicio || undefined,
                    dataFim: (tipoData === "periodo" ? dataFim : dataInicio) || undefined,
                    ativo: situacao === "ativos",
                });

                if (!cancelado) {
                    setDocumentos(dados.content);
                    setTotalPaginas(dados.totalPages);
                    setTotalDocumentos(dados.totalElements);
                }
            } catch (error) {
                if (!cancelado) {
                    setErro(mensagemErro(error, "Erro ao carregar documentos."));
                }
            } finally {
                if (!cancelado) {
                    setCarregando(false);
                }
            }
        }
        carregarDocumentos();

        return () => {
            cancelado = true;
        };
    }, [pagina, filtro, busca, criadoPor, pacienteId, tipoData, dataInicio, dataFim, situacao]);

    useEffect(() => {
        carregarFuncionarios();
        carregarPacientes();
    }, []);

    useEffect(() => {
        const espera = setTimeout(() => {
            setPagina(0);
            setBusca(search);
        }, 400);

        return () => clearTimeout(espera);
    }, [search]);

    async function carregarFuncionarios() {
        try {
            const dados = await listarNomesUsuarios();
            setFuncionarios(dados);
        } catch {
            setErroFuncionarios(true);
        }
    }

    async function carregarPacientes() {
        try {
            const dados = await buscarListaPacientes();
            setPacientes(dados.sort((a, b) => a.nome.localeCompare(b.nome)));
        } catch {
            setErroPacientes(true);
        }
    }

    function limparFiltros() {
        setPagina(0);
        setCriadoPor("");
        setPacienteId("");
        setTipoData("dia");
        setDataInicio("");
        setDataFim("");
        setSituacao("ativos");
        setMostrarFiltros(false);
    }

    return (
        <>
            <section className="border-b border-border bg-card">
                <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
                    <div className="flex items-center justify-between gap-4">

                        <div className="flex items-center gap-3">
                            {origem && (
                                <BotaoVoltarHistorico />
                            )}

                            <div className="min-w-0">
                                <h1 className="text-2xl font-semibold">Documentos</h1>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {totalDocumentos} documentos no total
                                </p>
                            </div>
                        </div>

                        <BotaoNovo href="/documentos/novo" texto="Novo documento" />

                    </div>  

                    <div className="mt-5">
                        <div className="flex gap-2">

                            <div className="min-w-0 flex-1">
                                <BarraPesquisa value={search} onChange={setSearch} placeholder="Buscar por tipo, número ou hash..."
                                    title="Busque pelo tipo do documento, pelo número (16) ou pelo começo ou fim do hash"
                                />
                            </div>

                            <button type="button" title="Filtros" onClick={() => setMostrarFiltros(!mostrarFiltros)}
                                className={`relative flex w-12 shrink-0 cursor-pointer items-center justify-center rounded-2xl border transition-colors
                                    ${mostrarFiltros ? "border-secondary bg-accent text-primary-dark" : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-primary-dark"}`}
                            >
                                <Funnel className="h-5 w-5" />

                                {filtrosAtivos > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-white">
                                        {filtrosAtivos}
                                    </span>
                                )}
                            </button>

                        </div>

                        {mostrarFiltros && (
                            <div className="mt-3 flex flex-wrap items-end gap-x-5 gap-y-3 rounded-2xl border border-border bg-background px-4 py-3.5">

                                <Selecao tamanho="sm" label="Criado por" value={criadoPor} erro={erroFuncionarios}
                                    onChange={(e) => {
                                        setPagina(0);
                                        setCriadoPor(e.target.value);
                                    }}
                                >
                                    <option value="">Todos</option>

                                    {funcionarios.map((funcionario) => (
                                        <option key={funcionario.id} value={funcionario.id}>
                                            {funcionario.nome}
                                        </option>
                                    ))}
                                </Selecao>

                                <Selecao tamanho="sm" label="Paciente" value={pacienteId} erro={erroPacientes}
                                    onChange={(e) => {
                                        setPagina(0);
                                        setPacienteId(e.target.value);
                                    }}
                                >
                                    <option value="">Todos</option>

                                    {pacientes.map((paciente) => (
                                        <option key={paciente.id} value={paciente.id}>
                                            {paciente.nome}
                                        </option>
                                    ))}
                                </Selecao>

                                <div className="flex flex-wrap items-end gap-1.5">

                                    <Selecao tamanho="sm" label="Data de criação" value={tipoData}
                                        onChange={(e) => {
                                            setPagina(0);
                                            setTipoData(e.target.value);
                                        }}
                                    >
                                        <option value="dia">Dia</option>
                                        <option value="periodo">Período</option>
                                    </Selecao>

                                    <input type="date" value={dataInicio} className={estiloData}
                                        onChange={(e) => {
                                            setPagina(0);
                                            setDataInicio(e.target.value);
                                        }}
                                    />

                                    {tipoData === "periodo" && (
                                        <>
                                            <span className="pb-2 text-xs text-muted-foreground">até</span>

                                            <input type="date" value={dataFim} className={estiloData}
                                                onChange={(e) => {
                                                    setPagina(0);
                                                    setDataFim(e.target.value);
                                                }}
                                            />
                                        </>
                                    )}

                                </div>

                                <Selecao tamanho="sm" label="Situação" value={situacao}
                                    onChange={(e) => {
                                        setPagina(0);
                                        setSituacao(e.target.value);
                                    }}
                                >
                                    <option value="ativos">Ativos</option>
                                    <option value="inativos">Inativos</option>
                                </Selecao>

                                <button type="button" onClick={limparFiltros}
                                    className="ml-auto h-9 cursor-pointer text-xs font-medium text-primary-dark hover:underline"
                                >
                                    Limpar filtros
                                </button>

                            </div>
                        )}

                        <div className="mt-3">
                            <BudgetFiltros
                                valor={filtro}
                                onChange={(valor) => {
                                    setPagina(0);
                                    setFiltro(valor as FiltroDocumento);
                                }}
                                opcoes={[
                                    { valor: "todos", label: "Todos" },
                                    { valor: "pendentes", label: "Pendentes" },
                                    { valor: "finalizados", label: "Finalizados" },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl space-y-3 px-5 py-4 sm:px-8">

                {carregando ? (
                    <CarregandoConteudo mensagem="Carregando documentos..." />

                ) : erro ? (
                    <ErroCarregamento mensagem={erro} />

                ) : documentos.length ? (

                    documentos.map(documento => (
                        <Card key={documento.id} className="relative flex items-start gap-3 transition-colors hover:border-primary/40">

                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <FileText className="h-5 w-5" />
                            </span>

                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <h2 className="break-words text-sm font-medium">
                                            <Link href={`/documentos/${documento.id}`} className="after:absolute after:inset-0 after:rounded-2xl hover:text-primary-dark">
                                                {documento.tipoDocumento}
                                            </Link>
                                        </h2>

                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            Documento #{documento.id} · Versão {documento.versao}
                                        </p>
                                    </div>

                                    {documento.ativo ? (
                                        <BudgetStatus
                                            texto={documento.status === "FINALIZADO" ? "Finalizado" : "Pendente"}
                                            tipo={documento.status === "FINALIZADO" ? "sucesso" : "alerta"}
                                        />
                                    ) : (
                                        <BudgetStatus texto="Inativo" tipo="neutro" />
                                    )}
                                </div>

                                <Link href={`/pacientes/${documento.pacienteId}`} className="relative z-10 mt-3 flex w-fit max-w-full items-center gap-2">
                                    <AvatarIniciais nome={documento.paciente} tamanho="sm" />

                                    <span className="text-xs">
                                        {documento.paciente}

                                        {documento.apelido && (
                                            <span className="text-muted-foreground">
                                                {" "}({documento.apelido})
                                            </span>
                                        )}
                                    </span>
                                </Link>

                                <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
                                    <p>{documento.criadoPor}</p>
                                    <p>{formatarData(documento.dtCriacao)}</p>
                                </div>
                            </div>
                        </Card>
                    ))

                ) : (
                    <ItemsVazio
                        titulo="Nenhum documento encontrado"
                        descricao="Tente buscar por outro termo ou altere o filtro."
                        icon={Search}
                    />
                )}

            </section>

            {totalPaginas > 1 && (

                <div className="flex items-center justify-center gap-3 py-4">

                    <button type="button" disabled={pagina === 0} onClick={() => setPagina(pagina - 1)}
                        className="rounded-xl border border-border bg-card px-4 py-2 text-sm enabled:cursor-pointer enabled:hover:bg-accent disabled:opacity-50"
                    >
                        Anterior
                    </button>

                    <span className="text-sm text-muted-foreground">
                        Página {pagina + 1} de {totalPaginas}
                    </span>

                    <button type="button" disabled={pagina + 1 >= totalPaginas} onClick={() => setPagina(pagina + 1)} 
                        className="rounded-xl border border-border bg-card px-4 py-2 text-sm enabled:cursor-pointer enabled:hover:bg-accent disabled:opacity-50"
                    >
                        Próxima
                    </button>

                </div>
            )}
        </>
    );
}
