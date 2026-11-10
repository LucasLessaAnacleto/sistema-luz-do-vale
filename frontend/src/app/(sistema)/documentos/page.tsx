"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, Search } from "lucide-react";

import type { DocumentoLista } from "@/app/types/documentos";
import { listarDocumentos } from "@/app/services/documentoService";
import { formatarData, normalizeSearch } from "@/app/util";

import BarraPesquisa from "@/app/components/ui/BarraPesquisa";
import BotaoNovo from "@/app/components/ui/BotaoNovo";
import BudgetFiltros from "@/app/components/ui/BudgetFiltros";
import BudgetStatus from "@/app/components/ui/BudgeStatus";
import AvatarIniciais from "@/app/components/ui/AvatarIniciais";
import Card from "@/app/components/ui/Card";
import ItemsVazio from "@/app/components/ItemsVazio";
import ErroCarregamento from "@/app/components/ErroCarregamento";
import CarregandoConteudo from "@/app/components/CarregandoConteudo";

export default function DocumentosPage() {

  const [documentos, setDocumentos] = useState<DocumentoLista[]>([]);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalDocumentos, setTotalDocumentos] = useState(0);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");   

  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    carregarDocumentos();
  }, [pagina]);

  async function carregarDocumentos() {

    try {
        setCarregando(true);
        setErro("");
        const dados = await listarDocumentos(pagina);

        setDocumentos(dados.content);
        setTotalPaginas(dados.totalPages);
        setTotalDocumentos(dados.totalElements);

    } catch (error) {

      setErro("Erro ao carregar os documentos!");
      console.error(error);

    } finally {
        setCarregando(false);
    }
  }

  const documentosFiltrados = documentos.filter((documento) => {

    const busca = normalizeSearch(search);

    const correspondeBusca =
      normalizeSearch(documento.tipoDocumento).includes(busca) ||
      normalizeSearch(documento.paciente).includes(busca) ||
      normalizeSearch(documento.apelido || "").includes(busca) ||
      normalizeSearch(documento.criadoPor).includes(busca);

    const correspondeFiltro =
      filtro === "todos" ||
      (filtro === "pendentes" && documento.dtAssinatura === null) ||
      (filtro === "assinados" && documento.dtAssinatura !== null);

    return correspondeBusca && correspondeFiltro;
  });

  return (
    <>

      <section className="border-b border-border bg-card">

        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">

          <div className="flex items-center justify-between gap-4">

            <div className="min-w-0">

              <h1 className="text-2xl font-semibold">Documentos</h1>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {totalDocumentos} documentos no total
              </p>

            </div>

            <BotaoNovo href="/documentos/novo" texto="Novo documento" />

          </div>


          <div className="mt-5">

            <BarraPesquisa
              value={search}
              onChange={setSearch}
              placeholder="Buscar por paciente, tipo ou responsável..."
            />

            <div className="mt-3">

              <BudgetFiltros
                valor={filtro}
                onChange={setFiltro}
                opcoes={[
                  { valor: "todos", label: "Todos" },
                  { valor: "pendentes", label: "Pendentes" },
                  { valor: "assinados", label: "Assinados" },
                ]}
              />

            </div>

          </div>

        </div>

      </section>


      <section className="mx-auto max-w-6xl space-y-3 px-5 py-4 sm:px-8">

        {carregando ? (
          <CarregandoConteudo mensagem="Carregando documentos..." />
        ) : erro ? (
          <ErroCarregamento mensagem={erro} />
        ) : documentosFiltrados.length ? (

          documentosFiltrados.map((documento) => (

            <Card key={documento.id} className="relative flex items-start gap-3 transition-colors hover:border-primary/40">

              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </span>

              <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-start justify-between gap-2">

                  <div className="min-w-0">

                    <h2 className="break-words text-sm font-medium">

                      <Link
                        href={`/documentos/${documento.id}`}
                        className="after:absolute after:inset-0 after:rounded-2xl hover:text-primary-dark"
                      >
                        {documento.tipoDocumento}
                      </Link>

                    </h2>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Documento #{documento.id} · Versão {documento.versao}
                    </p>

                  </div>

                  <BudgetStatus
                    texto={documento.dtAssinatura ? "Assinado" : "Pendente de assinatura"}
                    tipo={documento.dtAssinatura ? "sucesso" : "alerta"}
                  />

                </div>


                <Link href={`/pacientes/${documento.pacienteId}`}
                  className="relative z-10 mt-3 flex w-fit max-w-full items-center gap-2"
                >

                  <AvatarIniciais nome={documento.paciente} tamanho="sm" />

                  <span className="text-xs">

                    {documento.paciente}

                    {documento.apelido && (
                      <span className="text-muted-foreground">
                        {" "}({documento.apelido})
                      </span>
                    )}

                  </span>

                </Link>


                <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">

                  <p>{documento.criadoPor}</p>

                  <p>{formatarData(documento.dtCriacao)}</p>

                </div>

              </div>

            </Card>

          ))

        ) : (

          <ItemsVazio
            titulo="Nenhum documento encontrado"
            descricao="Tente buscar por outro termo ou altere o filtro."
            icon={Search}
          />

        )}

{/* 
        {totalPaginas > 1 && (

          <div className="flex items-center justify-center gap-3 py-4">

            <button
              type="button"
              disabled={pagina === 0}
              onClick={() => setPagina(pagina - 1)}
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm
                enabled:cursor-pointer enabled:hover:bg-accent disabled:opacity-50"
            >
              Anterior
            </button>

            <span className="text-sm text-muted-foreground">
              Página {pagina + 1} de {totalPaginas}
            </span>

            <button
              type="button"
              disabled={pagina + 1 >= totalPaginas}
              onClick={() => setPagina(pagina + 1)}
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm
                enabled:cursor-pointer enabled:hover:bg-accent disabled:opacity-50"
            >
              Próxima
            </button>

          </div>

        )} */}

      </section>

    </>
  );
}
