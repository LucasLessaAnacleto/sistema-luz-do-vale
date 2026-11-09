import Link from "next/link";

import Button from "./ui/Button";

interface Props {
    cancelarHref: string;
    loading?: boolean;
    textoSalvar?: string;
}

export default function RodapeFormulario({ cancelarHref, loading = false, textoSalvar = "Salvar" }: Props) {

    return (
        <div className="fixed right-0 bottom-20 left-0 z-30 border-t border-border bg-card px-5 py-3 sm:px-8">

            <div className="grid gap-3 sm:grid-cols-2">

                <Link href={cancelarHref} className="flex min-h-12 items-center justify-center rounded-xl 
                    border border-border bg-card px-6 text-sm font-medium transition-colors hover:bg-accent"
                >
                    Cancelar
                </Link>

                <Button type="submit" loading={loading} loadingText="Salvando..." className="w-full">
                    {textoSalvar}
                </Button>

            </div>

        </div>
    );
}