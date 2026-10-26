"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { patientsMock } from "@/app/services/mocks/recordsMock";
import { normalizeSearch } from "@/app/util";

export default function PacientesPage() {
  const [search, setSearch] = useState("");
  const filteredPatients = patientsMock.filter((patient) =>
    normalizeSearch(`${patient.name} ${patient.nickname}`).includes(normalizeSearch(search)),
  );

  return (
    <>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="min-w-0 text-2xl font-semibold">Pacientes</h1>
            <button type="button" disabled aria-label="Novo paciente — em breve" title="Cadastro em breve" className="flex h-10 w-10 shrink-0 cursor-not-allowed items-center justify-center rounded-full bg-primary text-white opacity-70">
              <Plus className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-5">
            <div className="relative">
              <label htmlFor="buscar-paciente" className="sr-only">Buscar paciente</label>
              <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                id="buscar-paciente"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nome ou apelido..."
                className="w-full rounded-2xl border border-border py-3 pr-4 pl-12 text-base placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none bg-card"
              />
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Lista de pacientes" className="mx-auto max-w-6xl space-y-3 px-5 py-4 sm:px-8">
        <p role="status" className="sr-only">{filteredPatients.length} {filteredPatients.length === 1 ? "paciente encontrado" : "pacientes encontrados"}</p>
        {filteredPatients.length ? filteredPatients.map((patient) => (
          <Link
            key={patient.id}
            href={`/pacientes/${patient.id}`}
            aria-label={`Abrir prontuário de ${patient.name}`}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-6"
          >
            <span aria-hidden="true" className="flex shrink-0 items-center justify-center rounded-full bg-secondary font-medium text-foreground h-16 w-16 text-base">
              {patient.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("")}
            </span>
            <div className="min-w-0">
              <h2 className="break-words text-lg font-medium">{patient.name}</h2>
              <p className="text-sm text-muted-foreground">{patient.nickname}</p>
              <p className="mt-1 text-xs text-muted-foreground">{patient.lastUpdate ? `Último documento atualizado ${patient.lastUpdate}` : "Nenhum documento neste exemplo"}</p>
            </div>
          </Link>
        )) : (
          <div className="rounded-2xl border border-dashed border-secondary bg-card px-5 py-12 text-center">
            <Search className="mx-auto mb-3 h-7 w-7 text-primary" aria-hidden="true" />
            <h2 className="text-base font-semibold">Nenhum paciente encontrado</h2>
            <p className="mt-1 text-sm text-muted-foreground">Tente buscar por outro nome ou apelido.</p>
            <button type="button" onClick={() => setSearch("")} className="mt-4 min-h-11 cursor-pointer rounded-xl px-4 text-sm font-medium text-primary-dark hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              Limpar filtros
            </button>
          </div>
        )}
        <p className="pt-2 text-center text-xs text-muted-foreground">Dados de demonstração</p>
      </section>
    </>
  );
}
