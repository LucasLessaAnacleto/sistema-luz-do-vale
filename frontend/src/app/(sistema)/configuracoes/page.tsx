"use client";

import { Bell, ChevronRight, CircleHelp, LayoutTemplate, LogOut, ShieldCheck, UserRound, Users } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { logout } from "@/app/redux/slices/authSlice";
import ConfiguracaoSecao from "./components/ConfigSecao";
import ConfiguracaoLink from "./components/ConfigLink";

export default function ConfiguracoesPage() {
  const usuario = useAppSelector((state) => state.auth.usuario);
  const dispatch = useAppDispatch();

  const isAdmin = usuario?.role === "ROLE_ADMIN";
  console.log("usuario", usuario);

  return (
    <>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
          <h1 className="text-2xl font-semibold">Configurações</h1>
          <div className="mt-5">
            <section aria-label="Conta atual" className="flex items-center gap-4 rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
              <span aria-hidden="true" className="flex shrink-0 items-center justify-center rounded-full bg-secondary font-medium text-foreground h-16 w-16 text-base">
                {(usuario?.nome ?? "Minha conta").trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("")}
              </span>
              <div className="min-w-0">
                <h2 className="break-words text-base font-medium">{usuario?.nome ?? "Minha conta"}</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">Luz do Vale</p>
                <p className="mt-1 break-all text-xs text-muted-foreground">{usuario?.email ?? "E-mail não informado"}</p>
              </div>
            </section>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-6 px-5 py-6 sm:px-8">

        <ConfiguracaoSecao titulo="Conta">

          <ConfiguracaoLink
            href="/configuracoes/conta"
            titulo="Informações Pessoais"
            descricao="Perfil, dados de acesso e senha"
            icon={UserRound}
          />
          
        </ConfiguracaoSecao>
  
        <ConfiguracaoSecao titulo="Gestão">

          <ConfiguracaoLink
            href="/configuracoes/equipe"
            titulo="Equipe"
            descricao="Profissionais e contas de acesso"
            icon={Users}
          />

          {isAdmin && (
            <ConfiguracaoLink
              href="/configuracoes/perfis"
              titulo="Perfis"
              descricao="Perfis e permissões dos profissionais"
              icon={ShieldCheck}
            />
          )}

        </ConfiguracaoSecao>

        <ConfiguracaoSecao titulo="Documentos">

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
        </ConfiguracaoSecao>

        <button type="button" onClick={() => dispatch(logout())} className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
          <LogOut className="h-4 w-4" aria-hidden="true" />Sair da Conta
        </button>
        <p className="text-center text-xs text-muted-foreground">Reabilitah · Prontuário eletrônico</p>
      </div>
    </>
  );
}
