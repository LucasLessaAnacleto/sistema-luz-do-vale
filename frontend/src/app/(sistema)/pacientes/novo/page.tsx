
"use client";

import { useActionState } from "react";

import { actionCadastrarPaciente } from "../actionCadastrarPaciente";
import FormularioPaciente from "../components/FormularioPaciente";

import BotaoVoltar from "@/app/components/ui/BotaoVoltar";
import CabecalhoPagina from "@/app/components/CabecalhoPagina";

const estadoInicial = {
    erro: "",
    valores: {},
};

export default function NovoPacientePage() {
    const [estado, action, pending] = useActionState(
        actionCadastrarPaciente,
        estadoInicial
    );

    return (
        <>
            <CabecalhoPagina>
                <div className="flex items-center gap-3">
                    <BotaoVoltar href="/pacientes" />

                    <div>
                        <h1 className="text-2xl font-semibold">
                            Ficha de Acolhimento
                        </h1>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Novo cadastro de paciente
                        </p>
                    </div>
                </div>
            </CabecalhoPagina>

            <FormularioPaciente
                action={action}
                valores={estado.valores}
                erro={estado.erro}
                loading={pending}
                modo="cadastro"
                cancelarHref="/pacientes"
            />
        </>
    );
}
