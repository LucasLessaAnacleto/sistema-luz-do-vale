"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { buscarPaciente, editarPaciente } from "@/app/services/pacienteService";

import { converterPacienteFormulario } from "../../converterPacienteFormulario";
import { montarPacienteRequest } from "../../montarPacienteRequest";

import FormularioPaciente from "../../components/FormularioPaciente";
import CarregandoConteudo from "@/app/components/CarregandoConteudo";
import ErroCarregamento from "@/app/components/ErroCarregamento";
import CabecalhoPagina from "@/app/components/CabecalhoPagina";
import BotaoVoltarHistorico from "@/app/components/ui/BotaoVoltarHistorico";
import { mensagemErro } from "@/app/util";

export default function EditarPacientePage() {
    const { id } = useParams<{ id: string }>();
    const pacienteId = Number(id);
    const router = useRouter();

    const [valores, setValores] = useState<Record<string, string> | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregar() {
            try {
                setCarregando(true);
                setErro("");

                const paciente = await buscarPaciente(pacienteId);

                setValores(converterPacienteFormulario(paciente));

            } catch (error) {
                setErro(mensagemErro(error, "Erro ao carregar paciente."));
            } finally {
                setCarregando(false);
            }
        }

        if (Number.isInteger(pacienteId) && pacienteId > 0) {
            carregar();
        }else {
            setErro("Identificador do paciente inválido.");
            setCarregando(false);
        }
    }, [pacienteId]);

    async function salvar(form: FormData) {
        try {
            setSalvando(true);
            setErro("");

            const dados = montarPacienteRequest(form);

            await editarPaciente(pacienteId, dados);

            router.back();

        } catch (error) {
            setErro(mensagemErro(error, "Erro ao editar paciente."));
        } finally {
            setSalvando(false);
        }
    }

    return (
        <>
            <CabecalhoPagina>
                <div className="flex items-center gap-3">
                    <BotaoVoltarHistorico />

                    <div>
                        <h1 className="text-2xl font-semibold">
                            Editar paciente
                        </h1>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Atualize os dados do acolhido, responsável e ficha de acolhimento
                        </p>
                    </div>
                </div>
            </CabecalhoPagina>

            {carregando ? (
                <CarregandoConteudo mensagem="Carregando dados do paciente..." />

            ) : !valores ? (
                <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
                    <ErroCarregamento mensagem={erro || "Não foi possível carregar o paciente."} />
                </div>

            ) : (
                <FormularioPaciente
                    action={salvar}
                    valores={valores}
                    erro={erro}
                    loading={salvando}
                    modo="edicao"
                />
            )}
        </>
    );
}