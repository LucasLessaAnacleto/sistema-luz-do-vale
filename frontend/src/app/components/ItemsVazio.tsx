import type { LucideIcon } from "lucide-react";

interface Props {
  titulo: string;
  descricao?: string;
  icon?: LucideIcon;
}

export default function ItemsVazio({ titulo, descricao, icon: Icon }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-secondary bg-card px-5 py-10 text-center">

      {Icon && (
        <Icon className="mb-3 h-7 w-7 text-primary" />
      )}

      <h2 className="text-base font-medium">
        {titulo}
      </h2>

      {descricao && (
        <p className="mt-1 text-sm text-muted-foreground">
          {descricao}
        </p>
      )}

    </div>
  );
}