"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ChevronRight, FileText, LockKeyhole, UserRound } from "lucide-react";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import { useAppSelector } from "@/app/redux/hook";
import { createDocument } from "@/app/services/documentService";
import { documentTemplates } from "@/app/services/mocks/documentTemplates";
import { patientsMock } from "@/app/services/mocks/recordsMock";
import type { DocumentField, DocumentTemplate } from "@/app/types/documentos";

const backClass = "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent hover:bg-secondary/50";
const cancelClass = "rounded-xl border border-border bg-card px-5 py-3 text-sm font-medium hover:bg-accent";

export default function NovoDocumentoPage() {
  const paciente = useSearchParams().get("paciente");
  const initialPatient = patientsMock.find((item) => String(item.id) === paciente);
  const [patientId, setPatientId] = useState("");
  const [template, setTemplate] = useState<DocumentTemplate | null>(null);
  const [fields, setFields] = useState<DocumentField[]>([]);
  const [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const saving = useRef(false);
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.usuario);
  const patient = initialPatient ?? patientsMock.find((item) => String(item.id) === patientId);
  const backHref = initialPatient ? "/pacientes/" + initialPatient.id + "?aba=historico" : "/documentos";

  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!template) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const values: DocumentField[] = [];
    for (const field of template.fields) {
      const value = String(data.get(field.name) ?? "");
      if (!value.trim()) {
        const input = form.elements.namedItem(field.name) as HTMLInputElement | HTMLTextAreaElement;
        input.setCustomValidity("Preencha este campo.");
        input.reportValidity();
        return;
      }
      values.push({ label: field.label, value: field.type === "date" ? value.split("-").reverse().join("/") : value });
    }
    if (template.id === "controle-saida") {
      const departure = String(data.get("dataSaida")) + "T" + data.get("horaSaida");
      const arrival = String(data.get("dataRetorno")) + "T" + data.get("horaRetorno");
      if (arrival < departure) {
        setError("O retorno deve ocorrer após a saída.");
        return;
      }
    }
    setError("");
    setFields(values);
    dialog.current?.showModal();
  }

  function save() {
    if (!patient || !template || !user || saving.current) return;
    saving.current = true;
    try {
      const doc = createDocument({
        title: template.title, statement: template.statement, fields,
        patientId: patient.id, patient: patient.name, nickname: patient.nickname, author: user.nome,
      });
      dialog.current?.close();
      router.replace("/documentos/" + doc.id + (initialPatient ? "?origem=historico" : ""));
    } catch {
      saving.current = false;
      dialog.current?.close();
      setError("Não foi possível salvar o documento neste navegador. Tente novamente.");
    }
  }

  return (
    <>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl space-y-4 px-5 py-6 sm:px-8">
          <div className="flex items-center gap-3">
            {template ? (
              <button type="button"  onClick={() => { setTemplate(null); setError(""); }} className={backClass}>
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : (
              <Link href={backHref}  className={backClass}><ArrowLeft className="h-5 w-5" /></Link>
            )}
            <div>
              {template && <p className="mb-1 text-xs text-muted-foreground">Novo documento</p>}
              <h1 className="text-xl font-semibold sm:text-2xl">{template?.title ?? "Novo documento"}</h1>
            </div>
          </div>
          {patient && (initialPatient || template) ? (
            <div className="flex items-center gap-3 rounded-xl bg-primary/5 p-3">
              <UserRound className="h-9 w-9 rounded-full bg-accent p-2 text-primary-dark" />
              <div><p className="text-sm font-medium">{patient.name}</p><p className="text-xs text-muted-foreground">{patient.nickname}</p></div>
            </div>
          ) : (
            <label className="block text-sm font-medium">Paciente
              <select value={patientId} onChange={(event) => setPatientId(event.target.value)} className="mt-2 block min-h-11 w-full rounded-xl border border-border bg-background px-3">
                <option value="">Selecione o paciente</option>
                {patientsMock.map((item) => <option key={item.id} value={item.id}>{item.name} ({item.nickname})</option>)}
              </select>
            </label>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 py-6 sm:px-8">
        {!template ? (
          <section aria-labelledby="tipos-titulo" className="space-y-3">
            <h2 id="tipos-titulo" className="mb-4 text-sm font-semibold text-muted-foreground">Selecione o tipo de documento</h2>
            {documentTemplates.map((item) => (
              <button key={item.id} type="button" disabled={!patient || !item.fields.length} onClick={() => setTemplate(item)}
                className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-sm enabled:cursor-pointer enabled:hover:border-primary/50 disabled:opacity-60">
                <span className="rounded-xl bg-primary/10 p-3 text-primary-dark">
                  {item.fields.length ? <FileText className="h-5 w-5" /> : <LockKeyhole className="h-5 w-5" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{item.title}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{item.description}</span>
                  {!item.fields.length && <span className="mt-1 block text-xs text-muted-foreground">Em desenvolvimento</span>}
                </span>
                {!!item.fields.length && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
              </button>
            ))}
          </section>
        ) : (
          <form onSubmit={review} className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            {template.statement && <p className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed">{template.statement}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              {template.fields.map((field) => field.type === "textarea" ? (
                <div key={field.name} className="sm:col-span-2">
                  <label htmlFor={field.name} className="mb-2 block text-sm font-medium">{field.label}</label>
                  <textarea required id={field.name} name={field.name} rows={6} placeholder={field.placeholder}
                    onInput={(event) => event.currentTarget.setCustomValidity("")}
                    className="w-full resize-y rounded-xl border border-border px-4 py-3 text-base focus:outline-2 focus:outline-ring" />
                </div>
              ) : (
                <Input key={field.name} type={field.type} label={field.label} name={field.name} required />
              ))}
            </div>
            {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
            <div className="flex flex-wrap justify-end gap-3">
              <Link href={backHref} className={cancelClass}>Cancelar</Link>
              <Button type="submit">Revisar e salvar</Button>
            </div>
          </form>
        )}
      </div>

      <dialog ref={dialog} aria-labelledby="confirmar-titulo" className="fixed inset-0 m-auto max-h-[85svh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl bg-card p-6 text-foreground shadow-xl backdrop:bg-black/45">
        <h2 id="confirmar-titulo" className="text-lg font-semibold">Confirmar criação</h2>
        <p className="mt-1 text-sm text-muted-foreground">{template?.title} · {patient?.name}</p>
        <dl className="my-4 divide-y divide-border">
          {fields.map((field) => <div key={field.label} className="py-2"><dt className="text-xs text-muted-foreground">{field.label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm">{field.value}</dd></div>)}
        </dl>
        <p className="text-sm text-muted-foreground">Depois de salvar, os campos ficam disponíveis somente para leitura.</p>
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button type="button" className={cancelClass} onClick={() => dialog.current?.close()}>Voltar ao formulário</button>
          <Button onClick={save}>Salvar documento</Button>
        </div>
      </dialog>
    </>
  );
}
