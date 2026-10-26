"use client";

import Link from "next/link";
import { useState } from "react";
import { FileText, Search, SlidersHorizontal } from "lucide-react";
import { documentsMock } from "@/app/services/mocks/recordsMock";
import { cn, normalizeSearch } from "@/app/util";

export default function DocumentosPage() {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [patient, setPatient] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [author, setAuthor] = useState("");
  const pendingCount = documentsMock.filter((document) => document.status === "pendente").length;
  const filterCount = [patient, type, status, author].filter(Boolean).length;
  const patients = Array.from(new Map(documentsMock.map((document) => [document.patientId, document.patient])));
  const types = Array.from(new Set(documentsMock.map((document) => document.title)));
  const authors = Array.from(new Set(documentsMock.map((document) => document.author)));
  const filteredDocuments = documentsMock.filter((document) =>
    normalizeSearch(`${document.title} ${document.code} ${document.patient} ${document.nickname} ${document.author}`).includes(normalizeSearch(search))
    && (!patient || String(document.patientId) === patient)
    && (!type || document.title === type)
    && (!status || document.status === status)
    && (!author || document.author === author),
  );

  function clearFilters() {
    setSearch("");
    setPatient("");
    setType("");
    setStatus("");
    setAuthor("");
  }

  return (
    <>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold">Documentos</h1>
              <p className="mt-1 text-xs text-muted-foreground">{documentsMock.length} documentos no total · <span className="text-warning">{pendingCount} pendentes</span></p>
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-controls="filtros-documentos"
              className={cn("flex min-h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary", showFilters ? "border-primary bg-primary text-white" : "border-border bg-card hover:bg-accent")}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filtros{filterCount > 0 && <span> ({filterCount})</span>}
            </button>
          </div>
          <div className="mt-5">
            <div className="relative">
              <label htmlFor="buscar-documento" className="sr-only">Buscar documento</label>
              <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                id="buscar-documento"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por paciente, título, ID ou autor..."
                className="w-full rounded-2xl border border-border py-3 pr-4 pl-12 text-base placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none bg-accent"
              />
            </div>
            {showFilters && (
              <section id="filtros-documentos" aria-label="Filtrar documentos" className="mt-4 rounded-2xl border border-border bg-background p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-sm font-medium">Filtrar por</h2>
                  <button type="button" onClick={clearFilters} className="min-h-9 cursor-pointer rounded px-2 text-xs text-primary-dark hover:underline focus-visible:outline-2 focus-visible:outline-primary">Limpar filtros</button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="block min-w-0 text-xs text-muted-foreground">
                    Paciente
                    <select value={patient} onChange={(event) => setPatient(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none">
                      <option value="">Todos</option>
                      {patients.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                    </select>
                  </label>
                  <label className="block min-w-0 text-xs text-muted-foreground">
                    Tipo
                    <select value={type} onChange={(event) => setType(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none">
                      <option value="">Todos os tipos</option>
                      {types.map((name) => <option key={name}>{name}</option>)}
                    </select>
                  </label>
                  <label className="block min-w-0 text-xs text-muted-foreground">
                    Status
                    <select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none">
                      <option value="">Todos os status</option>
                      <option value="pendente">Pendente de assinatura</option>
                      <option value="assinado">Assinado</option>
                    </select>
                  </label>
                  <label className="block min-w-0 text-xs text-muted-foreground">
                    Responsável
                    <select value={author} onChange={(event) => setAuthor(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none">
                      <option value="">Todos</option>
                      {authors.map((name) => <option key={name}>{name}</option>)}
                    </select>
                  </label>
                </div>
              </section>
            )}
          </div>
        </div>
      </section>

      <section aria-label="Lista de documentos" className="mx-auto max-w-6xl space-y-3 px-5 py-4 sm:px-8">
        <p role="status" className="sr-only">{filteredDocuments.length} {filteredDocuments.length === 1 ? "documento encontrado" : "documentos encontrados"}</p>
        {filteredDocuments.length ? filteredDocuments.map((document) => (
          <article key={document.id} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="break-words text-sm font-medium">{document.title}</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">{document.code}</p>
                </div>
                <span className={cn("inline-flex shrink-0 rounded-full border px-3 py-1 text-xs font-medium", document.status === "pendente" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-primary/20 bg-primary/10 text-primary-dark")}>
                  {document.status === "pendente" ? "Pendente de assinatura" : "Assinado"}
                </span>
              </div>
              <Link href={`/pacientes/${document.patientId}`} className="mt-2 flex w-fit max-w-full items-center gap-2 rounded-lg text-xs hover:text-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                <span aria-hidden="true" className="flex shrink-0 items-center justify-center rounded-full bg-secondary font-medium text-foreground h-8 w-8 text-xs">
                  {document.patient.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("")}
                </span>
                <span>{document.patient} <span className="text-muted-foreground">({document.nickname})</span></span>
              </Link>
              <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
                <p>{document.author}</p>
                <p>{document.updatedAt}</p>
              </div>
            </div>
          </article>
        )) : (
          <div className="rounded-2xl border border-dashed border-secondary bg-card px-5 py-12 text-center">
            <Search className="mx-auto mb-3 h-7 w-7 text-primary" aria-hidden="true" />
            <h2 className="text-base font-semibold">Nenhum documento encontrado</h2>
            <p className="mt-1 text-sm text-muted-foreground">Tente outro termo ou altere os filtros.</p>
            <button type="button" onClick={clearFilters} className="mt-4 min-h-11 cursor-pointer rounded-xl px-4 text-sm font-medium text-primary-dark hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              Limpar filtros
            </button>
          </div>
        )}
        <p className="pt-2 text-center text-xs text-muted-foreground">Dados de demonstração</p>
      </section>
    </>
  );
}
