"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cake } from "lucide-react";

import ErroCarregamento from "@/app/components/ErroCarregamento";
import CarregandoConteudo from "@/app/components/CarregandoConteudo";
import { buscarProximosAniversariantes } from "@/app/services/dashService";
import { AniversarioResponse } from "@/app/types/dash";

function formatDiaMes(dt: string): string{
    const [_, mes, dia] = dt.split("-");
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
                                    {formatDiaMes(aniversariante.proximoAniversario)}{" · "}{aniversariante.idade} anos
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