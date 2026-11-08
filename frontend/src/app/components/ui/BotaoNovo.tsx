import Link from "next/link";
import { Plus } from "lucide-react";

interface Props { href: string; texto?: string; }

export default function BotaoNovo({ href, texto = "Novo"}: Props) {
  return (
    <Link
      href={href}
      className="
        flex min-h-10 items-center gap-1.5
        rounded-full bg-primary
        px-4 py-2
        text-sm font-medium text-white
        transition-colors
        hover:bg-primary-dark
      "
    >
      <Plus className="h-4 w-4" /> {texto}
    </Link>
  );
}