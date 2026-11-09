import type { ReactNode } from "react";

interface Props {
    titulo: string;
    children: ReactNode;
}

export default function SecaoFormulario({ titulo, children }: Props) {

    return (
        <section className="space-y-4">

            <div className="rounded-r-2xl border-l-4 border-primary bg-primary/10 px-4 py-3">

                <h2 className="text-sm font-semibold uppercase tracking-wide text-primary-dark">
                    {titulo}
                </h2>

            </div>


            <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
                {children}
            </div>

        </section>
    );
}