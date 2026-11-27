"use client";

import { useEffect, useState } from "react";

import type { Perfil } from "@/app/types/perfis";
import { listarPerfis } from "@/app/services/perfilService";

import PerfilCard from "./components/PerfilCard";
import CabecalhoPagina from "@/app/components/CabecalhoPagina";
import BotaoNovo from "@/app/components/ui/BotaoNovo";
import BotaoVoltar from "@/app/components/ui/BotaoVoltar";
import ItemsVazio from "@/app/components/ItemsVazio";
import ErroCarregamento from "@/app/components/ErroCarregamento";
import CarregandoConteudo from "@/app/components/CarregandoConteudo";

export default function PerfisPage() {

    const [perfis, setPerfis] = useState<Perfil[]>([]);

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        carregarPerfis();
    }, []);

    async function carregarPerfis() {
        try {
            setCarregando(true);
            setErro("");

            const dados = await listarPerfis();
            setPerfis(dados);
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Erro ao carregar os perfis!");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <>
            <CabecalhoPagina>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">

                        <BotaoVoltar href="/configuracoes" />

                        <div className="min-w-0">
                            <h1 className="text-2xl font-semibold">Perfis</h1>

                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Permissões dos profissionais
                            </p>
                        </div>
                    </div>

                    <BotaoNovo href="/configuracoes/perfis/novo" />
                </div>
            </CabecalhoPagina>

            <section className="mx-auto max-w-6xl space-y-3 px-5 py-4 sm:px-8">

                {carregando ? (
                    <CarregandoConteudo mensagem="Carregando perfis..." />

                ) : erro ? (
                    <ErroCarregamento mensagem={erro} onRetry={carregarPerfis} />

                ) : perfis.length ? (

                    perfis.map((perfil) => (
                        <PerfilCard key={perfil.id} perfil={perfil} />
                    ))

                ) : (
                    <ItemsVazio
                        titulo="Nenhum perfil cadastrado"
                        descricao="Cadastre um perfil para liberar a criação de documentos aos profissionais."
                    />
                )}

            </section>
        </>
    );
}
