"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Search, Users } from "lucide-react";

import type { Usuario } from "@/app/types/usuarios";
import { buscarListaUsuarios } from "@/app/services/usuarioService";
import { normalizeSearch } from "@/app/util";

import UsuarioEquipeCard from "./components/UsuarioEquipeCard";
import BotaoNovo from "@/app/components/ui/BotaoNovo";
import BarraPesquisa from "@/app/components/ui/BarraPesquisa";
import BudgetFiltros from "@/app/components/ui/BudgetFiltros";
import ItemsVazio from "@/app/components/ItemsVazio";
import BotaoVoltar from "@/app/components/ui/BotaoVoltar";
import ErroCarregamento from "@/app/components/ErroCarregamento";
import CarregandoConteudo from "@/app/components/CarregandoConteudo";

export default function EquipePage() {

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [search, setSearch] = useState("");
    const [filtro, setFiltro] = useState("todos");

    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        try {
            setErro("");
            setCarregando(true);
            const dados = await buscarListaUsuarios();

            setUsuarios(dados);

        } catch (error) {
            setErro("Erro ao carregar a equipe!");
            console.error(error);
        } finally {
            setCarregando(false);
        }   
    }

    const usuariosFiltrados = usuarios.filter((usuario) => {
    if (normalizeSearch(usuario.nome).includes(normalizeSearch(search)) ||
        normalizeSearch(usuario.email).includes(normalizeSearch(search)) ||
        normalizeSearch(usuario.perfil || "").includes(normalizeSearch(search))
    ){

        if(filtro === "todos" || (filtro === "ativos" && usuario.ativo) || (filtro === "inativos" && !usuario.ativo)){
            return true;
        }
    }

    return false;
    });

    const ativos = usuarios.filter((usuario) => usuario.ativo).length;

    return (
    <>

        <section className="border-b border-border bg-card">

        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">

            <div className="flex items-center justify-between gap-4">

            <div className="flex min-w-0 items-center gap-3">

                <BotaoVoltar href="/configuracoes" />

                <div className="min-w-0">

                <h1 className="text-2xl font-semibold">Equipe</h1>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                        {ativos} {ativos === 1 ? "ativo" : "ativos"}
                    </p>

                </div>

            </div>

            <BotaoNovo href="/configuracoes/equipe/novo" />

            </div>


            <div className="mt-5">

            <BarraPesquisa value={search} onChange={setSearch} placeholder="Buscar por nome, perfil ou e-mail..."/>

            <div className="mt-3">
                
                <BudgetFiltros valor={filtro} onChange={setFiltro}
                    opcoes={[
                        { valor: "todos", label: "Todos" },
                        { valor: "ativos", label: "Ativos" },
                        { valor: "inativos", label: "Inativos" },
                    ]}
                />

            </div>
        
            </div>

        </div>

        </section>


        <section  className=" mx-auto max-w-6xl space-y-3 px-5 py-4 sm:px-8">

            {carregando ? (
                <CarregandoConteudo mensagem="Carregando equipe..." />
            ) : erro ? (
                <ErroCarregamento mensagem={erro} />
            ) : usuariosFiltrados.length ? (

                usuariosFiltrados.map((usuario) => (
                    <UsuarioEquipeCard key={usuario.id} usuario={usuario} />
                ))

            ) : (
                <ItemsVazio
                    titulo="Nenhum profissional encontrado"
                    descricao="Tente buscar por outro nome, perfil ou e-mail."
                />
            )}

        </section>

    </>
    );
}