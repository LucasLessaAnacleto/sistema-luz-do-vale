import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import type { Perfil } from "@/app/types/perfis";
import BudgeStatus from "@/app/components/ui/BudgeStatus";

interface Props {
    perfil: Perfil;
}

export default function PerfilCard({ perfil }: Props) {
    const qtdDocumentos = perfil.tiposDocumento.length;

    return (
        <Link
            href={`/configuracoes/perfis/${perfil.id}`}
            className="flex items-center gap-4 rounded-2xl border border-border
                bg-card p-5 shadow-sm transition-colors hover:border-primary/40
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >

            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>

            <div className="min-w-0 flex-1">

                <h2 className="truncate text-sm font-medium">
                    {perfil.nome}
                </h2>

                <p className="mt-0.5 text-xs text-muted-foreground">
                    {qtdDocumentos} {qtdDocumentos === 1 ? "documento permitido" : "documentos permitidos"}
                </p>

            </div>

            <div className="flex shrink-0 items-center gap-3">

                {perfil.permCadPaciente && (
                    <BudgeStatus texto="Cadastra pacientes" tipo="sucesso" />
                )}

                <ChevronRight className="h-5 w-5 text-muted-foreground" aria-hidden="true"/>

            </div>

        </Link>
    );
}
