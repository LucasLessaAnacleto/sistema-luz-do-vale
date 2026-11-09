"use client";

import { useActionState } from "react";

import { actionCadastrarPaciente } from "../actionCadastrarPaciente";

import BotaoVoltar from "@/app/components/ui/BotaoVoltar";
import Button from "@/app/components/ui/Button";
import DadosPaciente from "../components/DadosPaciente";
import DadosResponsavel from "../components/DadosResponsavel";
import FichaAcolhimento from "../components/FichaAcolhimento";

const estadoInicial = {
    erro: "",
};

export default function FormularioPaciente() {

    const [estado, action, pending] = useActionState(actionCadastrarPaciente, estadoInicial);
    
    return (
        <>

            <section className="border-b border-border bg-card">

                <div className="mx-auto max-w-4xl px-5 py-6 sm:px-8">

                    <div className="flex items-center gap-3">

                        <BotaoVoltar href="/pacientes" />

                        <div>

                            <h1 className="text-2xl font-semibold">
                                Novo paciente
                            </h1>

                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Cadastro do paciente e ficha de acolhimento
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            <form action={action} className="mx-auto max-w-4xl space-y-5 px-5 py-6 sm:px-8">

                <DadosPaciente />
                <DadosResponsavel />
                <FichaAcolhimento />

                {estado.erro && (
                    <p className="text-sm text-red-600" role="alert">{estado.erro}</p>
                )}


                <div className="flex justify-center">

                    <Button type="submit" loading={pending} loadingText="Salvando..." className="w-full">
                        Cadastrar paciente
                    </Button>

                </div>

            </form>

        </>
    );
}