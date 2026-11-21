"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";

import { contarDocumentosMes } from "@/app/services/dashService";

const monthFormat = new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    year: "numeric"
});

const buttonClass =
    "flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function IndicadorDocumentosMes() {

    const [mesSelecionado, setMesSelecionado] = useState(() => {
        const agora = new Date();
        return new Date(agora.getFullYear(), agora.getMonth(), 1);
    });

    const [quantidade, setQuantidade] = useState<number | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const ano = mesSelecionado.getFullYear();
    const mes = mesSelecionado.getMonth() + 1;
    const monthLabel = monthFormat.format(mesSelecionado);

    useEffect(() => {
        let cancelado = false;
        async function carregarQuantidade(){
            const inicio = Date.now();
            try {
                setCarregando(true);
                setErro("");
                
                const dados = await contarDocumentosMes(ano, mes);
                
                if(!cancelado){
                    setQuantidade(dados);
                }
            } catch (error) {
                if(!cancelado){
                    setErro( error instanceof Error ? error.message : "Erro ao carregar quantidade de documentos.");
                }
            } finally {
                const tempoDecorrido = Date.now() - inicio;
                let tempoRestante = 200 - tempoDecorrido;
                if(tempoRestante < 0) tempoRestante = 0;

                setTimeout(() => {
                    if(!cancelado){
                        setCarregando(false);
                    }
                }, tempoRestante);                
            }
        }
        carregarQuantidade();

        return () => {
            cancelado = true;
        };
    }, [ano, mes]);

    function trocarMes(diferenca: number){
        setCarregando(true);
        setErro("");

        setMesSelecionado(anterior => new Date( anterior.getFullYear(), anterior.getMonth() + diferenca, 1));
    }

    return (
        <>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-xl border border-border bg-primary/5 px-3 py-2 text-primary-dark lg:mt-4">
                <p className="flex items-center gap-2 text-xs">
                    <TrendingUp className="h-4 w-4" aria-hidden="true" />
                    Documentos no mês
                </p>

                <div className="flex items-center gap-1">
                    <button type="button" onClick={() => trocarMes(-1)} className={buttonClass}>
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    <span className="min-w-24 text-center text-xs font-medium capitalize">
                        {monthLabel}
                    </span>

                    <button type="button" onClick={() => trocarMes(1)} className={buttonClass}>
                        <ChevronRight className="h-4 w-4" />
                    </button>

                    <span className="ml-2 inline-flex h-6 min-w-6 items-center justify-end text-right text-xl font-bold tabular-nums">
                        {carregando ? (
                            // <span className="inline-block h-5 w-6 animate-pulse rounded bg-zinc-300" />
                            <span className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                        ) : (
                            erro ? "—" : quantidade ?? "—"
                        )}
                    </span>
                </div>
            </div>

            {erro && (
                <p role="alert" className="mt-2 text-xs text-red-600">
                    {erro}
                </p>
            )}

        </>
    );
}