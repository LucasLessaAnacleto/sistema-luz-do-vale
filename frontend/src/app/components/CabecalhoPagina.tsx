import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
    largura?: "3xl" | "4xl" | "6xl";
}

export default function CabecalhoPagina({ children, largura = "6xl" }: Props) {

    const larguras = {
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "6xl": "max-w-6xl",
    };

    return (
        <section className="border-b border-border bg-card">

            <div className={`mx-auto ${larguras[largura]} px-5 py-6 sm:px-8`}>
                {children}
            </div>

        </section>
    );
}