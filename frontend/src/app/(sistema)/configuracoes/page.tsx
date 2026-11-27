"use client";

import { LogOut, ShieldCheck, UserRound, Users } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { logout } from "@/app/redux/slices/authSlice";
import ConfiguracaoSecao from "./components/ConfigSecao";
import ConfiguracaoLink from "./components/ConfigLink";
import Button from "@/app/components/ui/Button";
import AvatarIniciais from "@/app/components/ui/AvatarIniciais";

export default function ConfiguracoesPage() {
    const usuario = useAppSelector((state) => state.auth.usuario);
    const dispatch = useAppDispatch();

    const isAdmin = usuario?.role === "ROLE_ADMIN";
    const resolveNome = usuario?.nome || (isAdmin ? "Administrador" : "Minha conta");

    return (
        <>
            <section className="border-b border-border bg-card">
                <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
                    <h1 className="text-2xl font-semibold">Configurações</h1>
                    <div className="mt-5">
                        <section className="flex items-center gap-4 rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">

                            <AvatarIniciais nome={resolveNome} tamanho="lg" />

                            <div className="min-w-0">
                                <h2 className="break-words text-base font-medium">{resolveNome}</h2>
                                <p className="mt-1 break-all text-xs text-muted-foreground">{usuario?.email ?? "E-mail não informado"}</p>
                            </div>
                        </section>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-6xl space-y-6 px-5 py-6 sm:px-8">

                <ConfiguracaoSecao titulo="Conta">

                    <ConfiguracaoLink
                        href="/configuracoes/informacoes-pessoais"
                        titulo="Informações Pessoais"
                        descricao="Perfil, dados de acesso e senha"
                        icon={UserRound}
                    />

                </ConfiguracaoSecao>
  
        
                {isAdmin && (
                    <ConfiguracaoSecao titulo="Gestão">

                        <ConfiguracaoLink
                            href="/configuracoes/equipe"
                            titulo="Equipe"
                            descricao="Profissionais e contas de acesso"
                            icon={Users}
                        />

                        <ConfiguracaoLink
                            href="/configuracoes/perfis"
                            titulo="Perfis"
                            descricao="Perfis e permissões dos profissionais"
                            icon={ShieldCheck}
                        />

                    </ConfiguracaoSecao>
                )}


                {/* <ConfiguracaoSecao titulo="Documentos">

                    <ConfiguracaoLink
                        href="/configuracoes/documentos"
                        titulo="Documentos"
                        descricao="Modelos e templates de documentos"
                        icon={LayoutTemplate}
                    />

                </ConfiguracaoSecao>
        
                <ConfiguracaoSecao titulo="Suporte">
                    <ConfiguracaoLink
                        href="/configuracoes/suporte"
                        titulo="Suporte"
                        descricao="Ajuda e suporte técnico"
                        icon={CircleHelp}
                    />
                </ConfiguracaoSecao> */}

                <Button className="w-full !bg-red-50 !text-red-600 border border-red-200 hover:!bg-red-100"
                    onClick={() => dispatch(logout())}
                >
                    <LogOut className="h-4 w-4" aria-hidden="true" /> Sair da Conta
                </Button>

                <p className="text-center text-xs text-muted-foreground">Reabilitah · Prontuário eletrônico</p>
            </div>
        </>
    );
}
