"use client"
import Link from "next/link";
import Button from "./ui/Button";
import { useRouter } from "next/navigation";

interface Props {
    cancelarHref?: string;
    loading?: boolean;
    textoSalvar?: string;
}

export default function RodapeFormulario({ cancelarHref, loading = false, textoSalvar = "Salvar" }: Props) {
    const estiloBotaoCancelar = `flex min-h-12 items-center justify-center rounded-xl border border-border 
    bg-card px-6 text-sm font-medium transition-colors hover:bg-accent cursor-pointer`;

    const router = useRouter();

    return (
        <div className="fixed right-0 bottom-20 left-0 z-30 border-t border-border bg-card px-5 py-3 sm:px-8">

            <div className="grid gap-3 sm:grid-cols-2">

                {cancelarHref ? (
                    <Link href={cancelarHref} className={estiloBotaoCancelar}>
                        Cancelar
                    </Link>
                ) : (
                    <button type="button" className={estiloBotaoCancelar} onClick={() => router.back()}>
                        Cancelar
                    </button>
                )}

                <Button type="submit" loading={loading} loadingText="Salvando..." className="w-full">
                    {textoSalvar}
                </Button>

            </div>

        </div>
    );
}