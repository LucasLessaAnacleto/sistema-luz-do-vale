import Link from "next/link";
import { Calendar, UserRound, Archive } from "lucide-react";

import { Aviso } from "@/app/types/avisos";
import { formatarData } from "@/app/util";
import BadgeStatus from "@/app/components/ui/BudgeStatus";

interface Props {
    aviso: Aviso;
}

export default function CardAviso({ aviso }: Props) {

    return (
        <Link href={`/avisos/${aviso.id}`}
            className={`block rounded-2xl border border-border border-l-4 shadow-sm transition-colors hover:border-primary/40 sm:p-5
                ${aviso.ativo ? "border-l-amber-500 bg-[#f8f5eb]" : "border-l-muted-foreground/40 bg-secondary/10"}
            `}
        >
            <p className="min-w-0 whitespace-pre-wrap break-words text-base leading-relaxed">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    {aviso.mensagem}

                    {!aviso.ativo && (<BadgeStatus texto="Desativado" tipo="neutro"/>)}
                </div>
            </p>

            <div className="mt-5 space-y-2 text-xs text-muted-foreground">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5">
                        <UserRound className="h-3.5 w-3.5" />
                        {aviso.criadoPor}
                    </span>

                    <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatarData(aviso.dtCriacao)}
                    </span>
                </div>

            </div>

        </Link>
    );
}