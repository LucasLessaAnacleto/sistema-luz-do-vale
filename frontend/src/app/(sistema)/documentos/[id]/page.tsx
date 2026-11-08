"use client";

import Link from "next/link";
import { use, useState } from "react";
import { ArrowLeft, Clock3, FileText, History, LockKeyhole, Printer, UserRound } from "lucide-react";
import { useDocuments } from "@/app/services/documentService";
import { cn } from "@/app/util";

export default function DocumentoPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ origem?: string }>;
}) {
  const { id } = use(params);
  const { origem } = use(searchParams);
  const { documents, ready } = useDocuments();
  const [audit, setAudit] = useState(false);
  const doc = documents.find((item) => item.id === id);

  if (!ready) return <p role="status" className="p-8 text-center">Carregando documento...</p>;
  if (!doc) return (
    <div className="mx-auto max-w-3xl space-y-3 px-5 py-12 text-center">
      <h1 className="text-xl font-semibold">Documento não encontrado</h1>
      <Link href="/documentos" className="text-sm text-primary-dark underline">Voltar para documentos</Link>
    </div>
  );

  const historyHref = "/pacientes/" + doc.patientId + "?aba=historico";
  const backHref = origem === "historico" ? historyHref : "/documentos";

  return (
    <>
      <section className="border-b border-border bg-card print:hidden">
        <div className="mx-auto max-w-4xl space-y-4 px-5 py-6 sm:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <Link href={backHref} aria-label={origem === "historico" ? "Voltar ao histórico" : "Voltar para documentos"} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent hover:bg-secondary/50"><ArrowLeft className="h-5 w-5" /></Link>
            <div className="min-w-0 flex-1"><h1 className="text-xl font-semibold">{doc.title}</h1><p className="mt-1 text-xs text-muted-foreground">{doc.code} · Versão 1</p></div>
            <span className={cn("rounded-full border px-3 py-1 text-xs", doc.status === "pendente" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-primary/20 bg-primary/10 text-primary-dark")}>{doc.status === "pendente" ? "Pendente de assinatura" : "Assinado"}</span>
          </div>
          <Link href={historyHref} className="flex items-center gap-3 rounded-xl bg-primary/5 p-3 text-sm hover:bg-primary/10">
            <UserRound className="h-8 w-8 rounded-full bg-accent p-1.5 text-primary-dark" />
            <span className="flex-1 font-medium">{doc.patient} <span className="font-normal text-muted-foreground">({doc.nickname})</span></span>
            <History className="h-4 w-4 text-primary" /><span className="text-xs text-primary-dark">Histórico</span>
          </Link>
          <div className="flex gap-4" role="group" >
            {[{ label: "Documento", value: false, icon: FileText }, { label: "Auditoria", value: true, icon: Clock3 }].map(({ label, value, icon: Icon }) => (
              <button key={label} type="button" aria-pressed={audit === value} onClick={() => setAudit(value)} className={cn("flex items-center gap-2 border-b-2 px-2 py-2 text-sm font-medium", audit === value ? "border-primary text-primary-dark" : "border-transparent text-muted-foreground")}>
                <Icon className="h-4 w-4" />{label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 py-6 sm:px-8">
        {audit ? (
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-semibold"><History className="h-5 w-5 text-primary" />Histórico do documento</h2>
            <p className="text-sm font-medium">Criação do documento · Versão 1</p>
            <p className="mt-1 text-sm text-muted-foreground">{doc.author} · {doc.date}</p>
          </section>
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground print:hidden">
              <span className="flex items-center gap-2"><LockKeyhole className="h-4 w-4" />Somente leitura</span>
              <button type="button" onClick={() => window.print()} className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 hover:bg-accent"><Printer className="h-4 w-4" />Imprimir</button>
            </div>
            <article className="documento-impresso rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-10 print:border-0 print:shadow-none">
              <div className="border-b border-secondary/60 pb-5">
                <p className="text-xs font-medium uppercase tracking-wider text-primary-dark">Instituição Luz do Vale</p>
                <h2 className="mt-2 text-2xl font-semibold">{doc.title}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{doc.code} · Versão 1 · {doc.status === "pendente" ? "Pendente de assinatura" : "Assinado"}</p>
              </div>
              <dl className="grid gap-4 border-b border-border py-5 text-sm sm:grid-cols-2">
                <div><dt className="text-xs text-muted-foreground">Paciente</dt><dd className="mt-1 font-medium">{doc.patient}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Apelido</dt><dd className="mt-1">{doc.nickname}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Registrado por</dt><dd className="mt-1">{doc.author}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Data de criação</dt><dd className="mt-1">{doc.date}</dd></div>
              </dl>
              {doc.statement && <p className="mt-6 text-sm leading-relaxed">{doc.statement}</p>}
              <dl className="mt-6 space-y-4">
                {doc.fields.map((field) => (
                  <div key={field.label}><dt className="mb-1.5 text-sm font-medium">{field.label}</dt>
                    <dd className="whitespace-pre-wrap break-words rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed">{field.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          </>
        )}
      </div>
    </>
  );
}
