"use client";

import BotaoVoltar from "@/app/components/ui/BotaoVoltar";
import { useAppSelector } from "@/app/redux/hook";
import InformacoesPessoaisForm from "../components/InformacoesPessoaisForm";

export default function InformacoesPessoaisPage() {
    const usuario = useAppSelector((state) => state.auth.usuario);

    return (
        <>
            <section className="border-b border-border bg-card">
                <div className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-6 sm:px-8 sm:py-8">
                    <BotaoVoltar href="/configuracoes" />
                    <h1 className="text-2xl font-semibold">Informações Pessoais</h1>
                </div>
            </section>

            {usuario && (
                <div className="mx-auto max-w-3xl px-5 py-6 sm:px-8">
                    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
                        <InformacoesPessoaisForm key={usuario.id} usuario={usuario} />

                        <dl className="mt-4">
                            <dt className="text-xs text-muted-foreground">Perfil</dt>
                            <dd className="mt-1 text-sm">{usuario.perfil || <span className="text-muted-foreground">Não informado</span>}</dd>
                        </dl>
                    </section>
                </div>
            )}
        </>
    );
}
