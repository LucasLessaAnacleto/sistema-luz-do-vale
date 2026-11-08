import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

interface Props {
  href: string;
  titulo: string;
  descricao: string;
  icon: LucideIcon;
}

export default function ConfiguracaoLink({ href, titulo, descricao, icon: Icon }: Props) {

  return (
    <Link href={href} className="flex items-center gap-4 rounded-xl p-4 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary">
      
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-medium">{titulo}</h3>

        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          {descricao}
        </p>
      </div>

      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true"/>
    </Link>
  );
}