"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import { buscarTiposDependencia, criarPaciente } from "@/app/services/pacienteService";
import type { OpcoesDependencia, PacienteRequest } from "@/app/types/pacientes";

const selectClass = "w-full min-w-0 rounded-xl border border-border bg-input-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-ring focus:outline-none";
const sectionClass = "rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5";
const camposClass = "grid items-end gap-x-3 gap-y-4 [&>div]:min-w-0 [&_label]:mb-1.5 [&_input]:min-w-0 [&_input]:px-3 [&_input]:py-2.5 [&_input]:text-sm";
const mensagemSessaoInvalida = "Sua sessão expirou ou não é válida. Clique em Sair e entre novamente para continuar.";
const camposEndereco = [
  { nome: "rua", rotulo: "Rua" },
  { nome: "numero", rotulo: "Número" },
  { nome: "bairro", rotulo: "Bairro" },
  { nome: "municipio", rotulo: "Município" },
  { nome: "estado", rotulo: "Estado (UF)" },
];
const camposFicha = [
  { nome: "nacionalidade", rotulo: "Nacionalidade" },
  { nome: "naturalidade", rotulo: "Naturalidade" },
  { nome: "nomePai", rotulo: "Nome do pai" },
  { nome: "nomeMae", rotulo: "Nome da mãe" },
  { nome: "escolaridade", rotulo: "Escolaridade" },
  { nome: "profissao", rotulo: "Profissão" },
  { nome: "cor", rotulo: "Cor/Raça" },
  { nome: "estadoCivil", rotulo: "Estado civil" },
];

export default function NovoPacientePage() {
  const router = useRouter();
  const salvandoRef = useRef(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [opcoes, setOpcoes] = useState<OpcoesDependencia | null>(null);
  const [erroOpcoes, setErroOpcoes] = useState("");
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;
    buscarTiposDependencia()
      .then((dados) => { if (ativo) setOpcoes(dados); })
      .catch((error) => {
        if (ativo) setErroOpcoes(
          isAxiosError(error) && error.response?.status === 401
            ? mensagemSessaoInvalida
            : "Não foi possível carregar as opções do cadastro. Verifique sua conexão e tente novamente.",
        );
      });
    return () => { ativo = false; };
  }, [tentativa]);

  async function salvar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (salvandoRef.current || !opcoes) return;

    const form = event.currentTarget;
    const dados = new FormData(form);
    const texto = (campo: string) => String(dados.get(campo) ?? "").trim() || null;
    const numero = (campo: string) => texto(campo) === null ? null : Number(texto(campo));
    const endereco = (prefixo: string) => {
      const valor = {
        rua: texto(`${prefixo}.rua`), numero: texto(`${prefixo}.numero`),
        bairro: texto(`${prefixo}.bairro`), municipio: texto(`${prefixo}.municipio`),
        estado: texto(`${prefixo}.estado`)?.toUpperCase() ?? null,
      };
      return Object.values(valor).some(Boolean) ? valor : null;
    };

    if ((texto("nome") ?? "").length < 3 || !texto("cpf") || !texto("rg")) {
      setErro("Informe o nome com pelo menos três caracteres, CPF e RG do paciente.");
      return;
    }

    const paciente: PacienteRequest = {
      nome: texto("nome")!, apelido: texto("apelido"), cpf: texto("cpf")!, rg: texto("rg")!,
      telefone: texto("telefone"), dtNasc: texto("dtNasc"), endereco: endereco("endereco"),
      responsavel: {
        nome: texto("responsavel.nome") ?? "",
        parentesco: texto("responsavel.parentesco"), cpf: texto("responsavel.cpf"),
        rg: texto("responsavel.rg"), telefone: texto("responsavel.telefone"),
        dtNasc: texto("responsavel.dtNasc"), endereco: endereco("responsavel.endereco"),
      },
      fichaAcolhimento: {
        nacionalidade: texto("nacionalidade"), naturalidade: texto("naturalidade"),
        nomePai: texto("nomePai"), nomeMae: texto("nomeMae"), escolaridade: texto("escolaridade"),
        profissao: texto("profissao"), cor: texto("cor"), estadoCivil: texto("estadoCivil"),
        filhos: texto("filhos") === null ? null : texto("filhos") === "true",
        tiposDependencia: dados.getAll("tiposDependencia").map(String),
        primeiraDrogaLicita: texto("primeiraDrogaLicita"),
        idadePrimeiraDrogaLicita: numero("idadePrimeiraDrogaLicita"),
        primeiraDrogaIlicita: texto("primeiraDrogaIlicita"),
        idadePrimeiraDrogaIlicita: numero("idadePrimeiraDrogaIlicita"),
      },
    };

    salvandoRef.current = true;
    setSalvando(true);
    setErro("");
    try {
      const criado = await criarPaciente(paciente);
      router.push(`/pacientes/${criado.id}`);
    } catch (error) {
      const mensagem = isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : null;
      setErro(isAxiosError(error) && error.response?.status === 401
        ? mensagemSessaoInvalida
        : mensagem || "Não foi possível salvar o paciente. Verifique sua conexão e tente novamente.");
      salvandoRef.current = false;
      setSalvando(false);
    }
  }

  return (
    <>
      <section className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-5 py-5 sm:px-6">
          <Link href="/pacientes" aria-label="Voltar para pacientes" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent hover:bg-secondary/50 focus-visible:outline-2 focus-visible:outline-primary">
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <h1 className="text-xl font-semibold">Novo paciente</h1>
        </div>
      </section>

      <form onSubmit={salvar} className="mx-auto max-w-3xl space-y-6 px-5 py-6 sm:px-6">
        <p className="text-sm text-muted-foreground">Os campos marcados com * são obrigatórios.</p>
        {!opcoes && !erroOpcoes && <p role="status">Carregando opções do cadastro...</p>}
        {erroOpcoes && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <p>{erroOpcoes}</p>
            <button type="button" onClick={() => { setErroOpcoes(""); setTentativa((valor) => valor + 1); }} className="mt-2 cursor-pointer font-medium underline">Tentar novamente</button>
          </div>
        )}

        <fieldset disabled={salvando} className="min-w-0 space-y-6 disabled:opacity-70">
          <section className={sectionClass}>
            <h2 className="mb-4 text-sm font-semibold">Dados do paciente</h2>
            <div className={`${camposClass} min-[360px]:grid-cols-2`}>
              <div className="min-[360px]:col-span-2">
                <Input label="Nome completo *" name="nome" required minLength={3} maxLength={400} />
              </div>
              <div className="min-[360px]:col-span-2">
                <Input label="Apelido" name="apelido" maxLength={400} />
              </div>
              <Input label="CPF *" name="cpf" required maxLength={14} inputMode="numeric" />
              <Input label="RG *" name="rg" required maxLength={40} />
              <Input label="Data de nascimento" name="dtNasc" type="date" />
              <Input label="Telefone" name="telefone" type="tel" maxLength={40} />
            </div>
            <h3 className="mt-5 mb-3 text-sm font-medium">Endereço do paciente</h3>
            <div className={`${camposClass} min-[360px]:grid-cols-6`}>
              {camposEndereco.map((campo) => (
                <div key={campo.nome} className={campo.nome === "bairro" ? "min-[360px]:col-span-6" : campo.nome === "numero" || campo.nome === "estado" ? "min-[360px]:col-span-2" : "min-[360px]:col-span-4"}>
                  <Input label={campo.rotulo} name={`endereco.${campo.nome}`} maxLength={campo.nome === "estado" ? 2 : campo.nome === "numero" ? 40 : 255} />
                </div>
              ))}
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="mb-4 text-sm font-semibold">Ficha de acolhimento</h2>
            <div className={`${camposClass} min-[360px]:grid-cols-2`}>
              {camposFicha.map((campo) => (
                <div key={campo.nome} className={["nomePai", "nomeMae", "escolaridade", "profissao"].includes(campo.nome) ? "min-[360px]:col-span-2" : ""}>
                  <Input label={campo.rotulo} name={campo.nome} />
                </div>
              ))}
              <div className="min-[360px]:col-span-2">
                <label htmlFor="filhos" className="mb-2 block text-sm font-medium">Possui filhos?</label>
                <select id="filhos" name="filhos" className={selectClass} defaultValue="">
                  <option value="">Não informado</option><option value="true">Sim</option><option value="false">Não</option>
                </select>
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="mb-4 text-sm font-semibold">Tipos de dependência</h2>
            <fieldset className="grid gap-2 sm:grid-cols-2">
              <legend className="sr-only">Selecione os tipos de dependência</legend>
              {opcoes?.tipos.map((opcao) => (
                <label key={opcao.valor} className="flex min-h-11 items-center gap-3 rounded-xl border border-border px-3 py-2 text-sm">
                  <input type="checkbox" name="tiposDependencia" value={opcao.valor} className="h-5 w-5 shrink-0 accent-primary" />{opcao.rotulo}
                </label>
              ))}
            </fieldset>
            <div className={`${camposClass} mt-4 min-[360px]:grid-cols-2`}>
              <div>
                <label htmlFor="primeiraDrogaLicita" className="mb-2 block text-sm font-medium">Primeira droga lícita</label>
                <select id="primeiraDrogaLicita" name="primeiraDrogaLicita" className={selectClass} defaultValue="">
                  <option value="">Não informado</option>
                  {opcoes?.licitas.map((opcao) => <option key={opcao.valor} value={opcao.valor}>{opcao.rotulo}</option>)}
                </select>
              </div>
              <Input label="Idade do primeiro uso de droga lícita" name="idadePrimeiraDrogaLicita" type="number" min={0} step={1} />
              <div>
                <label htmlFor="primeiraDrogaIlicita" className="mb-2 block text-sm font-medium">Primeira droga ilícita</label>
                <select id="primeiraDrogaIlicita" name="primeiraDrogaIlicita" className={selectClass} defaultValue="">
                  <option value="">Não informado</option>
                  {opcoes?.ilicitas.map((opcao) => <option key={opcao.valor} value={opcao.valor}>{opcao.rotulo}</option>)}
                </select>
              </div>
              <Input label="Idade do primeiro uso de droga ilícita" name="idadePrimeiraDrogaIlicita" type="number" min={0} step={1} />
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className="mb-4 text-sm font-semibold">Dados do responsável</h2>
            <div className={`${camposClass} min-[360px]:grid-cols-2`}>
              <div className="min-[360px]:col-span-2">
                <Input label="Nome do responsável" name="responsavel.nome" maxLength={400} />
              </div>
              <div className="min-[360px]:col-span-2">
                <Input label="Parentesco" name="responsavel.parentesco" maxLength={40} />
              </div>
              <Input label="CPF do responsável" name="responsavel.cpf" maxLength={14} inputMode="numeric" />
              <Input label="RG do responsável" name="responsavel.rg" maxLength={40} />
              <Input label="Data de nascimento do responsável" name="responsavel.dtNasc" type="date" />
              <Input label="Telefone do responsável" name="responsavel.telefone" type="tel" maxLength={40} />
            </div>
            <h3 className="mt-5 mb-3 text-sm font-medium">Endereço do responsável</h3>
            <div className={`${camposClass} min-[360px]:grid-cols-6`}>
              {camposEndereco.map((campo) => (
                <div key={campo.nome} className={campo.nome === "bairro" ? "min-[360px]:col-span-6" : campo.nome === "numero" || campo.nome === "estado" ? "min-[360px]:col-span-2" : "min-[360px]:col-span-4"}>
                  <Input label={campo.rotulo} name={`responsavel.endereco.${campo.nome}`} maxLength={campo.nome === "estado" ? 2 : campo.nome === "numero" ? 40 : 255} />
                </div>
              ))}
            </div>
          </section>

          {erro && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{erro}</p>}
          <div className="grid grid-cols-2 gap-3 [&_button]:px-3 [&_button]:text-sm">
            <button type="button" onClick={() => router.push("/pacientes")} className="cursor-pointer rounded-xl border border-border bg-card px-5 py-3 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed">Cancelar</button>
            <Button type="submit" loading={salvando} loadingText="Salvando..." disabled={!opcoes}>Salvar paciente</Button>
          </div>
        </fieldset>
      </form>
    </>
  );
}
