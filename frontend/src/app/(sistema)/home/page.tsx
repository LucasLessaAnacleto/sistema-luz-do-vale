import {
  AlertCircle,
  Cake,
  Clock,
  FileText,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background pb-24">
      <HomeHeader />

      <div className="space-y-6 px-6 py-6">
        <NoticesSection />
        <RecentDocumentsSection />
        <BirthdaysSection />
      </div>
    </main>
  );
}

function HomeHeader() {
  return (
    <header className="bg-linear-to-br from-primary to-primary/80 px-6 pt-12 pb-6 text-white">
      <div className="mb-5">
        <p className="mb-0.5 text-sm text-white/70">Olá,</p>
        <h1 className="text-2xl font-semibold">
          Abel Rodrigues
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatCard
          icon={<Users className="h-4 w-4" />}
          value={8}
          label="Pacientes Ativos"
        />

        <StatCard
          icon={<Clock className="h-4 w-4" />}
          value={106}
          label="Média Internação (dias)"
        />

        <StatCard
          icon={<FileText className="h-4 w-4" />}
          value={15}
          label="Documentos"
        />

        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          value={3}
          label="Pendentes de Assinatura"
          warning
        />
      </div>

      <MonthlyDocuments />
    </header>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  warning?: boolean;
}

function StatCard({
  icon,
  value,
  label,
  warning = false,
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        warning
          ? "border-warning/40 bg-warning/20"
          : "border-white/5 bg-white/10"
      }`}
    >
      <div className="mb-1.5 flex items-center justify-between text-white/60">
        {icon}

        {warning && (
          <span className="h-2 w-2 animate-pulse rounded-full bg-warning" />
        )}
      </div>

      <p className="mb-1 text-xl font-bold leading-none">
        {value}
      </p>

      <p className="text-[11px] leading-tight text-white/60">
        {label}
      </p>
    </div>
  );
}

function MonthlyDocuments() {
  return (
    <div className="mt-2 flex items-center justify-between rounded-xl border border-white/5 bg-white/10 px-4 py-3">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-white/60" />

        <p className="text-[11px] text-white/60">
          Documentos no mês
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button className="text-white/60 hover:text-white">
          ‹
        </button>

        <span className="text-xs font-medium">
          Out 2026
        </span>

        <button className="text-white/60 hover:text-white">
          ›
        </button>

        <span className="ml-1 text-xl font-bold">
          3
        </span>
      </div>
    </div>
  );
}

function NoticesSection() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <AlertCircle className="h-5 w-5 text-warning" />
          Quadro de Avisos
        </h2>

        <button className="flex items-center gap-1 text-sm font-medium text-primary">
          <Plus className="h-4 w-4" />
          Novo aviso
        </button>
      </div>

      <div className="space-y-2">
        <NoticeCard
          text="Reunião de equipe quinta-feira às 14:30 no auditório."
          author="Abel Rodrigues"
        />

        <NoticeCard
          text="Visita de familiares programada para sábado."
          author="Equipe Administrativa"
        />
      </div>
    </section>
  );
}

function NoticeCard({
  text,
  author,
}: {
  text: string;
  author: string;
}) {
  return (
    <article className="rounded-2xl border border-border border-l-4 border-l-warning bg-warning/5 p-4 shadow-sm">
      <p className="mb-1 text-sm text-foreground">
        {text}
      </p>

      <p className="text-xs text-muted-foreground">
        Por {author}
      </p>
    </article>
  );
}

function RecentDocumentsSection() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Últimos documentos criados
        </h2>

        <button className="text-sm font-medium text-primary">
          Ver todos
        </button>
      </div>

      <div className="space-y-2">
        <DocumentCard
          title="Controle de Saída de Pacientes"
          patient="Marcos Santos"
          date="01/10/2026"
          responsible="Enf. Maria Rodrigues"
        />

        <DocumentCard
          title="Termo de Acolhimento"
          patient="João Silva"
          date="01/10/2026"
          responsible="Abel Rodrigues"
        />
      </div>
    </section>
  );
}

interface DocumentCardProps {
  title: string;
  patient: string;
  date: string;
  responsible: string;
}

function DocumentCard({
  title,
  patient,
  date,
  responsible,
}: DocumentCardProps) {
  return (
    <button className="w-full rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition hover:border-primary/30">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <FileText className="h-4 w-4 text-primary" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {title}
          </p>

          <p className="text-xs text-muted-foreground">
            {patient}
          </p>

          <p className="text-xs text-muted-foreground">
            {date} · {responsible}
          </p>
        </div>

        <span className="rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
          Pendente
        </span>
      </div>
    </button>
  );
}

function BirthdaysSection() {
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        <Cake className="h-5 w-5 text-primary" />
        Próximos Aniversariantes
      </h2>

      <div className="rounded-2xl border border-secondary bg-secondary/10 p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <Cake className="h-4 w-4" />
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium">
              Carlos Ferreira
            </p>

            <p className="text-xs text-muted-foreground">
              14/10 · 38 anos · em 12 dias
            </p>
          </div>

          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
            Paciente
          </span>
        </div>
      </div>
    </section>
  );
}