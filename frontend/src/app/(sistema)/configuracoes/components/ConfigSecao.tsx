import { ReactNode } from "react";

interface Props {
  titulo: string;
  children: ReactNode;
}

export default function ConfiguracaoSecao({ titulo, children }: Props) {
    
  return (
    <section>
      <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {titulo}
      </h2>

      <div className="rounded-2xl border border-border bg-card p-2 shadow-sm sm:p-3">
        {children}
      </div>
    </section>
  );
}