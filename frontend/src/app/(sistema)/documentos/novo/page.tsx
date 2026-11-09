"use client";

import { useEffect, useState } from "react";
import { FileText, Search } from "lucide-react";

import type { TipoDocumento } from "@/app/types/documentos";
import { listarTiposDocumento } from "@/app/services/tipoDocumentoService";

import BotaoVoltar from "@/app/components/ui/BotaoVoltar";
import Card from "@/app/components/ui/Card";
import ItemsVazio from "@/app/components/ItemsVazio";


export default function NovoDocumentoPage() {

    const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
    const [carregando, setCarregando] = useState(true);

    async function carregarTiposDocumento() {
        try {
            const dados = await listarTiposDocumento();
            setTiposDocumento(dados);

        } catch (error) {

            if (error instanceof Error) {
                alert(error.message);
            }

        } finally {
            setCarregando(false);
        }
    }


    useEffect(() => {
        carregarTiposDocumento();
    }, []);


    return (
        <>

            <section className="border-b border-border bg-card">

                <div className="mx-auto max-w-3xl px-5 py-6 sm:px-8">

                <div className="flex items-center gap-3">

                    <BotaoVoltar href="/documentos" />

                    <div>
                        <h1 className="text-2xl font-semibold">
                            Novo documento
                        </h1>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Selecione o tipo de documento
                        </p>
                    </div>

                </div>

                </div>

            </section>


            <section className="mx-auto max-w-3xl space-y-3 px-5 py-6 sm:px-8">

                {carregando ? (
                    <p className="py-10 text-center text-sm text-muted-foreground">Carregando tipos de documento...</p>
                ) : tiposDocumento.length ? (

                    tiposDocumento.map((tipo) => (

                        <Card key={tipo.id} className="flex items-center gap-4">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">

                                <FileText className="h-5 w-5" />

                            </span>


                            <div className="min-w-0 flex-1">

                                <h2 className="text-sm font-medium">{tipo.nome}</h2>

                                <p className="mt-0.5 text-xs text-muted-foreground">{tipo.descricao}</p>


                                {tipo.exigeAssinatura && (

                                    <p className="mt-1 text-xs text-warning">
                                        Exige assinatura
                                    </p>

                                )}

                            </div>
                        </Card>

                    ))

                ) : (
                    <ItemsVazio
                        titulo="Nenhum documento disponível"
                        descricao="Seu perfil não possui permissão para criar documentos."
                        icon={Search}
                    />
                )}

            </section>

        </>
    );
}