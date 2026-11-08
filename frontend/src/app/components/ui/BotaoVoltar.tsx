import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props { href: string; }

export default function BotaoVoltar({ href }: Props) {
  return (
    <Link
      href={href}
      className="
        flex h-10 w-10 shrink-0
        items-center justify-center
        rounded-full bg-secondary
        transition-colors
        hover:bg-secondary/80
      "
    >
      <ArrowLeft className="h-5 w-5" />
    </Link>
  );
}