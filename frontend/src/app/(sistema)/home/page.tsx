"use client";

import { useAppSelector } from "@/app/redux/hook";

import QuadroAvisos from "../avisos/components/QuadroAvisos";

import IndicadoresGerais from "./components/IndicadoresGerais";
import IndicadorDocumentosMes from "./components/IndicadorDocumentoMes";
import DocumentosRecentes from "./components/DocumentosRecentes";
import ProximosAniversariantes from "./components/ProximosAniversariantes";


export default function HomePage() {
    const usuario = useAppSelector((state) => state.auth.usuario);

    return (
        <>
            <section className="border-b border-zinc-300 bg-zinc-200/60 text-zinc-900">
                <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-7">
                    <div className="mb-5">

                        <p className="mb-0.5 text-sm text-zinc-500">Olá,</p>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {usuario?.nome ?? ""}
                        </h1>

                    </div>

                    <IndicadoresGerais />
                    <IndicadorDocumentosMes />
                </div>
            </section>

            <div className="mx-auto max-w-6xl space-y-6 px-5 py-6 sm:px-8">
                <QuadroAvisos />

                <DocumentosRecentes />

                <ProximosAniversariantes />
            </div>
        </>
    );
}
