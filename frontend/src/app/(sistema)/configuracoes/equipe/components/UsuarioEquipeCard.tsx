import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import type { Usuario } from "@/app/types/usuarios";
import AvatarIniciais from "@/app/components/ui/AvatarIniciais";

interface Props {
  usuario: Usuario;
}

export default function UsuarioEquipeCard({ usuario }: Props) {
  const isAdmin = usuario.role === "ROLE_ADMIN";
  const resolveNome = usuario?.nome || (isAdmin ? "Administrador" : "Minha conta");
  return (
    <Link
      href={`/configuracoes/equipe/${usuario.id}`}
      className="flex items-center gap-4 rounded-2xl border border-border
        bg-card p-5 shadow-sm transition-colors hover:border-primary/40
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >

      <AvatarIniciais nome={resolveNome} tamanho="md" />

      <div className="min-w-0 flex-1">

        <div className="flex items-center gap-1.5">

          <h2 className="truncate text-sm font-medium">
            {usuario.nome}
          </h2>

          {isAdmin && (
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          )}

        </div>

        <p className="mt-0.5 text-xs text-foreground">
          {usuario.perfil || (isAdmin ? "Administrador" : "Sem perfil")}
        </p>

        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {usuario.email}
        </p>

      </div>

      <div className="flex shrink-0 items-center gap-3">

        <span className={`rounded-full border px-3 py-1 text-xs font-medium
            ${
              usuario.ativo
                ? "border-primary/20 bg-primary/5 text-primary-dark"
                : "border-border bg-muted text-muted-foreground"
            }
          `}
        >
          {usuario.ativo ? "Ativo" : "Inativo"}
        </span>

        <ChevronRight className="h-5 w-5 text-muted-foreground" aria-hidden="true"/>

      </div>

    </Link>
  );
}