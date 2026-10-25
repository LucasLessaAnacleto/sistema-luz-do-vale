"use client";

import { Clock3, FileText, PenLine, Users } from "lucide-react";
import { useAppSelector } from "@/app/redux/hook";
import { dashboardMock } from "@/app/services/mocks/dashboardMock";
import { cn } from "@/app/util";
import MonthlyDocuments from "./MonthlyDocuments";

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

export default function DashboardHeader() {
  const usuario = useAppSelector((state) => state.auth.usuario);

  return (
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

        <MonthlyDocuments
          initialMonth={dashboardMock.mesReferencia}
          counts={dashboardMock.documentosPorMes}
        />
      </div>
    </section>
  );
}