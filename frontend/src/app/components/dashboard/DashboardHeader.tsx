"use client";

import { Building2, Clock3, FileText, LogOut, PenLine, Users } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { logout } from "@/app/redux/slices/authSlice";
import { dashboardMock } from "@/app/services/mocks/dashboardMock";
import { cn } from "@/app/util";
import MonthlyDocuments from "./MonthlyDocuments";

const indicators = [
  { label: "Pacientes ativos", value: dashboardMock.pacientesAtivos, icon: Users, warning: false },
  { label: "Média de acolhimento (dias)", value: dashboardMock.mediaAcolhimentoDias, icon: Clock3, warning: false },
  { label: "Documentos", value: dashboardMock.documentos, icon: FileText, warning: false },
  { label: "Pendentes de assinatura", value: dashboardMock.pendentesAssinatura, icon: PenLine, warning: true },
];

export default function DashboardHeader() {
  const usuario = useAppSelector((state) => state.auth.usuario);
  const dispatch = useAppDispatch();

  return (
    <header className="bg-linear-to-br from-primary to-[#8a976f] text-white">
      <div className="border-b border-white/15">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2 sm:px-8">
          <span className="flex items-center gap-2 text-xs">
            <Building2 className="h-4 w-4" aria-hidden="true" />
            Luz do Vale
          </span>
          <button
            type="button"
            onClick={() => dispatch(logout())}
            className="flex min-h-10 cursor-pointer items-center gap-2 rounded-lg px-3 text-xs font-medium transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sair
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mb-0.5 text-sm text-white/90">Olá,</p>
            <h1 className="text-2xl font-semibold tracking-tight">{usuario?.nome ?? "Equipe"}</h1>
          </div>
          <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs">
            Dados de demonstração
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-4">
          {indicators.map(({ label, value, icon: Icon, warning }) => (
            <div
              key={label}
              className={cn(
                "flex flex-col rounded-xl border p-3 sm:p-4",
                warning ? "border-amber-300/40 bg-amber-400/15" : "border-white/15 bg-white/10",
              )}
            >
              <Icon className="mb-2 h-4 w-4 text-white/90" aria-hidden="true" />
              <dt className="order-2 text-xs leading-relaxed text-white/95">{label}</dt>
              <dd className="mb-1 text-2xl leading-tight font-bold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>

        <MonthlyDocuments
          initialMonth={dashboardMock.mesReferencia}
          counts={dashboardMock.documentosPorMes}
        />
      </div>
    </header>
  );
}
