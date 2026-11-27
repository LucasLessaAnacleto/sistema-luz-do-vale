"use client";

import { useActionState, useEffect, useState } from "react";

import type { PerfilRequest } from "@/app/types/perfis";
import type { TipoDocumento } from "@/app/types/documentos";
import { listarTiposDocumento } from "@/app/services/tipoDocumentoService";

import { actionCadastrarPerfil } from "../actionCadastrarPerfil";

import PerfilForm from "../components/PerfilForm";
import CabecalhoPagina from "@/app/components/CabecalhoPagina";
import BotaoVoltar from "@/app/components/ui/BotaoVoltar";
import { mensagemErro } from "@/app/util";

const valoresIniciais: PerfilRequest = {
    nome: "",
    permCadPaciente: false,
    tiposDocumento: [],
};

const estadoInicial = {
    erro: "",
    valores: valoresIniciais,
};

export default function NovoPerfilPage() {

    const [estado, action, pending] = useActionState(actionCadastrarPerfil, estadoInicial);

    const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);

    const [erroTipos, setErroTipos] = useState("");

    useEffect(() => {
        carregarTiposDocumento();
    }, []);

    async function carregarTiposDocumento() {
        try {
            setErroTipos("");

            const lista = await listarTiposDocumento();
            setTiposDocumento(lista);
        } catch (error) {
            setErroTipos(mensagemErro(error, "Erro ao carregar os tipos de documento."));
        }
    }

    return (
        <>
            <CabecalhoPagina largura="5xl">
                <div className="flex items-center gap-3">

                    <BotaoVoltar href="/configuracoes/perfis" />
                    <div>
                        <h1 className="text-2xl font-semibold">Novo perfil</h1>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Defina o nome e as permissões do perfil
                        </p>
                    </div>

                </div>
            </CabecalhoPagina>

            <PerfilForm
                action={action}
                valores={estado.valores}
                tiposDocumento={tiposDocumento}
                erroTipos={erroTipos}
                onRetryTipos={carregarTiposDocumento}
                erro={estado.erro}
                loading={pending}
                textoSalvar="Cadastrar perfil"
            />
        </>
    );
}
