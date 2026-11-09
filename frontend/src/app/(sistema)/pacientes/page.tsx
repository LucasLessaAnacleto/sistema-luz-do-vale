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

export default function PacientesPage() {
  const [search, setSearch] = useState("");
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const dados = await buscarListaPacientes();
      setPacientes(dados);
    } catch (error) {
      alert("Erro ao carregar os pacientes!");
      console.error(error);
    }
  }

  const filteredPatients = pacientes.filter((patient) =>
    normalizeSearch(`${patient.nome} ${patient.apelido ?? ""}`).includes(
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

        {filteredPatients.length ? (
          filteredPatients.map((patient) => (
            <Link
              key={patient.id}
              href={`/pacientes/${patient.id}`}
              aria-label={`Abrir prontuário de ${patient.nome}`}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-6"
            >
              <AvatarIniciais nome={patient.nome} tamanho="lg" />

              <div className="min-w-0">
                <h2 className="break-words text-lg font-medium">
                  {patient.nome}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {patient.apelido}
                </p>
              </div>
            </Link>
          ))
        ) : (
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