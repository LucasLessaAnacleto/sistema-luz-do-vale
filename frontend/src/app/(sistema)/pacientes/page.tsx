"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buscarListaPacientes } from "@/app/services/pacienteService";
import type { Paciente } from "@/app/types/pacientes";
import { ChevronRight, Plus, Search } from "lucide-react";
import { normalizeSearch } from "@/app/util";

export default function PacientesPage() {
  const [search, setSearch] = useState("");
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;
    buscarListaPacientes()
      .then((dados) => { if (ativo) setPacientes(dados); })
      .catch(() => { if (ativo) setErro("Não foi possível carregar os pacientes. Verifique sua conexão e tente novamente."); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [tentativa]);

  const filteredPatients = pacientes.filter((patient) =>
    normalizeSearch(`${patient.nome} ${patient.apelido ?? ""}`).includes(
      normalizeSearch(search),
    ),
  );

  return (
    <>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold">Pacientes</h1>
            <Link href="/pacientes/novo" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <Plus className="h-4 w-4" aria-hidden="true" />Novo paciente
            </Link>
          </div>

          <div className="mt-5">
            <div className="relative">
              <label htmlFor="buscar-paciente" className="sr-only">
                Buscar paciente
              </label>
              <Search
                className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
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

      <section
        aria-label="Lista de pacientes"
        className="mx-auto max-w-6xl space-y-3 px-5 py-4 sm:px-8"
      >
        <p role="status" className="sr-only">
          {!carregando && !erro && <>{filteredPatients.length}{" "}
          {filteredPatients.length === 1
            ? "paciente encontrado"
            : "pacientes encontrados"}</>}
        </p>

        {carregando ? <p role="status" className="py-8 text-center text-muted-foreground">Carregando pacientes...</p> : erro ? (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <p>{erro}</p>
            <button type="button" onClick={() => { setErro(""); setCarregando(true); setTentativa((valor) => valor + 1); }} className="mt-2 cursor-pointer font-medium underline">Tentar novamente</button>
          </div>
        ) : filteredPatients.length ? (
          filteredPatients.map((patient) => (
            <Link
              key={patient.id}
              href={`/pacientes/${patient.id}`}
              aria-label={`Abrir perfil de ${patient.nome}`}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-6"
            >
              <span
                aria-hidden="true"
                className="flex shrink-0 items-center justify-center rounded-full bg-secondary font-medium text-foreground h-16 w-16 text-base"
              >
                {patient.nome
                  .trim()
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")}
              </span>

              <div className="min-w-0 flex-1">
                <h2 className="break-words text-lg font-medium">
                  {patient.nome}
                </h2>
                {patient.apelido && <p className="text-sm text-muted-foreground">{patient.apelido}</p>}
                <p className="mt-1 text-sm text-muted-foreground">
                  {patient.ativo ? "Ativo" : "Inativo"}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            </Link>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-secondary bg-card px-5 py-12 text-center">
            <Search
              className="mx-auto mb-3 h-7 w-7 text-primary"
              aria-hidden="true"
            />
            <h2 className="text-base font-semibold">
              {pacientes.length ? "Nenhum paciente encontrado" : "Nenhum paciente cadastrado"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {pacientes.length ? "Tente buscar por outro nome ou apelido." : "Clique em Novo paciente para realizar o primeiro cadastro."}
            </p>
            {search && <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-4 min-h-11 cursor-pointer rounded-xl px-4 text-sm font-medium text-primary-dark hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Limpar filtros
            </button>}
          </div>
        )}
      </section>
    </>
  );
}
