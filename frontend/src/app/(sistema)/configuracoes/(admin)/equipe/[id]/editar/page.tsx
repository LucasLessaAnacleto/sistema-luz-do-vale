"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { buscarUsuario, editarUsuario } from "@/app/services/usuarioService";

import { converterUsuarioFormulario } from "../../converterUsuarioFormulario";
import { montarUsuarioRequest } from "../../montarUsuarioRequest";

import UsuarioForm from "../../components/UsuarioForm";
import BotaoVoltarHistorico from "@/app/components/ui/BotaoVoltarHistorico";
import CabecalhoPagina from "@/app/components/CabecalhoPagina";
import CarregandoConteudo from "@/app/components/CarregandoConteudo";
import ErroCarregamento from "@/app/components/ErroCarregamento";

export default function EditarMembroPage() {
    const { id } = useParams<{ id: string }>();
    const usuarioId = Number(id);
    const router = useRouter();

    const [valores, setValores] = useState<Record<string, string> | null>(null);
    const [semProfissional, setSemProfissional] = useState(false);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        carregarUsuario();
    }, [id]);

    async function carregarUsuario() {
        try {
            setCarregando(true);
            setErro("");

            const usuario = await buscarUsuario(usuarioId);

            setValores(converterUsuarioFormulario(usuario));
            setSemProfissional(usuario.profissionalId == null);

        } catch (error) {
            setErro(error instanceof Error ? error.message : "Erro ao carregar membro.");
        } finally {
            setCarregando(false);
        }
    }

    async function salvar(form: FormData) {
        try {
            setSalvando(true);
            setErro("");

            const dados = montarUsuarioRequest(form);

            await editarUsuario(usuarioId, dados);

            router.back();

        } catch (error) {

            const digitados: Record<string, string> = {};
            for (const campo of form.entries()) {
                digitados[campo[0]] = String(campo[1] ?? "").trim();
            }
            setValores(digitados);

            setErro(error instanceof Error ? error.message : "Erro ao editar membro.");
        } finally {
            setSalvando(false);
        }
    }

    return (
        <>
            <CabecalhoPagina>
                <div className="flex items-center gap-3">
                    <BotaoVoltarHistorico />

                    <div>
                        <h1 className="text-2xl font-semibold">
                            Editar membro
                        </h1>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Atualize os dados do profissional e da conta de acesso
                        </p>
                    </div>
                </div>
            </CabecalhoPagina>

            {carregando ? (
                <CarregandoConteudo mensagem="Carregando dados do membro..." />

            ) : !valores ? (
                <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
                    <ErroCarregamento mensagem={erro || "Não foi possível carregar o membro."} onRetry={carregarUsuario} />
                </div>

            ) : (
                <UsuarioForm
                    action={salvar}
                    valores={valores}
                    erro={erro}
                    loading={salvando}
                    modo="edicao"
                    semProfissional={semProfissional}
                />
            )}
        </>
    );
}
