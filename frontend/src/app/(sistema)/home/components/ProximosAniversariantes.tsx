"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cake } from "lucide-react";

import type { Paciente } from "@/app/types/pacientes";

import ErroCarregamento from "@/app/components/ErroCarregamento";
import CarregandoConteudo from "@/app/components/CarregandoConteudo";
import { buscarProximosAniversariantes } from "@/app/services/dashService";
import { AniversarioResponse } from "@/app/types/dash";

// function calcularProximosAniversarios(pacientes: Paciente[]): AniversarioResponse[] {
//     const hoje = new Date();
//     hoje.setHours(0, 0, 0, 0);

//     return pacientes.filter(paciente => paciente.ativo && paciente.dtNasc).map(paciente => {
//             const [ano, mes, dia] = paciente.dtNasc!.split("-").map(Number);

//             const aniversario = new Date(hoje.getFullYear(), mes - 1, dia);
//             if (aniversario < hoje) aniversario.setFullYear(hoje.getFullYear() + 1);

//             const diasRestantes = (aniversario.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24);

//             return {
//                 id: paciente.id,
//                 nome: paciente.nome,
//                 data: `${String(dia).padStart(2, "0")}/${String(mes).padStart(2, "0")}`,
//                 idade: aniversario.getFullYear() - ano,
//                 diasRestantes: Math.round(diasRestantes)
//             };
//         })
//         .sort((a, b) => a.diasRestantes - b.diasRestantes)
//         .slice(0, 5);
// }

function formatDiaMes(dtNasc: string): string{
    const [_, mes, dia] = dtNasc.split("-");
    return dia + "/" + mes;
}

export default function ProximosAniversariantes() {

    const [aniversariantes, setAniversariantes] = useState<AniversarioResponse[]>([]);

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    async function carregarAniversariantes() {
        try {
            setCarregando(true);
            setErro("");

            const resposta = await buscarProximosAniversariantes();
            setAniversariantes(resposta);
        } catch (error) {
            setErro(error instanceof Error ? error.message: "Erro ao carregar aniversariantes.");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarAniversariantes();
    }, []);

    return (
        <section>

            <h2 className="mb-3 flex min-h-9 items-center gap-2 text-base font-semibold sm:text-lg">
                <Cake className="h-5 w-5 shrink-0 text-primary" />
                Próximos aniversariantes
            </h2>

            {carregando ? (
                <CarregandoConteudo mensagem="Carregando aniversariantes..." />

            ) : erro ? (
                <ErroCarregamento mensagem={erro} onRetry={carregarAniversariantes}/>

            ) : aniversariantes.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum aniversariante encontrado.</p>

            ) : (
                <div className="space-y-3">
                    {aniversariantes.map(aniversariante => (
                        <Link key={aniversariante.pacienteId} href={`/pacientes/${aniversariante.pacienteId}`}
                            className="flex items-center gap-3 rounded-2xl border border-secondary/40 bg-secondary/10 p-4 shadow-sm transition-colors hover:border-primary/40"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/40 text-primary-dark">
                                <Cake className="h-5 w-5" />
                            </div>

                            <div className="min-w-0 flex-1">

                                <h3 className="text-sm font-medium">
                                    {aniversariante.nome}
                                </h3>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {formatDiaMes(aniversariante.dtNasc)}{" · "}{aniversariante.idade} anos
                                </p>

                            </div>

                            <span className="rounded-full bg-card/80 px-2.5 py-1 text-xs font-medium text-primary-dark">
                                {
                                    aniversariante.diasRestantes === 0 ? "Hoje!" 
                                    : aniversariante.diasRestantes === 1 ? "Amanhã" 
                                    : `Em ${aniversariante.diasRestantes} dias`
                                }
                            </span>

                        </Link>

                    ))}

                </div>
            )}

        </section>
    );
}