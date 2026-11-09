"use client";

import Link from "next/link";
import { use, useEffect, useState, type ReactNode } from "react";
import { Pencil, Plus } from "lucide-react";
import { usePathname } from "next/navigation";

import type { PacienteDetalhes } from "@/app/types/pacientes";
import { buscarPaciente } from "@/app/services/pacienteService";
import { formatarData } from "@/app/util";

import AvatarIniciais from "@/app/components/ui/AvatarIniciais";
import BotaoVoltar from "@/app/components/ui/BotaoVoltar";
import BotaoNovo from "@/app/components/ui/BotaoNovo";

interface Props {
    children: ReactNode;
    params: Promise<{ id: string }>;
}

function calcularIdade(dataNascimento: string | null) {

    if (!dataNascimento) {
        return null;
    }

    const nascimento = new Date(dataNascimento + "T00:00:00");
    const hoje = new Date();

    let idade = hoje.getFullYear() - nascimento.getFullYear();

    const diferencaMes = hoje.getMonth() - nascimento.getMonth();

    if (diferencaMes < 0 || (diferencaMes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade = idade-1;
    }

    return idade;
}

export default function PacienteLayout({ children, params }: Props) {

    const { id } = use(params);
    const pathname = usePathname();
    const [paciente, setPaciente] = useState<PacienteDetalhes | null>(null);


    useEffect(() => {
        carregarPaciente();
    }, [id]);


    async function carregarPaciente() {
        try {
            const dados = await buscarPaciente(Number(id));
            setPaciente(dados);

        } catch (error) {

            if (error instanceof Error) {
                alert(error.message);
            }

        }
    }

    const historicoAtivo = pathname.endsWith("/historico");
    const idade = paciente ? calcularIdade(paciente.dtNasc) : null;

    return (
        <>

            <section className="bg-linear-to-br from-primary to-[#8a976f] text-white">
                <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
                    <div className="mb-6 flex items-center justify-between gap-3">

                        <BotaoVoltar href="/pacientes" />

                        <div className="flex items-center gap-2">
                            <button type="button" disabled className="flex min-h-10 cursor-not-allowed items-center gap-1.5 rounded-full bg-white/10 px-3 text-sm opacity-70">
                                <Pencil className="h-4 w-4" />
                                Editar
                            </button>

                            <Link href={`/documentos/novo?paciente=${id}`}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary transition-colors hover:bg-accent"
                            >
                                <Plus className="h-5 w-5" />
                            </Link>

                        </div>

                    </div>


                    {paciente ? (

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

                    ) : (

                        <p className="text-sm text-white/80">Carregando paciente...</p>

                    )}

                </div>

            </section>


            <div className="border-b border-border bg-card">

                <div className="mx-auto flex max-w-6xl">

                    <Link
                        href={`/pacientes/${id}`}
                        className={`flex-1 border-b-2 px-4 py-4 text-center text-sm font-medium transition-colors ${
                            !historicoAtivo
                                ? "border-primary text-primary-dark"
                                : "border-transparent text-muted-foreground hover:bg-primary/5"
                        }`}
                    >
                        Prontuário
                    </Link>

                    <Link
                        href={`/pacientes/${id}/historico`}
                        className={`flex-1 border-b-2 px-4 py-4 text-center text-sm font-medium transition-colors ${
                            historicoAtivo
                                ? "border-primary text-primary-dark"
                                : "border-transparent text-muted-foreground hover:bg-primary/5"
                        }`}
                    >
                        Histórico
                    </Link>

                </div>

            </div>


            <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
                {children}
            </div>

        </>
    );
}