"use client";

import Link from "next/link";
import { useState } from "react";
import { Cake, ChevronLeft, ChevronRight, CircleAlert, Clock3, FileText, PenLine, TrendingUp, Users } from "lucide-react";
import { useAppSelector } from "@/app/redux/hook";
import { dashboardMock } from "@/app/services/mocks/dashboardMock";
import { cn } from "@/app/util";

const indicators = [
  {
    label: "Pacientes ativos",
    value: dashboardMock.pacientesAtivos,
    icon: Users,
    warning: false,
  },
  {
    label: "Média de acolhimento (dias)",
    value: dashboardMock.mediaAcolhimentoDias,
    icon: Clock3,
    warning: false,
  },
  {
    label: "Documentos",
    value: dashboardMock.documentos,
    icon: FileText,
    warning: false,
  },
  {
    label: "Pendentes de assinatura",
    value: dashboardMock.pendentesAssinatura,
    icon: PenLine,
    warning: true,
  },
];

const monthlyCounts: Record<string, number> = dashboardMock.documentosPorMes;
const monthFormat = new Intl.DateTimeFormat("pt-BR", { month: "short", year: "numeric", timeZone: "UTC" });
const buttonClass =
  "flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function HomePage() {
  const usuario = useAppSelector((state) => state.auth.usuario);
  const [month, setMonth] = useState(dashboardMock.mesReferencia);
  const [year, monthNumber] = month.split("-").map(Number);
  const selectedDate = new Date(Date.UTC(year, monthNumber - 1, 1));
  const monthLabel = monthFormat.format(selectedDate);

  function changeMonth(offset: number) {
    const nextMonth = new Date(Date.UTC(year, monthNumber - 1 + offset, 1));
    setMonth(nextMonth.toISOString().slice(0, 7));
  }

  return (
    <>
      <section className="border-b border-zinc-300 bg-zinc-200/60 text-zinc-900">
        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-7">
          <div className="mb-5">
            <p className="mb-0.5 text-sm text-zinc-500">Olá,</p>
            <h1 className="text-2xl font-semibold tracking-tight">
              {usuario?.nome ?? ""}
            </h1>
          </div>

          <dl className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-4">
            {indicators.map(({ label, value, icon: Icon, warning }) => (
              <div
                key={label}
                className={cn(
                  "flex flex-col rounded-xl border p-3 shadow-sm sm:p-4",
                  warning
                    ? "border-amber-200 bg-amber-50"
                    : "border-border bg-primary/5",
                )}
              >
                <Icon
                  className={cn(
                    "mb-2 h-4 w-4",
                    warning ? "text-amber-700" : "text-primary",
                  )}
                  aria-hidden="true"
                />

                <dt className="order-2 text-xs leading-relaxed text-zinc-600">
                  {label}
                </dt>

                <dd className="mb-1 text-2xl font-bold leading-tight tabular-nums">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-xl border border-border bg-primary/5 px-3 py-2 text-primary-dark lg:mt-4">
            <p className="flex items-center gap-2 text-xs">
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
              Documentos no mês
            </p>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => changeMonth(-1)} aria-label="Mês anterior" className={buttonClass}>
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="min-w-24 text-center text-xs font-medium capitalize" aria-live="polite" aria-atomic="true">
                {monthLabel}
              </span>
              <button type="button" onClick={() => changeMonth(1)} aria-label="Próximo mês" className={buttonClass}>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <output aria-label={`Documentos em ${monthLabel}`} className="ml-2 min-w-6 text-right text-xl font-bold tabular-nums">
                {monthlyCounts[month] ?? 0}
              </output>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-6 px-5 py-6 sm:px-8">
        <section aria-labelledby="avisos-titulo">
          <h2 id="avisos-titulo" className="mb-3 flex min-h-9 items-center gap-2 text-base font-semibold sm:text-lg">
            <CircleAlert className="h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
            Quadro de avisos
          </h2>
          <div className="space-y-3">
            {dashboardMock.avisos.map((aviso) => (
              <article key={aviso.id} className="rounded-2xl border border-border border-l-4 border-l-amber-500 bg-[#f8f5eb] p-4 shadow-sm">
                <p className="text-sm leading-relaxed">{aviso.mensagem}</p>
                <p className="mt-1 text-xs text-muted-foreground">Por {aviso.autor}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="documentos-titulo">
          <div className="mb-3 flex min-h-9 items-center justify-between gap-3">
            <h2 id="documentos-titulo" className="text-base font-semibold sm:text-lg">Últimos documentos criados</h2>
            <Link href="/documentos" className="shrink-0 rounded py-2 text-xs font-medium text-primary-dark hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-sm">
              Ver todos
            </Link>
          </div>
          <div className="space-y-3">
            {dashboardMock.documentosRecentes.map((documento) => (
              <article key={documento.id} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm leading-relaxed font-medium">{documento.titulo}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{documento.paciente}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{documento.data} · {documento.responsavel}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                    {documento.status}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="aniversarios-titulo">
          <h2 id="aniversarios-titulo" className="mb-3 flex min-h-9 items-center gap-2 text-base font-semibold sm:text-lg">
            <Cake className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            Próximos aniversariantes
          </h2>
          <div className="space-y-3">
            {dashboardMock.aniversariantes.map((aniversariante) => (
              <article key={aniversariante.id} className="flex items-center gap-3 rounded-2xl border border-secondary/40 bg-secondary/10 p-4 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/40 text-primary-dark">
                  <Cake className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-medium">{aniversariante.nome}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{aniversariante.data} · {aniversariante.idade} anos</p>
                  </div>
                  <span className="rounded-full bg-card/80 px-2.5 py-1 text-xs font-medium text-primary-dark">{aniversariante.vinculo}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
