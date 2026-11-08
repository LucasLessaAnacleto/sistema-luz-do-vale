"use client";

import { Bell, ChevronRight, CircleHelp, LayoutTemplate, LogOut, ShieldCheck, UserRound, Users } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { logout } from "@/app/redux/slices/authSlice";
import ConfiguracaoSecao from "./components/ConfigSecao";
import ConfiguracaoLink from "./components/ConfigLink";
import ConfigDetalhes from "./components/ConfigDetalhes";
import Button from "@/app/components/ui/Button";
import { iniciais } from "@/app/util";

export default function ConfiguracoesPage() {
  const usuario = useAppSelector((state) => state.auth.usuario);
  const dispatch = useAppDispatch();

  const isAdmin = usuario?.role === "ROLE_ADMIN";
  console.log("usuario", usuario);
  const resolveNome = usuario?.nome || (isAdmin ? "Administrador" : "Minha conta");

  return (
    <>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
          <h1 className="text-2xl font-semibold">Configurações</h1>
          <div className="mt-5">
            <section className="flex items-center gap-4 rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
              <span aria-hidden="true" className="flex shrink-0 items-center justify-center rounded-full bg-secondary font-medium text-foreground h-16 w-16 text-base">
                {iniciais(resolveNome)}
              </span>
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

          <ConfigDetalhes
            titulo="Informações Pessoais"
            descricao="Perfil, dados de acesso e senha"
            icon={UserRound}            
          >
             <dl className="space-y-3">

              <div>
                <dt className="text-xs text-muted-foreground">Nome</dt>
                <dd className="mt-1 text-sm">{usuario?.nome || (<span className="text-muted-foreground">{isAdmin ? "Conta de administrador" : "Não informado"}</span>)}</dd>
              </div>

              <div>
                <dt className="text-xs text-muted-foreground">E-mail</dt>
                <dd className="mt-1 text-sm">{usuario?.email || (<span className="text-muted-foreground">Não informado</span>)}</dd>
              </div>

              <div>
                <dt className="text-xs text-muted-foreground">Perfil</dt>
                <dd className="mt-1 text-sm">{usuario?.perfil || (<span className="text-muted-foreground">Não informado</span>)}</dd>
              </div>

            </dl>
          </ConfigDetalhes>

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
