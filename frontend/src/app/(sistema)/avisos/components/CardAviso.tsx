import Link from "next/link";
import { Aviso } from "@/app/types/avisos";

interface Props {
    aviso: Aviso;
    exibirStatus?: boolean;
}

export default function CardAviso({ aviso, exibirStatus = false }: Props) {

    return (
        <Link href={`/avisos/${aviso.id}`} 
            className="block rounded-2xl border border-border border-l-4 border-l-amber-500 bg-[#f8f5eb] p-4 shadow-sm transition-colorshover:border-primary/40"
        >
            <div className="flex items-start justify-between gap-3">

                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words min-w-0">{aviso.mensagem}</p>

                {exibirStatus && (
                    <span className="shrink-0 text-xs font-medium">{aviso.ativo ? "Ativo" : "Desativado"}</span>
                )}

            </div>
            <p className="mt-1 text-xs text-muted-foreground">Por {aviso.criadoPor}</p>
        </Link>
    );
}