import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import UsuarioForm from "../componentes/UsuarioForm";

export default function NovoUsuarioPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-6 sm:px-8">
      <Link
        href="/configuracoes/equipe"
        className="mb-5 inline-flex items-center gap-2 text-sm text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para equipe
      </Link>
      <h1 className="mb-6 text-2xl font-semibold">Novo usuário</h1>
      <UsuarioForm />
    </div>
  );
}
