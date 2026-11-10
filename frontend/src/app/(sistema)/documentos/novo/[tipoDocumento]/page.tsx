"use client";

import { use, useActionState, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import type {
    CampoDocumento,
    FormularioDocumento
} from "@/app/types/documentos";

import { buscarFormularioDocumento } from "@/app/services/tipoDocumentoService";

import {
    actionCadastrarDocumento
} from "./actionCadastrarDocumento";

import BotaoVoltar from "@/app/components/ui/BotaoVoltar";
import CabecalhoPagina from "@/app/components/CabecalhoPagina";
import Input from "@/app/components/ui/Input";
import Selecao from "@/app/components/ui/Selecao";
import TextoLongo from "@/app/components/ui/TextoLongo";
import RodapeFormulario from "@/app/components/RodapeFormulario";
import CarregandoConteudo from "@/app/components/CarregandoConteudo";
import ErroCarregamento from "@/app/components/ErroCarregamento";
import { Paciente } from "@/app/types/pacientes";
import { buscarListaPacientes } from "@/app/services/pacienteService";

const estadoInicial = {
    erro: "",
    documentoId: null,
    valores: {},
};


export default function NovoDocumentoFormularioPage() {

    const params = useParams<{ tipoDocumento: string }>();
    const tipoDocumento = params.tipoDocumento;

    const router = useRouter();
    const searchParams = useSearchParams();

    const pacienteIdUrl = searchParams.get("paciente");

    const [pacienteId, setPacienteId] = useState(pacienteIdUrl || "");
    const [pacientes, setPacientes] = useState<Paciente[]>([]);

    const [formulario, setFormulario] = useState<FormularioDocumento | null>(null);

    const [estado, action, pending] = useActionState(
        actionCadastrarDocumento,
        estadoInicial
    );

    useEffect(() => {
        carregarFormulario();
    }, [tipoDocumento, pacienteId]);


    useEffect(() => {

        if (estado.documentoId) {
            router.replace(`/documentos/${estado.documentoId}?pacienteId=${pacienteId}`);
        }

    }, [estado.documentoId]);

    useEffect(() => {
        if (!pacienteIdUrl) {
            carregarPacientes();
        }
    }, []);


    async function carregarFormulario() {
        if (!pacienteId) {
            return;
        }

        try {
            setFormulario(null);

            const dados = await buscarFormularioDocumento(Number(tipoDocumento), Number(pacienteId));
            setFormulario(dados);

        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        }
    }

    async function carregarPacientes() {
        try {
            const dados = await buscarListaPacientes(true);
            setPacientes(dados);
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
        }
    }


    function renderizarCampo(campo: CampoDocumento) {

        const largura = campo.largura === 12
            ? "sm:col-span-2"
            : "sm:col-span-1";

        const valor = estado.valores[campo.nome] ?? String(formulario?.dadosPadrao[campo.nome] ?? "");


        if (campo.tipo === "TEXTO_LONGO") {

            return (
                <div key={campo.nome} className={largura}>

                    <TextoLongo
                        label={campo.rotulo}
                        name={campo.nome}
                        defaultValue={valor}
                        rows={12}
                        required={campo.obrigatorio}
                        readOnly={campo.somenteLeitura}
                    />

                </div>
            );
        }


        if (campo.tipo === "DATA") {

            return (
                <div key={campo.nome} className={largura}>

                    <Input
                        label={campo.rotulo}
                        name={campo.nome}
                        type="date"
                        defaultValue={valor}
                        required={campo.obrigatorio}
                        readOnly={campo.somenteLeitura}
                    />

                </div>
            );
        }


        if (campo.tipo === "HORA") {

            return (
                <div key={campo.nome} className={largura}>

                    <Input
                        label={campo.rotulo}
                        name={campo.nome}
                        type="time"
                        defaultValue={valor}
                        required={campo.obrigatorio}
                        readOnly={campo.somenteLeitura}
                    />

                </div>
            );
        }


        return (
            <div key={campo.nome} className={largura}>

                <Input
                    label={campo.rotulo}
                    name={campo.nome}
                    defaultValue={valor}
                    required={campo.obrigatorio}
                    readOnly={campo.somenteLeitura}
                />

            </div>
        );
    }


    const voltarHref = pacienteId
        ? `/documentos/novo?paciente=${pacienteId}`
        : "/documentos";


    if (!formulario) {

        return (
            <CarregandoConteudo mensagem="Carregando formulário..." />
        );
    }


    return (
        <>

            <CabecalhoPagina>

                {!pacienteIdUrl && (
                    <div className="mx-auto max-w-3xl px-5 pt-6 sm:px-8">
                        <Selecao label="Paciente" value={pacienteId} onChange={(event) => setPacienteId(event.target.value) }>

                            <option value="">Selecione o paciente</option>
                            {pacientes.map((paciente) => (

                                <option key={paciente.id} value={paciente.id}>
                                    {paciente.nome}
                                    {paciente.apelido ? ` (${paciente.apelido})` : ""}
                                </option>

                            ))}

                        </Selecao>
                    </div>
                )}

                <div className="flex items-center gap-3">

                    <BotaoVoltar href={voltarHref} />

                    <div>

                        <h1 className="text-2xl font-semibold">
                            {formulario.nome}
                        </h1>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {formulario.descricao}
                        </p>

                    </div>

                </div>

            </CabecalhoPagina>

            {!pacienteId ? (
                <p className="mx-auto max-w-3xl px-5 py-8 text-center text-sm text-muted-foreground sm:px-8">
                    Selecione um paciente para preencher o documento.
                </p>
            ) : !formulario ? (
                <CarregandoConteudo mensagem="Carregando formulário..." />
            ) : (
                <form action={action} className="mx-auto max-w-3xl space-y-6 px-5 pt-6 pb-32 sm:px-8">

                    <input type="hidden" name="tipoDocumentoVersaoId" value={formulario.versaoId}/>

                    <input type="hidden" name="pacienteId" value={pacienteId}/>


                    <div className="grid gap-4 sm:grid-cols-2">

                        {formulario.campos.map((campo) =>
                            renderizarCampo(campo)
                        )}

                    </div>


                    {estado.erro && (
                        <ErroCarregamento mensagem={estado.erro} />
                    )}


                    <RodapeFormulario
                        cancelarHref={voltarHref}
                        loading={pending}
                        textoSalvar="Salvar documento"
                    />

                </form>
            )}
        </>
    );
}