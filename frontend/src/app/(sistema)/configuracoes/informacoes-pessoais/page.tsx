"use client";

import { useEffect, useState, type FormEvent } from "react";

import BotaoVoltar from "@/app/components/ui/BotaoVoltar";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import ModalConfirmacao from "@/app/components/ModalConfirmacao";

import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { setUsuario } from "@/app/redux/slices/authSlice";

import { actionEditarInformacoesPessoais, DadosInformacoesPessoais } from "./actionEditarInformacoesPessoais";
import CabecalhoPagina from "@/app/components/CabecalhoPagina";

const dadosIniciais: DadosInformacoesPessoais = {
    nome: "",
    email: "",
    telefone: "",
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: ""
};

export default function InformacoesPessoaisPage() {
    const dispatch = useAppDispatch();
    const usuario = useAppSelector((state) => state.auth.usuario);

    const [dados, setDados] = useState(dadosIniciais);
    const [modalAberto, setModalAberto] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState(false);

    useEffect(() => {
        if (!usuario) return;

        setDados({
            ...dadosIniciais,
            nome: usuario.nome,
            email: usuario.email,
            telefone: usuario.telefone ?? ""
        });
    }, [usuario]);

    const houveAlteracoes = Boolean(usuario && (
        dados.email.trim() !== usuario.email || (
            usuario.profissionalId != null && (
                dados.nome.trim() !== usuario.nome || 
                    dados.telefone.replace(/\D/g, "") !== (usuario.telefone ?? "").replace(/\D/g, "")
            )
        ) || Boolean(dados.senhaAtual && dados.novaSenha && dados.confirmarSenha)
    ));

    function confirmarAlteracoes(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();

        if (!usuario || salvando || !houveAlteracoes) return;

        setErro("");
        setSucesso(false);
        setModalAberto(true);
    }

    function alterarCampo(campo: keyof DadosInformacoesPessoais, valor: string) {
        setDados((anterior) => ({
            ...anterior,
            [campo]: valor
        }));

        setErro("");
        setSucesso(false);
    }


    async function salvar() {
        if (!usuario || salvando) return;

        setSalvando(true);
        setErro("");

        try {
            const atualizado = await actionEditarInformacoesPessoais(usuario, dados);

            dispatch(setUsuario({ usuario: atualizado }));

            setDados({
                ...dadosIniciais,
                nome: atualizado.nome,
                email: atualizado.email,
                telefone: atualizado.telefone ?? ""
            });

            setModalAberto(false);
            setSucesso(true);

        } catch (error) {
            setErro( error instanceof Error ? error.message : "Erro ao atualizar informações pessoais.");
            setModalAberto(false);
        } finally {
            setSalvando(false);
        }
    }

    return (
        <>
            <CabecalhoPagina largura="3xl">
                <div className="flex items-center gap-3">
                    <BotaoVoltar href="/configuracoes" />

                    <div>
                        <h1 className="text-2xl font-semibold">
                            Informações Pessoais
                        </h1>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Gerencie seus dados pessoais e sua senha de acesso
                        </p>
                    </div>
                </div>
            </CabecalhoPagina>

            {usuario && (
                <div className="mx-auto max-w-3xl px-5 py-6 sm:px-8">
                    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">

                        <form onSubmit={confirmarAlteracoes} className="space-y-6">

                            <div className="space-y-4">
                                <h2 className="font-semibold">Dados pessoais</h2>

                                <Input label="Nome completo" value={dados.nome} 
                                    required={usuario.profissionalId != null} 
                                    maxLength={255} 
                                    disabled={salvando || usuario.profissionalId == null}
                                    onChange={(e) => alterarCampo("nome", e.target.value)}
                                />

                                <Input label="E-mail" type="email" value={dados.email} required maxLength={255} disabled={salvando}
                                    onChange={(e) => alterarCampo("email", e.target.value)}
                                />

                                <Input label="Telefone" type="tel" value={dados.telefone}
                                    disabled={salvando || usuario.profissionalId == null}
                                    onChange={(e) => alterarCampo("telefone", e.target.value)}
                                />
                            </div>

                            <div className="space-y-4 border-t border-border pt-6">
                                <div>
                                    <h2 className="font-semibold">Alterar senha</h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Preencha somente se desejar alterar sua senha.
                                    </p>
                                </div>

                                <Input label="Senha atual" type="password" value={dados.senhaAtual} disabled={salvando}
                                    onChange={(e) => alterarCampo("senhaAtual", e.target.value)}
                                />

                                <Input label="Nova senha" type="password" value={dados.novaSenha} disabled={salvando}
                                    onChange={(e) => alterarCampo("novaSenha", e.target.value)}
                                />

                                <Input label="Confirmar nova senha" type="password" value={dados.confirmarSenha} disabled={salvando}
                                    onChange={(e) => alterarCampo("confirmarSenha", e.target.value)}
                                />

                                <p className="text-xs text-muted-foreground">
                                    Mínimo de 8 caracteres, com letra maiúscula,
                                    minúscula, número e caractere especial.
                                </p>
                            </div>

                            {erro && (
                                <p role="alert" className="text-sm text-red-600">
                                    {erro}
                                </p>
                            )}

                            {sucesso && (
                                <p role="status" className="text-sm text-primary-dark">
                                    Informações pessoais atualizadas com sucesso.
                                </p>
                            )}

                            <div className="flex justify-end">
                                <Button type="submit" loading={salvando} disabled={!houveAlteracoes}>
                                    Salvar alterações
                                </Button>
                            </div>
                        </form>

                        <dl className="mt-5 border-t border-border pt-4">
                            <dt className="text-xs text-muted-foreground">Perfil</dt>
                            <dd className="mt-1 text-sm">{usuario.perfil || "Não informado"}</dd>
                        </dl>
                    </section>
                </div>
            )}

            <ModalConfirmacao
                aberto={modalAberto}
                titulo="Confirmar alterações"
                descricao="Deseja salvar as alterações realizadas nas suas informações pessoais?"
                textoConfirmar="Confirmar"
                carregando={salvando}
                onConfirmar={salvar}
                onFechar={() => setModalAberto(false)}
            />
        </>
    );
}
