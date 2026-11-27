"use client";

import { useActionState } from "react";

import { actionCadastrarUsuario } from "../actionCadastrarUsuario";
import UsuarioForm from "../components/UsuarioForm";

import BotaoVoltar from "@/app/components/ui/BotaoVoltar";
import CabecalhoPagina from "@/app/components/CabecalhoPagina";

const estadoInicial = {
    erro: "",
    valores: {},
};

export default function NovoMembroPage() {
    const [estado, action, pending] = useActionState(
        actionCadastrarUsuario,
        estadoInicial
    );

    return (
        <>
            <CabecalhoPagina>
                <div className="flex items-center gap-3">
                    <BotaoVoltar href="/configuracoes/equipe" />

                    <div>
                        <h1 className="text-2xl font-semibold">
                            Novo membro
                        </h1>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Cadastro do profissional e da conta de acesso
                        </p>
                    </div>
                </div>
            </CabecalhoPagina>

            <UsuarioForm
                action={action}
                valores={estado.valores}
                erro={estado.erro}
                loading={pending}
                modo="cadastro"
                cancelarHref="/configuracoes/equipe"
            />
        </>
    );
}
