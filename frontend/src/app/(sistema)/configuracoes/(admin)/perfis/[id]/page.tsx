"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import type { PerfilRequest } from "@/app/types/perfis";
import type { TipoDocumento } from "@/app/types/documentos";
import { buscarPerfil, editarPerfil } from "@/app/services/perfilService";
import { listarTiposDocumento } from "@/app/services/tipoDocumentoService";

import { montarPerfilRequest } from "../montarPerfilRequest";

import PerfilForm from "../components/PerfilForm";
import CabecalhoPagina from "@/app/components/CabecalhoPagina";
import BotaoVoltar from "@/app/components/ui/BotaoVoltar";
import CarregandoConteudo from "@/app/components/CarregandoConteudo";
import ErroCarregamento from "@/app/components/ErroCarregamento";

export default function EditarPerfilPage() {
    const { id } = useParams<{ id: string }>();
    const perfilId = Number(id);
    const router = useRouter();

    const [valores, setValores] = useState<PerfilRequest | null>(null);
    const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        carregarPerfil();
    }, [id]);

    async function carregarPerfil() {
        try {
            setCarregando(true);
            setErro("");

            const perfil = await buscarPerfil(perfilId);
            const tipos = await listarTiposDocumento();

            setValores({
                nome: perfil.nome,
                permCadPaciente: perfil.permCadPaciente,
                tiposDocumento: perfil.tiposDocumento
            });
            setTiposDocumento(tipos);

        } catch (error) {
            setErro(error instanceof Error ? error.message : "Erro ao carregar perfil.");
        } finally {
            setCarregando(false);
        }
    }

    async function salvar(form: FormData) {

        const dados = montarPerfilRequest(form);

        try {
            setSalvando(true);
            setErro("");

            await editarPerfil(perfilId, dados);

            router.push("/configuracoes/perfis");

        } catch (error) {

            // mantem o que foi marcado, senao o form volta pros valores antigos
            setValores(dados);

            setErro(error instanceof Error ? error.message : "Erro ao salvar perfil.");
        } finally {
            setSalvando(false);
        }
    }

    return (
        <>
            <CabecalhoPagina largura="5xl">
                <div className="flex items-center gap-3">
                    <BotaoVoltar href="/configuracoes/perfis" />

                    <div>
                        <h1 className="text-2xl font-semibold">
                            Editar perfil
                        </h1>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Atualize o nome e as permissões do perfil
                        </p>
                    </div>
                </div>
            </CabecalhoPagina>

            {carregando ? (
                <CarregandoConteudo mensagem="Carregando perfil..." />

            ) : !valores ? (
                <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8">
                    <ErroCarregamento mensagem={erro || "Não foi possível carregar o perfil."} onRetry={carregarPerfil} />
                </div>

            ) : (
                <PerfilForm
                    action={salvar}
                    valores={valores}
                    tiposDocumento={tiposDocumento}
                    erro={erro}
                    loading={salvando}
                    textoSalvar="Salvar alterações"
                />
            )}
        </>
    );
}
