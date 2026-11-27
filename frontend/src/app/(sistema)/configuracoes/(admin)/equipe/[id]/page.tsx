"use client"

import CabecalhoPagina from "@/app/components/CabecalhoPagina";
import CarregandoConteudo from "@/app/components/CarregandoConteudo";
import ErroCarregamento from "@/app/components/ErroCarregamento";
import BotaoVoltarHistorico from "@/app/components/ui/BotaoVoltarHistorico";
import Card from "@/app/components/ui/Card";
import ListaDetalhes from "@/app/components/ListaDetalhes";
import ModalConfirmacao from "@/app/components/ModalConfirmacao";
import Input from "@/app/components/ui/Input";
import { UserRound, ShieldCheck, CalendarDays, Pencil, KeyRound, UserRoundX, UserRoundCheck } from "lucide-react";
import { formatarData, mensagemErro } from "@/app/util";
import { buscarUsuario, alterarStatusUsuario, redefinirSenhaUsuario } from "@/app/services/usuarioService";
import { Usuario } from "@/app/types/usuarios";
import { useAppSelector } from "@/app/redux/hook";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MembroEquipePage(){
    const { id } = useParams<{id: string}>();
    const usuarioLogado = useAppSelector((state) => state.auth.usuario);

    const [membro, setMembro] = useState<Usuario | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const [modalStatusAberto, setModalStatusAberto] = useState(false);
    const [alterandoStatus, setAlterandoStatus] = useState(false);
    const [erroStatus, setErroStatus] = useState("");

    const [modalSenhaAberto, setModalSenhaAberto] = useState(false);
    const [novaSenha, setNovaSenha] = useState("");
    const [salvandoSenha, setSalvandoSenha] = useState(false);
    const [erroSenha, setErroSenha] = useState("");
    const [senhaRedefinida, setSenhaRedefinida] = useState(false);

    useEffect(() => {
        carregarMembro();
    }, [id]);

    
    async function carregarMembro() {
        try {
            setCarregando(true);
            setErro("");

            const dados = await buscarUsuario(Number(id));
            if (!dados) {
                setErro(`Membro #${id} não encontrado.`);
                return;
            }

            setMembro(dados);
        } catch (err) {
            setErro(mensagemErro(err, "Erro ao carregar informações do membro."));
        } finally {
            setCarregando(false);
        }
    }

    async function confirmarAlteracaoStatus() {
        if (!membro || alterandoStatus) return;

        try {
            setAlterandoStatus(true);
            setErroStatus("");

            const atualizado = await alterarStatusUsuario(membro.id, !membro.ativo);

            setMembro(atualizado);
            setModalStatusAberto(false);
        } catch (err) {
            setErroStatus(mensagemErro(err, "Erro ao alterar status do membro."));
        } finally {
            setAlterandoStatus(false);
        }
    }

    async function confirmarNovaSenha() {
        if (!membro || salvandoSenha) return;

        try {
            setSalvandoSenha(true);
            setErroSenha("");

            await redefinirSenhaUsuario(membro.id, novaSenha);

            setModalSenhaAberto(false);
            setNovaSenha("");
            setSenhaRedefinida(true);
        } catch (err) {
            setErroSenha(mensagemErro(err, "Erro ao redefinir a senha."));
        } finally {
            setSalvandoSenha(false);
        }
    }


    const dadosPessoais = membro ? [
        { label: "Nome completo", value: membro.nome || "-" },
        { label: "CPF", value: membro.cpf || "-" },
        { label: "Nascimento", value: membro.dtNasc || "-" },
        { label: "Telefone", value: membro.telefone || "-" },
        { label: "Registro profissional", value: membro.regProfissional || "-" },
        { label: "Rua", value: membro.endereco?.rua || "-" },
        { label: "Número", value: membro.endereco?.numero || "-" },
        { label: "Bairro", value: membro.endereco?.bairro || "-" },
        { label: "Município", value: membro.endereco?.municipio || "-" },
        { label: "Estado", value: membro.endereco?.estado || "-" }
    ] : [];

    const dadosConta = membro ? [
        { label: "E-mail", value: membro.email },
        { label: "Função", value: membro.role === "ROLE_ADMIN" ? "Administrador" : "Funcionário" },
        { label: "Perfil", value: membro.perfil || "Sem perfil" },
        { label: "Situação", value: membro.ativo ? "Ativo" : "Inativo" }
    ] : [];

    const dadosCadastro = membro ? [
        {
            label: "Cadastrado em",
            value: formatarData(membro.dtCriacao)
        },
        {
            label: "Desativado em",
            value: membro.dtDesativado ? formatarData(membro.dtDesativado) : "-"
        }
    ] : [];


    const resolveNome = (user: Usuario) => user?.nome || (user?.role == "ROLE_ADMIN" ? "Administrador" : "Minha conta");
    return (
        <>
            <CabecalhoPagina>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <BotaoVoltarHistorico />
                        
                        <div>
                            <h1 className="text-xl font-semibold">
                                Membro
                            </h1>

                            <p className="mt-0.5 text-xs text-muted-foreground">
                                {membro ? membro.nome || (membro.role === "ROLE_ADMIN" ? "Administrador" : "Sem nome") : "Informações do membro"}
                            </p>
                        </div>
                    </div>
                </div>
            </CabecalhoPagina>

            {carregando && !erro ? (
            
                <CarregandoConteudo mensagem="Carregando membro..." />

            ) : erro ? (

                <ErroCarregamento mensagem={erro} />

            ) : (
                membro ? (
                    <div className="mx-auto max-w-6xl space-y-5 px-5 py-6 sm:px-8">

                        <div className="flex flex-wrap gap-2">
                            <Link href={`/configuracoes/equipe/${membro.id}/editar`}
                                className="flex min-h-10 items-center gap-2 rounded-full bg-primary/15 px-4 text-sm font-medium text-primary-dark transition-colors hover:bg-primary/25"
                            >
                                <Pencil className="h-4 w-4" />
                                Editar
                            </Link>

                            <button type="button"
                                className="flex min-h-10 cursor-pointer items-center gap-2 rounded-full bg-primary/15 px-4 text-sm font-medium text-primary-dark transition-colors hover:bg-primary/25"
                                onClick={() => {
                                    setErroSenha("");
                                    setSenhaRedefinida(false);
                                    setModalSenhaAberto(true);
                                }}
                            >
                                <KeyRound className="h-4 w-4" />
                                Redefinir senha
                            </button>

                            {usuarioLogado?.id !== membro.id && (
                                <button type="button"
                                    className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors
                                        ${membro.ativo ? "border border-red-300 text-red-700 hover:bg-red-50" : "bg-primary/15 text-primary-dark hover:bg-primary/25"}`}
                                    onClick={() => {
                                        setErroStatus("");
                                        setModalStatusAberto(true);
                                    }}
                                >
                                    {membro.ativo ? <UserRoundX className="h-4 w-4" /> : <UserRoundCheck className="h-4 w-4" />}

                                    {membro.ativo ? "Desativar" : "Reativar"}
                                </button>
                            )}
                        </div>

                        {senhaRedefinida && (
                            <p className="text-sm text-primary-dark">
                                Senha redefinida com sucesso.
                            </p>
                        )}

                        <Card>
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                <UserRound className="h-5 w-5 text-primary" />
                                Dados pessoais
                            </h2>

                            <ListaDetalhes campos={dadosPessoais} />
                        </Card>

                        <Card>
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                                Conta e acesso
                            </h2>

                            <ListaDetalhes campos={dadosConta} />
                        </Card>

                        <Card>
                            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                                <CalendarDays className="h-5 w-5 text-primary" />
                                Informações do cadastro
                            </h2>

                            <ListaDetalhes campos={dadosCadastro} />
                        </Card>

                    </div>
                ) : (
                    <ErroCarregamento mensagem="Membro não encontrado." />
                )

                // tratar erroCad

            )}

            <ModalConfirmacao
                aberto={modalStatusAberto}
                titulo={membro?.ativo ? "Desativar membro" : "Reativar membro"}
                descricao={membro?.ativo
                    ? "O membro não vai mais conseguir entrar no sistema. Os registros feitos por ele continuam disponíveis."
                    : "O membro vai voltar a conseguir entrar no sistema."
                }
                variante={membro?.ativo ? "perigo" : "confirmacao"}
                textoConfirmar={membro?.ativo ? "Desativar" : "Reativar"}
                carregando={alterandoStatus}
                erro={erroStatus}
                onConfirmar={confirmarAlteracaoStatus}
                onFechar={() => setModalStatusAberto(false)}
            />

            <ModalConfirmacao
                aberto={modalSenhaAberto}
                titulo="Redefinir senha"
                descricao="Informe a nova senha de acesso do membro."
                textoConfirmar="Redefinir"
                disabledConfirmar={!novaSenha}
                carregando={salvandoSenha}
                erro={erroSenha}
                onConfirmar={confirmarNovaSenha}
                onFechar={() => {
                    setModalSenhaAberto(false);
                    setNovaSenha("");
                }}
            >
                <Input label="Nova senha" type="password" value={novaSenha} disabled={salvandoSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                />

                <p className="mt-2 text-xs text-muted-foreground">
                    Mínimo de 8 caracteres, com letra maiúscula,
                    minúscula, número e caractere especial.
                </p>
            </ModalConfirmacao>

        </>
    )
}