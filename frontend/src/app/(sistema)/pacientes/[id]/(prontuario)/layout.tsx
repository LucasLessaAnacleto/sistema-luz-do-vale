"use client";

import Link from "next/link";
import { use, useEffect, useState, type ReactNode } from "react";
import { Ban, Pencil, Plus, UserRoundCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { PacienteDetalhes } from "@/app/types/pacientes";
import { buscarPaciente, desativarPaciente, reativarPaciente } from "@/app/services/pacienteService";
import { calcularIdade, formatarData, mensagemErro } from "@/app/util";

import AvatarIniciais from "@/app/components/ui/AvatarIniciais";
import BotaoVoltarHistorico from "@/app/components/ui/BotaoVoltarHistorico";
import ModalConfirmacao from "@/app/components/ModalConfirmacao";
import CarregandoConteudo from "@/app/components/CarregandoConteudo";
import ErroCarregamento from "@/app/components/ErroCarregamento";

interface Props {
    children: ReactNode;
    params: Promise<{ id: string }>;
}

export default function PacienteLayout({ children, params }: Props) {

    const { id } = use(params);
    const pathname = usePathname();
    const [paciente, setPaciente] = useState<PacienteDetalhes | null>(null);

    const [erro, setErro] = useState("");
    const [naoEncontrado, setNaoEncontrado] = useState(false);

    const [modalStatusAberto, setModalStatusAberto] = useState(false);
    const [motivo, setMotivo] = useState("");
    const [alterandoStatus, setAlterandoStatus] = useState(false);
    const [erroStatus, setErroStatus] = useState("");


    useEffect(() => {
        carregarPaciente();
    }, [id]);


    async function carregarPaciente() {
        try {
            setErro("");
            setNaoEncontrado(false);

            const dados = await buscarPaciente(Number(id));
            setPaciente(dados);

        } catch (error) {

            const erroRequisicao = error as Error & { status?: number };

            if (erroRequisicao.status === 404) {

                setNaoEncontrado(true);

            } else {

                setErro(mensagemErro(error, "Erro ao carregar o paciente."));

            }

        }
    }


    async function confirmarAlteracaoStatus() {

        if (!paciente || alterandoStatus) return;

        try {
            setAlterandoStatus(true);
            setErroStatus("");

            const dados = { motivo: motivo.trim() || null };

            if (paciente.ativo) {
                await desativarPaciente(paciente.id, dados);
            } else {
                await reativarPaciente(paciente.id, dados);
            }

            await carregarPaciente();

            setModalStatusAberto(false);
            setMotivo("");

        } catch (error) {
            setErroStatus(mensagemErro(error, "Erro ao alterar status do paciente."));
        } finally {
            setAlterandoStatus(false);
        }
    }


    if (naoEncontrado) {

        return (
            <div className="mx-auto max-w-6xl px-5 py-12 text-center sm:px-8">
                <h1 className="text-xl font-semibold">Paciente não encontrado</h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    Não foi encontrado um paciente com este identificador.
                </p>

                <Link href="/pacientes"
                    className="mt-5 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white"
                >
                    Voltar para pacientes
                </Link>
            </div>
        );
    }


    if (erro) {

        return (
            <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
                <ErroCarregamento mensagem={erro} />
            </div>
        );
    }


    if (!paciente) {

        return (
            <CarregandoConteudo mensagem="Carregando paciente..." />
        );
    }

    const historicoAtivo = pathname.endsWith("/historico");
    const idade = calcularIdade(paciente.dtNasc);

    return (
        <>

            <section className="bg-linear-to-br from-primary to-[#8a976f] text-white">
                <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
                    <div className="mb-6 flex items-center justify-between gap-3">

                        <BotaoVoltarHistorico />

                        <div className="flex items-center gap-2">

                            <button type="button" title={paciente.ativo ? "Desativar paciente" : "Reativar paciente"}
                                className="flex min-h-10 items-center gap-1.5 rounded-full bg-white/10 px-3 text-sm hover:bg-white/20 cursor-pointer"
                                onClick={() => {
                                    setErroStatus("");
                                    setModalStatusAberto(true);
                                }}
                            >
                                {paciente.ativo ? <Ban className="h-4 w-4" /> : <UserRoundCheck className="h-4 w-4" />}

                                {paciente.ativo ? "Desativar" : "Reativar"}
                            </button>

                            <Link href={`/pacientes/${id}/editar`}
                                className="flex min-h-10 items-center gap-1.5 rounded-full bg-white/10 px-3 text-sm hover:bg-white/20"
                            >
                                <Pencil className="h-4 w-4" />
                                Editar
                            </Link>

                            <Link href={`/documentos/novo?paciente=${id}`}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary transition-colors hover:bg-accent"
                            >
                                <Plus className="h-5 w-5" />
                            </Link>

                        </div>

                    </div>


                    <div className="flex items-center gap-4">

                        <AvatarIniciais nome={paciente.nome} tamanho="lg" />

                        <div className="min-w-0">

                            <h1 className="break-words text-xl font-semibold">{paciente.nome}</h1>

                            {paciente.apelido && (
                                <p className="mt-0.5 text-sm text-white/90">
                                    {paciente.apelido}
                                </p>
                            )}

                            {idade !== null && (
                                <p className="mt-1.5 text-sm font-medium">
                                    {idade} anos
                                </p>
                            )}

                            <p className="text-sm text-white/80">
                                Cadastrado em {formatarData(paciente.dtCriacao)}
                            </p>

                        </div>

                    </div>

                </div>

            </section>

            <div className="border-b border-border bg-card">

                <div className="mx-auto flex max-w-6xl">

                    <Link href={`/pacientes/${id}`} replace
                        className={twMerge(clsx("flex-1 border-b-2 px-4 py-4 text-center text-sm font-medium transition-colors",
                            !historicoAtivo ? "border-primary text-primary-dark" : "border-transparent text-muted-foreground hover:bg-primary/5"
                        ))}
                    >
                        Prontuário
                    </Link>

                    <Link
                        href={`/pacientes/${id}/historico`}
                        replace
                        className={twMerge(clsx("flex-1 border-b-2 px-4 py-4 text-center text-sm font-medium transition-colors",
                            historicoAtivo ? "border-primary text-primary-dark" : "border-transparent text-muted-foreground hover:bg-primary/5"
                        ))}
                    >
                        Histórico
                    </Link>

                </div>

            </div>

            <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
                {children}
            </div>

            
            <ModalConfirmacao
                aberto={modalStatusAberto}
                titulo={paciente.ativo ? "Desativar paciente" : "Reativar paciente"}
                descricao={`Deseja ${paciente.ativo ? "desativar" : "reativar"} o paciente ${paciente.nome}?`}
                variante={paciente.ativo ? "perigo" : "confirmacao"}
                textoConfirmar={paciente.ativo ? "Desativar" : "Reativar"}
                disabledConfirmar={!motivo}
                carregando={alterandoStatus}
                erro={erroStatus}
                onConfirmar={confirmarAlteracaoStatus}
                onFechar={() => {
                    setModalStatusAberto(false);
                    setMotivo("");
                }}
            >
                <div>
                    <label htmlFor="motivo-status" className="mb-2 block text-sm font-medium">
                        Motivo
                    </label>

                    <textarea id="motivo-status" rows={3} maxLength={500} placeholder="Informe o motivo da alteração..."
                        className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                        value={motivo}
                        disabled={alterandoStatus}
                        onChange={(e) => setMotivo(e.target.value)}
                    />
                </div>
            </ModalConfirmacao>
        </>
    );
}