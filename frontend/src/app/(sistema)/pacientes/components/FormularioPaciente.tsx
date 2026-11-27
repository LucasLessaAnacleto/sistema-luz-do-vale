
"use client";

import { useEffect, useState, type ReactNode } from "react";

import DadosPaciente from "./DadosPaciente";
import DadosResponsavel from "./DadosResponsavel";
import FichaAcolhimento from "./FichaAcolhimento";

import RodapeFormulario from "@/app/components/RodapeFormulario";
import ModalErro from "@/app/components/ModalErro";
import BotaoPreencherTeste from "./BotaoPreencherTeste";

interface Props {
    action: (form: FormData) => void;
    valores?: Record<string, string>;
    erro?: string;
    loading?: boolean;
    modo: "cadastro" | "edicao";
    cancelarHref?: string;
    children?: ReactNode;
    dentroDoLayout?: boolean;
}

export default function FormularioPaciente({
    action,
    valores = {},
    erro,
    loading = false,
    modo,
    cancelarHref,
    children,
    dentroDoLayout
}: Props) {

    const [modalErroAberto, setModalErroAberto] = useState(false);

    useEffect(() => {
        if (!loading && erro) {
            setModalErroAberto(true);
        }
    }, [loading, erro]);

    return (
        <form action={action} className={dentroDoLayout ? "space-y-8 pb-32" : "mx-auto max-w-6xl space-y-8 px-5 pt-6 pb-32 sm:px-8"}>
            {modo === "cadastro" && (
                <div className="flex justify-end">
                    <BotaoPreencherTeste />
                </div>
            )}

            <DadosPaciente valores={valores} />
            <DadosResponsavel valores={valores} />
            <FichaAcolhimento valores={valores} />

            {children}

            {erro && (
                <p className="text-sm text-red-600">{erro}</p>
            )}

            <ModalErro aberto={modalErroAberto} mensagem={erro} onFechar={() => setModalErroAberto(false)} />

            <RodapeFormulario cancelarHref={cancelarHref} loading={loading} 
                textoSalvar={ modo === "cadastro" ? "Cadastrar paciente" : "Salvar alterações"}
            />
        </form>
    );
}
