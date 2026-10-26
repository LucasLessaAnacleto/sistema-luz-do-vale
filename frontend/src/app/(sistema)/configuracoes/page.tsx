"use client";

import { Bell, ChevronRight, CircleHelp, LayoutTemplate, LogOut, UserRound, Users } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { logout } from "@/app/redux/slices/authSlice";

export default function ConfiguracoesPage() {
  const usuario = useAppSelector((state) => state.auth.usuario);
  const dispatch = useAppDispatch();

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
        <section aria-label="Conta">
          <h2 className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">Conta</h2>
          <div className="rounded-2xl border border-border bg-card p-2 shadow-sm sm:p-3">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-4 rounded-xl p-4 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"><UserRound className="h-5 w-5" aria-hidden="true" /></span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium">Informações Pessoais</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">Perfil, dados de acesso e senha</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-90 motion-reduce:transition-none" aria-hidden="true" />
              </summary>
              <div className="mx-4 border-t border-border py-4">
                <dl className="space-y-3">
                  <div><dt className="text-xs text-muted-foreground">Nome</dt><dd className="mt-1 break-words text-sm">{usuario?.nome ?? "Não informado"}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">E-mail</dt><dd className="mt-1 break-all text-sm">{usuario?.email ?? "Não informado"}</dd></div>
                </dl>
                <p className="mt-4 text-xs text-muted-foreground">Edição de perfil e alteração de senha disponíveis em breve.</p>
              </div>
            </details>
          </div>
        </section>

        <section aria-label="Gestão">
          <h2 className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">Gestão</h2>
          <div className="rounded-2xl border border-border bg-card p-2 shadow-sm sm:p-3">
            <div className="flex items-center gap-4 rounded-xl p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"><Users className="h-5 w-5" aria-hidden="true" /></span>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium">Equipe</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">Profissionais e contas de acesso</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">Em breve</span>
            </div>
          </div>
        </section>

        <section aria-label="Preferências">
          <h2 className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">Preferências</h2>
          <div className="rounded-2xl border border-border bg-card p-2 shadow-sm sm:p-3">
            <div className="flex items-center gap-4 rounded-xl p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"><Bell className="h-5 w-5" aria-hidden="true" /></span>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium">Notificações</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">Alertas e lembretes</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">Em breve</span>
            </div>
            <div className="flex items-center gap-4 rounded-xl p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"><LayoutTemplate className="h-5 w-5" aria-hidden="true" /></span>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium">Layout</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">Modelo visual dos documentos institucionais</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">Em breve</span>
            </div>
          </div>
        </section>

        <section aria-label="Suporte">
          <h2 className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">Suporte</h2>
          <div className="rounded-2xl border border-border bg-card p-2 shadow-sm sm:p-3">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-4 rounded-xl p-4 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"><CircleHelp className="h-5 w-5" aria-hidden="true" /></span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium">Ajuda e Suporte</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">Central de ajuda</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-90 motion-reduce:transition-none" aria-hidden="true" />
              </summary>
              <div className="mx-4 border-t border-border py-4">
                <p className="text-sm leading-relaxed text-muted-foreground">Em caso de dúvidas sobre o acesso ou seus dados, procure a administração da Luz do Vale.</p>
              </div>
            </details>
          </div>
        </section>

        <button type="button" onClick={() => dispatch(logout())} className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
          <LogOut className="h-4 w-4" aria-hidden="true" />Sair da Conta
        </button>
        <p className="text-center text-xs text-muted-foreground">Reabilitah · Prontuário eletrônico</p>
      </div>
    </>
  );
}
