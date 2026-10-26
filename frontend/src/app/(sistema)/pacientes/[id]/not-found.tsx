import Link from "next/link";
import { UserRound } from "lucide-react";

export default function PatientNotFound() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 text-center sm:px-8">
      <UserRound className="mx-auto mb-4 h-10 w-10 text-primary" aria-hidden="true" />
      <h1 className="text-xl font-semibold">Paciente não encontrado</h1>
      <p className="mt-2 text-sm text-muted-foreground">Este paciente não está disponível na demonstração.</p>
      <Link href="/pacientes" className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Voltar para pacientes</Link>
    </div>
  );
}
