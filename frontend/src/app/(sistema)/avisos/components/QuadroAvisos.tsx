"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CircleAlert } from "lucide-react";

import { Aviso } from "@/app/types/avisos";
import { listarAvisos } from "@/app/services/avisoService";
import BotaoNovo from "@/app/components/ui/BotaoNovo";
import CardAviso from "./CardAviso";
import CarregandoConteudo from "@/app/components/CarregandoConteudo";
import ErroCarregamento from "@/app/components/ErroCarregamento";
import ItemsVazio from "@/app/components/ItemsVazio";
import { mensagemErro } from "@/app/util";

export default function QuadroAvisos() {
    const [avisos, setAvisos] = useState<Aviso[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        carregarAvisos();
    }, []);

    async function carregarAvisos() {
        try {
            setCarregando(true);
            setErro("");

            const response = await listarAvisos(0, true);

            setAvisos(response.content);
        } catch (error) {
            setErro(mensagemErro(error, "Erro ao carregar avisos."));
        } finally {
            setCarregando(false);
        }
    }

    return (
        <section>

            <div className="mb-3 flex items-center justify-between gap-3 flex-wrap">
                <h2 id="avisos-titulo" className="flex items-center gap-2 text-base font-semibold sm:text-lg">
                    <CircleAlert className="h-5 w-5 text-warning" />
                    Quadro de avisos
                </h2>

                <div className="flex items-center gap-3">
                    <Link href="/avisos" className="text-xs font-medium text-primary-dark hover:underline sm:text-sm">
                        Ver todos
                    </Link>

                    <BotaoNovo href="/avisos/novo" texto="Novo aviso"/>
                </div>
            </div>

            {carregando ? (

                <CarregandoConteudo mensagem="Carregando quadro de avisos..."/>

            ) : erro ? (

                <ErroCarregamento mensagem={erro} onRetry={carregarAvisos}/>

            ) : avisos.length === 0 ? (

                <ItemsVazio titulo="Nenhum aviso ativo no momento." />

            ) : (
                <div className="space-y-3">

                    {avisos.slice(0, 9).map(aviso => (
                        <CardAviso key={aviso.id} aviso={aviso} />
                    ))}

                    {avisos.length > 9 && (
                        <Link href="/avisos"
                            className="block rounded-xl border border-border p-3 text-center text-sm font-medium text-primary-dark hover:bg-primary/5"
                        >
                            Ver mais avisos
                        </Link>
                    )}

                </div>
            )}

        </section>
    );
}