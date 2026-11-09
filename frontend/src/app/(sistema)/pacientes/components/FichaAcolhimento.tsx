"use client";

import { useEffect, useState } from "react";

import type { OpcaoLista } from "@/app/types/documentos";
import { buscarLista } from "@/app/services/listaService";

import Input from "@/app/components/ui/Input";
import Selecao from "@/app/components/ui/Selecao";
import SecaoFormulario from "@/app/components/SecaoFormulario";

interface Props {
    valores?: Record<string, string>;
}

export default function FichaAcolhimento({ valores = {} }: Props) {

    const [dependencias, setDependencias] = useState<OpcaoLista[]>([]);
    const [dependenciasLicitas, setDependenciasLicitas] = useState<OpcaoLista[]>([]);
    const [dependenciasIlicitas, setDependenciasIlicitas] = useState<OpcaoLista[]>([]);


    useEffect(() => {

        async function carregarListas() {

            try {

                const [listaDependencias, listaLicitas, listaIlicitas] = await Promise.all([
                    buscarLista("TIPO_DEPENDENCIA"),
                    buscarLista("TIPO_DEPENDENCIA_LICITA"),
                    buscarLista("TIPO_DEPENDENCIA_ILICITA"),
                ]);

                setDependencias(listaDependencias);
                setDependenciasLicitas(listaLicitas);
                setDependenciasIlicitas(listaIlicitas);

            } catch (error) {

                if (error instanceof Error) {
                    alert(error.message);
                }

            }
        }

        carregarListas();

    }, []);


    const tiposSelecionados = valores.tiposDependencia
        ? valores.tiposDependencia.split(",")
        : [];


    return (
        <SecaoFormulario titulo="Ficha de acolhimento">

            <Input label="Nacionalidade" name="nacionalidade" placeholder="Brasileira" defaultValue={valores.nacionalidade} />
            <Input label="Naturalidade" name="naturalidade" placeholder="Cidade natal" defaultValue={valores.naturalidade} />

            <div className="sm:col-span-2">
                <Input label="Nome do pai" name="nomePai" placeholder="Nome do pai" defaultValue={valores.nomePai} />
            </div>

            <div className="sm:col-span-2">
                <Input label="Nome da mãe" name="nomeMae" placeholder="Nome da mãe" defaultValue={valores.nomeMae} />
            </div>

            <Input label="Escolaridade" name="escolaridade" placeholder="Escolaridade" defaultValue={valores.escolaridade} />
            <Input label="Profissão" name="profissao" placeholder="Profissão" defaultValue={valores.profissao} />

            <Input label="Cor" name="cor" placeholder="Cor" defaultValue={valores.cor} />
            <Input label="Estado civil" name="estadoCivil" placeholder="Estado civil" defaultValue={valores.estadoCivil} />

            <Selecao label="Possui filhos?" name="filhos" defaultValue={valores.filhos || ""}>

                <option value="">Não informado</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>

            </Selecao>


            <div className="sm:col-span-2 pt-2">

                <h3 className="text-sm font-semibold text-primary-dark">
                    Dependência
                </h3>

            </div>


            <div className="sm:col-span-2">

                <p className="mb-2 text-sm font-medium">
                    Tipos de dependência
                </p>

                <div className="grid gap-2 rounded-xl border border-border bg-input-background p-4 sm:grid-cols-2">

                    {dependencias.map((opcao) => (

                        <label key={opcao.valor} className="flex cursor-pointer items-center gap-2 text-sm">

                            <input
                                type="checkbox"
                                name="tiposDependencia"
                                value={opcao.valor}
                                defaultChecked={tiposSelecionados.includes(opcao.valor)}
                                className="h-4 w-4 accent-primary"
                            />

                            <span>
                                {opcao.rotulo}
                            </span>

                        </label>

                    ))}

                </div>

            </div>


            <Selecao label="Primeira droga lícita" name="primeiraDrogaLicita" defaultValue={valores.primeiraDrogaLicita || ""}>

                <option value="">Selecione</option>

                {dependenciasLicitas.map((opcao) => (
                    <option key={opcao.valor} value={opcao.valor}>
                        {opcao.rotulo}
                    </option>
                ))}

            </Selecao>

            <Input label="Idade" name="idadePrimeiraDrogaLicita" type="number" min="0" defaultValue={valores.idadePrimeiraDrogaLicita} />


            <Selecao label="Primeira droga ilícita" name="primeiraDrogaIlicita" defaultValue={valores.primeiraDrogaIlicita || ""}>

                <option value="">Selecione</option>

                {dependenciasIlicitas.map((opcao) => (
                    <option key={opcao.valor} value={opcao.valor}>
                        {opcao.rotulo}
                    </option>
                ))}

            </Selecao>

            <Input label="Idade" name="idadePrimeiraDrogaIlicita" type="number" min="0" defaultValue={valores.idadePrimeiraDrogaIlicita} />

        </SecaoFormulario>
    );
}