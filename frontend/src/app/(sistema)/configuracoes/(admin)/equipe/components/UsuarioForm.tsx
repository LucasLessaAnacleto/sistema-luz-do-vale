"use client";

import { useEffect, useState } from "react";

import type { Perfil } from "@/app/types/perfis";
import { listarPerfis } from "@/app/services/perfilService";

import Input from "@/app/components/ui/Input";
import Selecao from "@/app/components/ui/Selecao";
import SecaoFormulario from "@/app/components/SecaoFormulario";
import RodapeFormulario from "@/app/components/RodapeFormulario";

interface Props {
    action: (form: FormData) => void;
    valores?: Record<string, string>;
    erro?: string;
    loading?: boolean;
    modo: "cadastro" | "edicao";
    cancelarHref?: string;
    semProfissional?: boolean;
}

export default function UsuarioForm({
    action,
    valores = {},
    erro,
    loading = false,
    modo,
    cancelarHref,
    semProfissional = false
}: Props) {

    const [perfis, setPerfis] = useState<Perfil[]>([]);

    useEffect(() => {

        async function carregarPerfis() {

            try {

                const lista = await listarPerfis();
                setPerfis(lista);

            } catch (error) {

                if (error instanceof Error) {
                    alert(error.message);
                }

            }
        }

        carregarPerfis();

    }, []);

    return (
        <form action={action} className="mx-auto max-w-6xl space-y-8 px-5 pt-6 pb-32 sm:px-8">

            <SecaoFormulario titulo="Dados pessoais">

                {semProfissional && (
                    <p className="text-sm text-muted-foreground sm:col-span-2">
                        Este usuário não possui profissional vinculado, só os dados de acesso podem ser alterados.
                    </p>
                )}

                <div className="sm:col-span-2">
                    <Input label="Nome completo" name="nome" placeholder="Nome completo" defaultValue={valores.nome} required disabled={semProfissional} />
                </div>

                <Input label="CPF" name="cpf" placeholder="000.000.000-00" defaultValue={valores.cpf} required disabled={semProfissional} />
                <Input label="Data de nascimento" name="dtNasc" type="date" defaultValue={valores.dtNasc} required disabled={semProfissional} />

                <Input label="Telefone" name="telefone" placeholder="Telefone" defaultValue={valores.telefone} disabled={semProfissional} />
                <Input label="Registro profissional" name="regProfissional" placeholder="Ex.: COREN-12345" defaultValue={valores.regProfissional} disabled={semProfissional} />

                <div className="sm:col-span-2 pt-2">

                    <h3 className="text-sm font-semibold text-primary-dark">
                        Endereço
                    </h3>

                </div>

                <Input label="Rua" name="rua" placeholder="Rua" defaultValue={valores.rua} disabled={semProfissional} />
                <Input label="Número" name="numero" placeholder="Número" defaultValue={valores.numero} disabled={semProfissional} />

                <Input label="Bairro" name="bairro" placeholder="Bairro" defaultValue={valores.bairro} disabled={semProfissional} />
                <Input label="Município" name="municipio" placeholder="Município" defaultValue={valores.municipio} disabled={semProfissional} />

                <div className="sm:col-span-2">
                    <Input label="Estado" name="estado" placeholder="Estado" defaultValue={valores.estado} disabled={semProfissional} />
                </div>

            </SecaoFormulario>

            <SecaoFormulario titulo="Conta e acesso">

                <div className="sm:col-span-2">
                    <Input label="E-mail" name="email" type="email" placeholder="email@exemplo.com" defaultValue={valores.email} required maxLength={255} />
                </div>

                {modo === "cadastro" && (
                    <div className="sm:col-span-2">
                        <Input label="Senha" name="senha" type="password" defaultValue={valores.senha} required />

                        <p className="mt-2 text-xs text-muted-foreground">
                            Mínimo de 8 caracteres, com letra maiúscula,
                            minúscula, número e caractere especial.
                        </p>
                    </div>
                )}

                <Selecao label="Função" name="role" defaultValue={valores.role || "ROLE_USER"}>

                    <option value="ROLE_USER">Funcionário</option>
                    <option value="ROLE_ADMIN">Administrador</option>

                </Selecao>

                <Selecao key={perfis.length} label="Perfil" name="perfilId" defaultValue={valores.perfilId || ""}>

                    <option value="">Sem perfil</option>

                    {perfis.map((perfil) => (
                        <option key={perfil.id} value={perfil.id}>
                            {perfil.nome}
                        </option>
                    ))}

                </Selecao>

            </SecaoFormulario>

            {erro && (
                <p className="text-sm text-red-600">{erro}</p>
            )}

            <RodapeFormulario cancelarHref={cancelarHref} loading={loading}
                textoSalvar={ modo === "cadastro" ? "Cadastrar membro" : "Salvar alterações"}
            />
        </form>
    );
}
