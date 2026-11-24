"use client"

import CabecalhoPagina from "@/app/components/CabecalhoPagina";
import CarregandoConteudo from "@/app/components/CarregandoConteudo";
import ErroCarregamento from "@/app/components/ErroCarregamento";
import BotaoVoltarHistorico from "@/app/components/ui/BotaoVoltarHistorico";
import Card from "@/app/components/ui/Card";
import ListaDetalhes from "@/app/components/ListaDetalhes";
import { UserRound, ShieldCheck, CalendarDays } from "lucide-react";
import { formatarData } from "@/app/util";
import { buscarUsuario } from "@/app/services/usuarioService";
import { Usuario } from "@/app/types/usuarios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MembroEquipePage(){
    const { id } = useParams<{id: string}>();
    const [membro, setMembro] = useState<Usuario | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

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
            setErro(err instanceof Error ? err.message : "Erro ao carregar informações do membro.");
        } finally {
            setCarregando(false);
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
            
        </>
    )
}