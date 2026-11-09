"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buscarListaPacientes } from "@/app/services/pacienteService";
import type { Paciente } from "@/app/types/pacientes";
import { Plus, Search } from "lucide-react";
import { normalizeSearch } from "@/app/util";
import ItemsVazio from "@/app/components/ItemsVazio";
import BarraPesquisa from "@/app/components/ui/BarraPesquisa";
import BotaoNovo from "@/app/components/ui/BotaoNovo";
import AvatarIniciais from "@/app/components/ui/AvatarIniciais";
import BadgeStatus from "@/app/components/ui/BudgeStatus";

export default function PacientesPage() {
  const [search, setSearch] = useState("");
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");   

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
        setCarregando(true);
        setErro("");
        const dados = await buscarListaPacientes();
        setPacientes(dados);
    } catch (error) {
        setErro("Erro ao carregar os pacientes!");
        console.error(error);
    } finally {
        setCarregando(false);
    }
  }

  const filtroPacientes = pacientes.filter((paciente) =>
    normalizeSearch(`${paciente.nome} ${paciente.apelido ?? ""}`).includes(
      normalizeSearch(search),
    ),
  );

  return (
    <>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex items-center justify-between gap-4">

            <h1 className="min-w-0 text-2xl font-semibold">Pacientes</h1>
            <BotaoNovo href="/pacientes/novo"/>

          </div>

          <div className="mt-5">
            <BarraPesquisa value={search} onChange={setSearch} placeholder="Buscar por nome ou apelido..."/>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-3 px-5 py-4 sm:px-8">
        
        {carregando ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
                Carregando pacientes...
            </p>
        ) : erro ? (

            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
                <p>{erro}</p>
                <button type="button" onClick={carregarDados} className="mt-3 cursor-pointer font-medium underline">
                    Tentar novamente
                </button>
            </div>

        ) : filtroPacientes.length ? (filtroPacientes.map((paciente) => (
            <Link
                key={paciente.id}
                href={`/pacientes/${paciente.id}`}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 sm:p-6"
            >

                <AvatarIniciais nome={paciente.nome} tamanho="lg" />

                <div className="min-w-0 flex-1">

                    <h2 className="break-words text-lg font-medium">
                        {paciente.nome}
                    </h2>

                    {paciente.apelido && (
                        <p className="text-sm text-muted-foreground">
                            {paciente.apelido}
                        </p>
                    )}

                </div>

                <BadgeStatus
                    texto={paciente.ativo ? "Ativo" : "Inativo"}
                    tipo={paciente.ativo ? "sucesso" : "neutro"}
                />

            </Link>
        ))) : (
            <ItemsVazio
              titulo="Nenhum paciente encontrado"
              descricao="Tente buscar por outro nome ou apelido."
              icon={Search}
            />
        )}

      </section>
    </>
  );
}