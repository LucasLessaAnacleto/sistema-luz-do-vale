"use client";

import { useState } from "react";

import type { PerfilRequest } from "@/app/types/perfis";
import type { TipoDocumento } from "@/app/types/documentos";
import { CODIGO_TIPO_DOCUMENTO } from "@/app/types/documentos";

import Input from "@/app/components/ui/Input";
import Toggle from "@/app/components/ui/Toggle";
import Card from "@/app/components/ui/Card";
import RodapeFormulario from "@/app/components/RodapeFormulario";

interface Props {
    action: (form: FormData) => void;
    valores: PerfilRequest;
    tiposDocumento: TipoDocumento[];
    erro?: string;
    loading?: boolean;
    textoSalvar: string;
}

export default function PerfilForm({
    action,
    valores,
    tiposDocumento,
    erro,
    loading = false,
    textoSalvar
}: Props) {

    const documentos = tiposDocumento.filter((tipo) => tipo.id !== CODIGO_TIPO_DOCUMENTO.FICHA_ACOLHIMENTO);

    const [marcados, setMarcados] = useState<number[]>(valores.tiposDocumento);

    const todosMarcados = documentos.every((tipo) => marcados.includes(tipo.id));

    function alternarDocumento(id: number) {
        if (marcados.includes(id)) {
            setMarcados(marcados.filter((marcado) => marcado !== id));
        } else {
            setMarcados([...marcados, id]);
        }
    }

    function alternarTodos() {
        if (todosMarcados) {
            setMarcados([]);
        } else {
            setMarcados(documentos.map((tipo) => tipo.id));
        }
    }

    return (
        <form action={action} className="mx-auto max-w-5xl space-y-6 px-5 pt-6 pb-40 sm:px-8">

            <Card className="space-y-6">

                <h2 className="text-base font-semibold">
                    Dados do perfil
                </h2>

                <Input
                    label="Nome *"
                    name="nome"
                    placeholder="Ex.: Enfermagem"
                    defaultValue={valores.nome}
                    maxLength={255}
                    required
                />

            </Card>

            <Card className="space-y-4">

                <div>
                    <h2 className="text-base font-semibold">Permissões</h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Ative o que os profissionais deste perfil podem fazer.
                    </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <Toggle label="Cadastrar pacientes" name="permCadPaciente" defaultChecked={valores.permCadPaciente} />
                </div>

                <div className="flex items-center justify-between gap-4 pt-2">

                    <h3 className="text-sm font-semibold text-primary-dark">
                        Documentos permitidos
                    </h3>

                    {documentos.length > 0 && (
                        <button type="button" onClick={alternarTodos} className="cursor-pointer text-xs font-medium text-primary-dark hover:underline sm:text-sm">
                            {todosMarcados ? "Desmarcar todos" : "Selecionar todos"}
                        </button>
                    )}

                </div>

                {documentos.length ? (
                    <div className="grid gap-3 sm:grid-cols-2">

                        {documentos.map((tipo) => (
                            <Toggle
                                key={tipo.id}
                                label={tipo.nome}
                                name="tiposDocumento"
                                value={tipo.id}
                                checked={marcados.includes(tipo.id)}
                                onChange={() => alternarDocumento(tipo.id)}
                            />
                        ))}

                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">Nenhum tipo de documento cadastrado.</p>
                )}

            </Card>

            {erro && (
                <p role="alert" className="text-sm text-red-600">{erro}</p>
            )}

            <RodapeFormulario cancelarHref="/configuracoes/perfis" loading={loading} textoSalvar={textoSalvar} />
        </form>
    );
}
