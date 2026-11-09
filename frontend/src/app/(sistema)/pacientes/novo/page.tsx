"use client";

import { useActionState } from "react";

import { actionCadastrarPaciente } from "../actionCadastrarPaciente";

import BotaoVoltar from "@/app/components/ui/BotaoVoltar";
import RodapeFormulario from "@/app/components/RodapeFormulario";

import DadosPaciente from "../components/DadosPaciente";
import DadosResponsavel from "../components/DadosResponsavel";
import FichaAcolhimento from "../components/FichaAcolhimento";
import CabecalhoPagina from "@/app/components/CabecalhoPagina";
import BotaoPreencherTeste from "../components/BotaoPreencherTeste";

const estadoInicial = {
    erro: "",
};

export default function FormularioPaciente() {

    const [estado, action, pending] = useActionState(actionCadastrarPaciente, estadoInicial);

    return (
        <>
            <CabecalhoPagina>

                <div className="flex items-center gap-3">
                    <BotaoVoltar href="/pacientes" />

                    <div>
                        <h1 className="text-2xl font-semibold">Ficha de Acolhimento</h1>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Novo cadastro de paciente
                        </p>
                    </div>
                </div>

            </CabecalhoPagina>


            <form action={action} className="mx-auto max-w-6xl space-y-8 px-5 pt-6 pb-32 sm:px-8">
                <div className="flex justify-end">
                    <BotaoPreencherTeste />
                </div>
                <DadosPaciente />
                <DadosResponsavel />
                <FichaAcolhimento />


                {estado.erro && (
                    <p className="text-sm text-red-600">{estado.erro}</p>
                )}


                <RodapeFormulario
                    cancelarHref="/pacientes"
                    loading={pending}
                    textoSalvar="Cadastrar paciente"
                />

            </form>

        </>
    );
}