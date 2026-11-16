"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";

import { actionCadastrarAviso } from "../actionCadastrarAviso";

import CabecalhoPagina from "@/app/components/CabecalhoPagina";
import BotaoVoltarHistorico from "@/app/components/ui/BotaoVoltarHistorico";
import RodapeFormulario from "@/app/components/RodapeFormulario";
import TextoLongo from "@/app/components/ui/TextoLongo";
import Input from "@/app/components/ui/Input";
import Card from "@/app/components/ui/Card";
import { CriarAvisoRequest } from "@/app/types/avisos";

const estadoInicial = {
    erro: "",
    sucesso: false,
    valores: {},
};

export default function NovoAvisoPage() {

    const router = useRouter();

    const [estado, action, pending] = useActionState(actionCadastrarAviso, estadoInicial);

    useEffect(() => {

        if(estado.sucesso){
            router.back();
        }

    }, [estado.sucesso, router]);

    return (
        <>
            <CabecalhoPagina largura="3xl">
                <div className="flex items-center gap-3">

                    <BotaoVoltarHistorico />
                    <div>
                        <h1 className="text-2xl font-semibold">Novo aviso</h1>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Publique um comunicado para a equipe.
                        </p>
                    </div>

                </div>
            </CabecalhoPagina>


            <form action={action} className="mx-auto max-w-3xl space-y-6 px-5 pt-6 pb-40 sm:px-8">

                <Card className="space-y-6">

                    <h2 className="text-base font-semibold">
                        Informações do aviso
                    </h2>

                    <TextoLongo
                        label="Mensagem *"
                        name="mensagem"
                        placeholder="Escreva a mensagem do aviso..."
                        defaultValue={(estado.valores as CriarAvisoRequest).mensagem ?? ""}
                        rows={6}
                        required
                    />

                    <div className="space-y-2">

                        <Input
                            label="Data de finalização (opcional)"
                            name="dtFinalizacao"
                            type="datetime-local"
                            defaultValue={(estado.valores as CriarAvisoRequest).dtFinalizacao ?? ""}
                        />

                        <div className="flex items-start gap-2 text-xs text-muted-foreground">

                            <Info className="h-4 w-4 shrink-0" />
                            <p>Se nenhuma data for informada, o aviso permanecerá ativo até ser desativado manualmente.</p>

                        </div>
                    </div>
                </Card>

                {estado.erro && (
                    <p role="alert" className="text-sm text-red-600">{estado.erro}</p>
                )}

                <RodapeFormulario loading={pending} textoSalvar="Publicar aviso"/>
            </form>
        </>
    );
}