"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ClipboardList, Clock3, FileText, Pencil, Plus, UserRound, Users } from "lucide-react";
import { documentsMock, patientsMock } from "@/app/services/mocks/recordsMock";
import { cn } from "@/app/util";

const tabs = [
  { id: "prontuario", label: "Prontuário" },
  { id: "historico", label: "Histórico" },
];

export default function PatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [selectedTab, setSelectedTab] = useState({ patientId: id, tab: "prontuario" });
  const activeTab = selectedTab.patientId === id ? selectedTab.tab : "prontuario";
  const patient = patientsMock.find((item) => String(item.id) === id);

  if (!patient) notFound();

  const documents = documentsMock.filter((item) => item.patientId === patient.id);
  const fields = [
    { label: "Nome completo", value: patient.name },
    { label: "Apelido", value: patient.nickname },
    ...patient.fields.filter((field) => field.label === "CPF" || field.label === "RG"),
    { label: "Data de nascimento", value: patient.birthDate },
    { label: "Idade", value: `${patient.age} anos` },
    ...patient.fields.filter((field) => field.label !== "CPF" && field.label !== "RG"),
  ];

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;

    event.preventDefault();
    setSelectedTab({ patientId: id, tab: tabs[nextIndex].id });
    document.getElementById(`tab-${tabs[nextIndex].id}`)?.focus();
  }

  return (
    <>
      <section aria-label="Resumo do paciente" className="bg-linear-to-br from-primary to-[#8a976f] text-white">
        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <Link href="/pacientes" aria-label="Voltar para pacientes" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </Link>
            <div className="flex items-center gap-2">
              <button type="button" disabled aria-label="Editar paciente — em breve" title="Edição em breve" className="flex min-h-10 cursor-not-allowed items-center gap-1.5 rounded-full bg-white/10 px-3 text-sm opacity-70">
                <Pencil className="h-4 w-4" aria-hidden="true" />Editar
              </button>
              <button type="button" disabled aria-label="Novo documento do paciente — em breve" title="Criação de documentos em breve" className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full bg-white text-primary opacity-70">
                <Plus className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span aria-hidden="true" className="flex shrink-0 items-center justify-center rounded-full bg-secondary font-medium text-foreground h-24 w-24 text-xl border-4 border-white/30 shadow-lg">
              {patient.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("")}
            </span>
            <div className="min-w-0">
              <h1 className="break-words text-xl font-semibold">{patient.name}</h1>
              <p className="mt-0.5 text-sm text-white/90">{patient.nickname}</p>
              <p className="mt-1.5 text-sm font-medium">{patient.age} anos</p>
              <p className="text-sm text-white/80">{patient.admission}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="border-b border-border bg-card">
        <div role="tablist" aria-label="Informações do paciente" className="mx-auto flex max-w-6xl">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`painel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => setSelectedTab({ patientId: id, tab: tab.id })}
              onKeyDown={(event) => handleTabKey(event, index)}
              className={cn("min-h-13 flex-1 cursor-pointer border-b-2 px-4 py-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-primary", activeTab === tab.id ? "border-primary text-primary-dark" : "border-transparent text-muted-foreground hover:bg-primary/5")}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
        <section id="painel-prontuario" role="tabpanel" aria-labelledby="tab-prontuario" hidden={activeTab !== "prontuario"} tabIndex={0} className="space-y-5 focus-visible:outline-2 focus-visible:outline-primary">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><UserRound className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />Dados do Acolhido</h2>
            <dl className="divide-y divide-border">
              {fields.map((field) => (
                <div key={field.label} className="grid grid-cols-[minmax(0,120px)_minmax(0,1fr)] items-start gap-3 py-2 sm:grid-cols-[144px_minmax(0,1fr)]">
                  <dt className="text-xs leading-5 text-muted-foreground">{field.label}</dt>
                  <dd className="break-words text-sm">{field.value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><ClipboardList className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />Tipos de Dependência</h2>
            {patient.dependencies.length ? (
              <>
                <div className="mb-4 flex flex-wrap gap-2">
                  {patient.dependencies.map((dependency) => <span key={dependency} className="rounded-full bg-accent px-3 py-1 text-sm text-primary-dark">{dependency}</span>)}
                </div>
                <dl className="divide-y divide-border">
                  {patient.dependencyHistory.map((field) => (
                    <div key={field.label} className="grid grid-cols-[minmax(0,120px)_minmax(0,1fr)] items-start gap-3 py-2 sm:grid-cols-[144px_minmax(0,1fr)]">
                      <dt className="text-xs leading-5 text-muted-foreground">{field.label}</dt>
                      <dd className="break-words text-sm">{field.value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : <p className="text-sm text-muted-foreground">Não informado neste exemplo.</p>}
          </section>
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Users className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />Dados dos Responsáveis</h2>
            {patient.responsibles.length ? patient.responsibles.map((responsible, index) => (
              <div key={index} className="mt-4 first:mt-0">
                <h3 className="mb-2 text-xs font-medium text-muted-foreground uppercase">Responsável {index + 1}</h3>
                <dl className="divide-y divide-border">
                  {responsible.map((field) => (
                    <div key={field.label} className="grid grid-cols-[minmax(0,120px)_minmax(0,1fr)] items-start gap-3 py-2 sm:grid-cols-[144px_minmax(0,1fr)]">
                      <dt className="text-xs leading-5 text-muted-foreground">{field.label}</dt>
                      <dd className="break-words text-sm">{field.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )) : <p className="text-sm text-muted-foreground">Nenhum responsável informado neste exemplo.</p>}
          </section>
        </section>

        <section id="painel-historico" role="tabpanel" aria-labelledby="tab-historico" hidden={activeTab !== "historico"} tabIndex={0} className="focus-visible:outline-2 focus-visible:outline-primary">
          {documents.length ? (
            <ol className="space-y-4">
              {documents.map((entry, index) => (
                <li key={entry.id} className="relative flex gap-4">
                  {index < documents.length - 1 && <span aria-hidden="true" className="absolute top-10 bottom-[-16px] left-5 w-px bg-border" />}
                  <span className={cn("z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white", entry.status === "pendente" ? "bg-amber-500" : "bg-primary")}>
                    <FileText className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <article className="min-w-0 flex-1 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h2 className="text-sm font-medium">{entry.title}</h2>
                        <p className="text-xs text-muted-foreground">{entry.code}</p>
                      </div>
                      <span className={cn("inline-flex shrink-0 rounded-full border px-3 py-1 text-xs font-medium", entry.status === "pendente" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-primary/20 bg-primary/10 text-primary-dark")}>
                        {entry.status === "pendente" ? "Pendente" : "Assinado"}
                      </span>
                    </div>
                    <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{entry.date}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Por {entry.author}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{entry.updatedAt}</p>
                  </article>
                </li>
              ))}
            </ol>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <FileText className="mx-auto mb-3 h-7 w-7 text-primary" aria-hidden="true" />
              <h2 className="text-base font-medium">Nenhum documento neste exemplo</h2>
              <p className="mt-1 text-sm text-muted-foreground">Os registros do paciente serão exibidos aqui.</p>
            </div>
          )}
        </section>
        <p className="mt-6 text-center text-xs text-muted-foreground">Dados de demonstração</p>
      </div>
    </>
  );
}
