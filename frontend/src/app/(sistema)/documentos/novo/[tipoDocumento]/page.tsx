"use client";

import { useActionState, useEffect, useState } from "react";
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
import BotaoVoltarHistorico from "@/app/components/ui/BotaoVoltarHistorico";
import { buscarDocumento } from "@/app/services/documentoService";

const estadoInicial = {
    erro: "",
    documentoId: null,
    valores: {},
};


function formatarTelefoneEmpresa(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (!numeros) return "";
    if (numeros.length <= 2) return `(${numeros}`;

    const ddd = numeros.slice(0, 2);
    const primeiroDigito = numeros[2];

    if (numeros.length <= 3) return `(${ddd}) ${primeiroDigito}`;

    const primeiraParte = numeros.slice(3, 7);

    if (numeros.length <= 7) return `(${ddd}) ${primeiroDigito} ${primeiraParte}`;

    return `(${ddd}) ${primeiroDigito} ${primeiraParte}-${numeros.slice(7)}`;
}

export default function NovoDocumentoFormularioPage() {

    const params = useParams<{ tipoDocumento: string }>();
    const tipoDocumento = params.tipoDocumento;

    const router = useRouter();
    const searchParams = useSearchParams();

    const pacienteIdUrl = searchParams.get("paciente") ?? "";
    const documentoOrigemId = searchParams.get("origem");

    const [pacienteId, setPacienteId] = useState(pacienteIdUrl);
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [dadosOrigem, setDadosOrigem] = useState<Record<string, unknown> | null>(null);

    const [formulario, setFormulario] = useState<FormularioDocumento | null>(null);

    const [estado, action, pending] = useActionState(
        actionCadastrarDocumento,
        estadoInicial
    );

    useEffect(() => {
        carregarFormulario();
    }, [tipoDocumento, pacienteId, documentoOrigemId]);


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
            setDadosOrigem(null);

            const dados = await buscarFormularioDocumento(Number(tipoDocumento), Number(pacienteId));

            if (documentoOrigemId) {
                const origem = await buscarDocumento(Number(documentoOrigemId));

                if ( origem.pacienteId !== Number(pacienteId) || origem.tipoDocumentoId !== Number(tipoDocumento)) {
                    throw new Error("O documento de origem não corresponde ao paciente ou tipo selecionado.");
                }

                setDadosOrigem({
                    ...origem.dados,
                    observacao: origem.observacao
                });
            }

            setFormulario(dados);
        } catch (error) {
            alert( error instanceof Error ? error.message : "Erro ao carregar formulário.");
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
        const largura = campo.largura === 12 ? "sm:col-span-2" : "sm:col-span-1";
        const valor = estado.valores[campo.nome] ?? dadosOrigem?.[campo.nome] ?? formulario?.dadosPadrao[campo.nome] ?? "";

        if (campo.nome === "telefoneEmpresa") {
            return (
                <div key={campo.nome} className={largura}>
                    <Input
                        label={campo.rotulo}
                        name={campo.nome}
                        type="tel"
                        placeholder="(00) 0 0000-0000"
                        pattern={"\\([0-9]{2}\\) [0-9] [0-9]{4}-[0-9]{4}"}
                        title="Digite o telefone no formato (00) 0 0000-0000"
                        defaultValue={formatarTelefoneEmpresa(String(valor))}
                        required={campo.obrigatorio}
                        readOnly={campo.somenteLeitura}
                        onChange={(event) => {
                            event.currentTarget.value = formatarTelefoneEmpresa(event.currentTarget.value);
                        }}
                    />
                </div>
            );
        }

        if (campo.tipo === "TEXTO_LONGO") {
            return (
                <div key={campo.nome} className={largura}>

                    <TextoLongo
                        label={campo.rotulo}
                        descricao={campo.descricao}
                        name={campo.nome}
                        defaultValue={String(valor)}
                        rows={12}
                        required={campo.obrigatorio}
                        readOnly={campo.somenteLeitura}
                    />

                </div>
            );
        }

        if (campo.tipo === "BOOLEANO") {

            return (
                <div key={campo.nome} className={largura}>
                    {campo.descricao && (
                        <p className="mb-2 text-sm text-muted-foreground">{campo.descricao}</p>
                    )}

                    <Selecao
                        label={campo.rotulo}
                        name={campo.nome}
                        defaultValue={String(valor)}
                        required={campo.obrigatorio}
                    >
                        <option value="">Selecione</option>
                        <option value="true">Sim</option>
                        <option value="false">Não</option>
                    </Selecao>
                </div>
            );
        }

        if (campo.tipo === "SELECAO" && campo.opcoes?.length) {

            return (
                <div key={campo.nome} className={largura}>
                    <Selecao
                        label={campo.rotulo}
                        name={campo.nome}
                        defaultValue={String(valor)}
                        required={campo.obrigatorio}
                    >
                        <option value="">Selecione</option>
                        {campo.opcoes.map((opcao) => (
                            <option key={opcao} value={opcao}>{opcao}</option>
                        ))}
                    </Selecao>
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
                        defaultValue={String(valor)}
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
                        defaultValue={String(valor)}
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
                    defaultValue={String(valor)}
                    required={campo.obrigatorio}
                    readOnly={campo.somenteLeitura}
                />

            </div>
        );
    }

    return (
        <>
            <CabecalhoPagina>
                <div className="flex items-center gap-3">
                    <BotaoVoltarHistorico />

                    <div>
                        <h1 className="text-2xl font-semibold">
                            {formulario?.nome || "Novo documento"}
                        </h1>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {formulario?.descricao || "Selecione o paciente"}
                        </p>

                        {documentoOrigemId && (
                            <p className="mt-2 text-sm text-primary-dark">
                                Criando com base no documento #{documentoOrigemId}
                            </p>
                        )}

                    </div>

                </div>

            </CabecalhoPagina>

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

            {!pacienteId ? (
                <p className="mx-auto max-w-3xl px-5 py-8 text-center text-sm text-muted-foreground sm:px-8">
                    Selecione um paciente para preencher o documento.
                </p>
            ) : !formulario ? (
                <CarregandoConteudo mensagem="Carregando formulário..." />
            ) : (
                <form action={action} className="mx-auto max-w-6xl space-y-6 px-5 pt-6 pb-32 sm:px-8">

                    <input type="hidden" name="tipoDocumentoVersaoId" value={formulario.versaoId}/>

                    <input type="hidden" name="pacienteId" value={pacienteId}/>

                    {documentoOrigemId && (<input type="hidden" name="documentoOrigemId" value={documentoOrigemId} />)}


                    <div className="grid gap-4 sm:grid-cols-2">
                        {formulario.campos.map((campo) =>
                            renderizarCampo(campo)
                        )}
                    </div>


                    {estado.erro && (
                        <ErroCarregamento mensagem={estado.erro} />
                    )}


                    <RodapeFormulario
                        loading={pending}
                        textoSalvar="Salvar documento"
                    />

                </form>
            )}
        </>
    );
}