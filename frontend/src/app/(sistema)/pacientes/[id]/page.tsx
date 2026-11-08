"use client";

import Link from "next/link";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState, type KeyboardEvent } from "react";
import { isAxiosError } from "axios";
import { ArrowLeft, ClipboardList, Clock3, FileText, Pencil, UserRound, Users } from "lucide-react";
import { buscarFichaPaciente, buscarHistoricoPaciente, buscarPaciente, buscarTiposDependencia } from "@/app/services/pacienteService";
import type { FichaPaciente, HistoricoPaciente, OpcoesDependencia, Paciente } from "@/app/types/pacientes";
import type { Endereco } from "@/app/types/endereco";
import { cn } from "@/app/util";

const tabs = [
  { id: "prontuario", label: "Prontuário" },
  { id: "historico", label: "Histórico" },
];

function formatarData(valor: string | null | undefined) {
  return valor ? valor.split("T")[0].split("-").reverse().join("/") : "Não informado";
}

function formatarEndereco(endereco: Endereco | null) {
  return endereco ? Object.values(endereco).filter(Boolean).join(", ") || "Não informado" : "Não informado";
}

function calcularIdade(data: string | null) {
  if (!data) return null;
  const [ano, mes, dia] = data.split("-").map(Number);
  const hoje = new Date();
  const antesAniversario = hoje.getMonth() + 1 < mes || (hoje.getMonth() + 1 === mes && hoje.getDate() < dia);
  return hoje.getFullYear() - ano - (antesAniversario ? 1 : 0);
}

export default function PatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const activeTab = useSearchParams().get("aba") === "historico" ? "historico" : "prontuario";
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [ficha, setFicha] = useState<FichaPaciente | null>(null);
  const [opcoes, setOpcoes] = useState<OpcoesDependencia | null>(null);
  const [historico, setHistorico] = useState<HistoricoPaciente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [naoEncontrado, setNaoEncontrado] = useState(false);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;
    let pacienteCarregado = false;
    setCarregando(true);
    setErro("");
    setNaoEncontrado(false);

    async function carregarDados() {
      if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) < 1) {
        setNaoEncontrado(true);
        setCarregando(false);
        return;
      }
      try {
        const dados = await buscarPaciente(Number(id));
        pacienteCarregado = true;
        const [fichaPaciente, tipos, registros] = await Promise.all([
          dados.fichaDocumentoId ? buscarFichaPaciente(dados.fichaDocumentoId) : Promise.resolve(null),
          buscarTiposDependencia(),
          buscarHistoricoPaciente(dados.id),
        ]);
        if (ativo) {
          setPaciente(dados);
          setFicha(fichaPaciente);
          setOpcoes(tipos);
          setHistorico(registros);
        }
      } catch (error) {
        if (!ativo) return;
        if (!pacienteCarregado && isAxiosError(error) && error.response?.status === 404) {
          setNaoEncontrado(true);
        } else {
          setErro("Não foi possível carregar o perfil do paciente. Verifique sua conexão e tente novamente.");
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    carregarDados();
    return () => { ativo = false; };
  }, [id, tentativa]);

  if (naoEncontrado) notFound();
  if (carregando) return <p role="status" className="px-5 py-12 text-center text-muted-foreground">Carregando paciente...</p>;
  if (erro || !paciente) return (
    <div role="alert" className="mx-auto max-w-6xl px-5 py-12 text-center sm:px-8">
      <p>{erro || "Não foi possível carregar o paciente."}</p>
      <button type="button" onClick={() => setTentativa((valor) => valor + 1)} className="mt-4 cursor-pointer rounded-xl bg-primary px-4 py-3 text-white">Tentar novamente</button>
      <Link href="/pacientes" className="ml-4 text-primary-dark underline">Voltar para pacientes</Link>
    </div>
  );

  const complemento = ficha?.dados.acolhido;
  const dependencia = ficha?.dados.dependencia;
  const nomeDependencia = (valor: string | undefined) => opcoes?.tipos.find((opcao) => opcao.valor === valor)?.rotulo ?? "Não informado";
  const responsavel = paciente.responsavel;
  const patient = {
    name: paciente.nome,
    nickname: paciente.apelido,
    age: calcularIdade(paciente.dtNasc),
    admission: paciente.ativo ? "Paciente ativo" : "Paciente inativo",
    dependencies: (dependencia?.tipos ?? []).map(nomeDependencia),
    dependencyHistory: [
      { label: "Primeira droga lícita", value: nomeDependencia(dependencia?.primeiraDrogaLicita) },
      { label: "Idade do primeiro uso", value: dependencia?.idadePrimeiraDrogaLicita == null ? "Não informado" : `${dependencia.idadePrimeiraDrogaLicita} anos` },
      { label: "Primeira droga ilícita", value: nomeDependencia(dependencia?.primeiraDrogaIlicita) },
      { label: "Idade do primeiro uso ilícito", value: dependencia?.idadePrimeiraDrogaIlicita == null ? "Não informado" : `${dependencia.idadePrimeiraDrogaIlicita} anos` },
    ],
    responsibles: responsavel ? [[
      { label: "Nome", value: responsavel.nome || "Não informado" },
      { label: "Parentesco", value: responsavel.parentesco || "Não informado" },
      { label: "CPF", value: responsavel.cpf || "Não informado" },
      { label: "RG", value: responsavel.rg || "Não informado" },
      { label: "Telefone", value: responsavel.telefone || "Não informado" },
      { label: "Data de nascimento", value: formatarData(responsavel.dtNasc) },
      { label: "Endereço", value: formatarEndereco(responsavel.endereco) },
    ]] : [],
  };
  const fields = [
    { label: "Nome completo", value: patient.name },
    { label: "Apelido", value: patient.nickname || "Não informado" },
    { label: "CPF", value: paciente.cpf || "Não informado" },
    { label: "RG", value: paciente.rg || "Não informado" },
    { label: "Data de nascimento", value: formatarData(paciente.dtNasc) },
    { label: "Telefone", value: paciente.telefone || "Não informado" },
    { label: "Endereço", value: formatarEndereco(paciente.endereco) },
    { label: "Nacionalidade", value: complemento?.nacionalidade || "Não informado" },
    { label: "Naturalidade", value: complemento?.naturalidade || "Não informado" },
    { label: "Nome do pai", value: complemento?.nomePai || "Não informado" },
    { label: "Nome da mãe", value: complemento?.nomeMae || "Não informado" },
    { label: "Escolaridade", value: complemento?.escolaridade || "Não informado" },
    { label: "Profissão", value: complemento?.profissao || "Não informado" },
    { label: "Cor/Raça", value: complemento?.cor || "Não informado" },
    { label: "Estado civil", value: complemento?.estadoCivil || "Não informado" },
    { label: "Possui filhos?", value: complemento?.filhos == null ? "Não informado" : complemento.filhos ? "Sim" : "Não" },
    { label: "Data de cadastro", value: formatarData(paciente.dtCriacao) },
  ];

  function selectTab(tab: string) {
    router.replace("/pacientes/" + id + (tab === "historico" ? "?aba=historico" : ""), { scroll: false });
  }

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;

    event.preventDefault();
    selectTab(tabs[nextIndex].id);
    document.getElementById(`tab-${tabs[nextIndex].id}`)?.focus();
  }

  return (
    <>
      <section aria-label="Resumo do paciente" className="bg-linear-to-br from-primary to-[#8a976f] text-white">
        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <Link href="/pacientes" aria-label="Voltar para pacientes" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </Link>
            <div className="flex items-center gap-2">
              <button type="button" disabled aria-label="Editar paciente — em breve" title="Edição em breve" className="flex min-h-10 cursor-not-allowed items-center gap-1.5 rounded-full bg-white/10 px-3 text-sm opacity-70">
                <Pencil className="h-4 w-4" aria-hidden="true" />Editar
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span aria-hidden="true" className="flex shrink-0 items-center justify-center rounded-full bg-secondary font-medium text-foreground h-24 w-24 text-xl border-4 border-white/30 shadow-lg">
              {patient.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("")}
            </span>
            <div className="min-w-0">
              <h1 className="break-words text-xl font-semibold">{patient.name}</h1>
              <p className="mt-0.5 text-sm text-white/90">{patient.nickname}</p>
              {patient.age !== null && <p className="mt-1.5 text-sm font-medium">{patient.age} anos</p>}
              <p className="text-sm text-white/80">{patient.admission}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="border-b border-border bg-card">
        <div role="tablist" aria-label="Informações do paciente" className="mx-auto flex max-w-6xl">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`painel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => selectTab(tab.id)}
              onKeyDown={(event) => handleTabKey(event, index)}
              className={cn("min-h-13 flex-1 cursor-pointer border-b-2 px-4 py-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-primary", activeTab === tab.id ? "border-primary text-primary-dark" : "border-transparent text-muted-foreground hover:bg-primary/5")}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
        <section id="painel-prontuario" role="tabpanel" aria-labelledby="tab-prontuario" hidden={activeTab !== "prontuario"} tabIndex={0} className="space-y-5 focus-visible:outline-2 focus-visible:outline-primary">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><UserRound className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />Dados do Acolhido</h2>
            <dl className="divide-y divide-border">
              {fields.map((field) => (
                <div key={field.label} className="grid grid-cols-[minmax(0,120px)_minmax(0,1fr)] items-start gap-3 py-2 sm:grid-cols-[144px_minmax(0,1fr)]">
                  <dt className="text-xs leading-5 text-muted-foreground">{field.label}</dt>
                  <dd className="break-words text-sm">{field.value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><ClipboardList className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />Tipos de Dependência</h2>
            {dependencia ? (
              <>
                <div className="mb-4 flex flex-wrap gap-2">
                  {patient.dependencies.map((dependency) => <span key={dependency} className="rounded-full bg-accent px-3 py-1 text-sm text-primary-dark">{dependency}</span>)}
                </div>
                <dl className="divide-y divide-border">
                  {patient.dependencyHistory.map((field) => (
                    <div key={field.label} className="grid grid-cols-[minmax(0,120px)_minmax(0,1fr)] items-start gap-3 py-2 sm:grid-cols-[144px_minmax(0,1fr)]">
                      <dt className="text-xs leading-5 text-muted-foreground">{field.label}</dt>
                      <dd className="break-words text-sm">{field.value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : <p className="text-sm text-muted-foreground">Não informado.</p>}
          </section>
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Users className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />Dados dos Responsáveis</h2>
            {patient.responsibles.length ? patient.responsibles.map((responsible, index) => (
              <div key={index} className="mt-4 first:mt-0">
                <h3 className="mb-2 text-xs font-medium text-muted-foreground uppercase">Responsável {index + 1}</h3>
                <dl className="divide-y divide-border">
                  {responsible.map((field) => (
                    <div key={field.label} className="grid grid-cols-[minmax(0,120px)_minmax(0,1fr)] items-start gap-3 py-2 sm:grid-cols-[144px_minmax(0,1fr)]">
                      <dt className="text-xs leading-5 text-muted-foreground">{field.label}</dt>
                      <dd className="break-words text-sm">{field.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )) : <p className="text-sm text-muted-foreground">Nenhum responsável informado.</p>}
          </section>
        </section>

        <section id="painel-historico" role="tabpanel" aria-labelledby="tab-historico" hidden={activeTab !== "historico"} tabIndex={0} className="focus-visible:outline-2 focus-visible:outline-primary">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Histórico do paciente</h2>
          </div>
          {historico.length ? (
            <ol className="space-y-4">
              {historico.map((entry, index) => (
                <li key={entry.id} className="relative flex gap-4">
                  {index < historico.length - 1 && <span aria-hidden="true" className="absolute top-10 bottom-[-16px] left-5 w-px bg-border" />}
                  <span className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <article className="relative min-w-0 flex-1 rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-primary/40 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-medium">{entry.tipoDocumento || "Registro do paciente"}</h3>
                      </div>
                      <span className="inline-flex shrink-0 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-dark">
                        {entry.acao === "CRIADO" ? "Criado" : entry.acao}
                      </span>
                    </div>
                    <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{formatarData(entry.dtCriacao)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Por {entry.usuario}</p>
                    {entry.observacao && <p className="mt-2 text-sm">{entry.observacao}</p>}
                  </article>
                </li>
              ))}
            </ol>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <FileText className="mx-auto mb-3 h-7 w-7 text-primary" aria-hidden="true" />
              <h2 className="text-base font-medium">Nenhum documento para este paciente</h2>
              <p className="mt-1 text-sm text-muted-foreground">Os registros do paciente serão exibidos aqui.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
