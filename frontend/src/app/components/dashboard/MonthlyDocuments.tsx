"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";

interface MonthlyDocumentsProps {
  initialMonth: string;
  counts: Record<string, number>;
}

const monthFormat = new Intl.DateTimeFormat("pt-BR", { month: "short", year: "numeric", timeZone: "UTC" });
const buttonClass = "flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function MonthlyDocuments({ initialMonth, counts }: MonthlyDocumentsProps) {
  const [month, setMonth] = useState(initialMonth);
  const [year, monthNumber] = month.split("-").map(Number);
  const selectedDate = new Date(Date.UTC(year, monthNumber - 1, 1));
  const monthLabel = monthFormat.format(selectedDate);

  function changeMonth(offset: number) {
    const nextMonth = new Date(Date.UTC(year, monthNumber - 1 + offset, 1));
    setMonth(nextMonth.toISOString().slice(0, 7));
  }

  return (
    <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-xl border border-white/15 bg-white/10 px-3 py-2 lg:mt-4">
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
          {counts[month] ?? 0}
        </output>
      </div>
    </div>
  );
}
