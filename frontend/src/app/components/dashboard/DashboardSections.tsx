import Link from "next/link";
import { Cake, CircleAlert, FileText } from "lucide-react";
import { dashboardMock } from "@/app/services/mocks/dashboardMock";

export default function DashboardSections() {
  return (
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
  );
}
