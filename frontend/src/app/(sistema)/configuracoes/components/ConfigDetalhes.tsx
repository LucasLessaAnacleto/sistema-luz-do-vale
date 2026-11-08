import { ChevronRight, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  titulo: string;
  descricao: string;
  icon: LucideIcon;
  children: ReactNode;
}

export default function ConfigDetalhes({ titulo, descricao, icon: Icon, children }: Props) {

  return (
    <details className="group">

      <summary className="flex cursor-pointer list-none items-center gap-4 rounded-xl p-4 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">

        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium">
            {titulo}
          </h3>

          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {descricao}
          </p>
        </div>

        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" aria-hidden="true"/>

      </summary>

      <div className="mx-4 border-t border-border px-2 py-4">
        {children}
      </div>

    </details>
  );
}