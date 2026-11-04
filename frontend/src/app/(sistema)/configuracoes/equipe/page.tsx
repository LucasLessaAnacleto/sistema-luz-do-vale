"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Plus,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useAppSelector } from "@/app/redux/hook";
import { buscarListaUsuarios } from "@/app/services/usuarioService";
import type { Usuario } from "@/app/types/usuarios";
import { cn, normalizeSearch } from "@/app/util";

export default function EquipePage() {
  const admin = useAppSelector(
    (state) => state.auth.usuario?.role === "ROLE_ADMIN",
  );
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarDados() {
      try {
        setUsuarios(await buscarListaUsuarios());
      } catch {
        setErro("Não foi possível carregar a equipe. Tente novamente.");
      } finally {
        setCarregando(false);
      }
    }
    carregarDados();
  }, []);

  const filtrados = usuarios.filter(
    (usuario) =>
      normalizeSearch(
        `${usuario.nome} ${usuario.perfil ?? ""} ${usuario.regProfissional ?? ""} ${usuario.email}`,
      ).includes(normalizeSearch(busca)) &&
      (filtro === "todos" || usuario.ativo === (filtro === "ativos")),
  );

  return (
    <>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/configuracoes"
              aria-label="Voltar para configurações"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/50 text-primary-dark focus-visible:outline-2 focus-visible:outline-primary"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold">Equipe</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                {carregando
                  ? "Carregando equipe..."
                  : erro
                    ? "Equipe indisponível"
                    : `${usuarios.filter((item) => item.ativo).length} ativos`}
              </p>
            </div>
            {admin && (
              <Link
                href="/configuracoes/equipe/novo"
                className="flex min-h-10 items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Plus className="h-4 w-4" />
                Novo
              </Link>
            )}
          </div>
          <div className="relative mt-5">
            <label htmlFor="busca-equipe" className="sr-only">
              Buscar na equipe
            </label>
            <Search
              className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="busca-equipe"
              type="search"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar por nome, perfil, e-mail..."
              className="min-h-11 w-full rounded-2xl border border-border bg-secondary/40 py-3 pr-4 pl-11 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
            />
          </div>
          <div
            className="mt-3 flex gap-2"
            aria-label="Filtrar equipe por status"
          >
            {[
              ["todos", "Todos"],
              ["ativos", "Ativos"],
              ["inativos", "Inativos"],
            ].map(([valor, texto]) => (
              <button
                key={valor}
                type="button"
                aria-pressed={filtro === valor}
                onClick={() => setFiltro(valor)}
                className={cn(
                  "min-h-9 cursor-pointer rounded-full px-4 text-xs focus-visible:outline-2 focus-visible:outline-primary",
                  filtro === valor
                    ? "bg-primary text-white"
                    : "bg-secondary/50 text-primary-dark",
                )}
              >
                {texto}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section
        aria-label="Usuários do sistema"
        className="mx-auto max-w-6xl space-y-3 px-5 py-5 sm:px-8"
      >
        {erro && (
          <p
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
          >
            {erro}{" "}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="underline"
            >
              Recarregar
            </button>
          </p>
        )}
        {carregando && (
          <p
            role="status"
            className="py-8 text-center text-sm text-muted-foreground"
          >
            Carregando usuários...
          </p>
        )}
        {!carregando && !erro && (
          <p role="status" className="sr-only">
            {filtrados.length} usuários encontrados
          </p>
        )}
        {!carregando &&
          !erro &&
          filtrados.map((usuario) => {
            const conteudo = (
              <>
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium"
                >
                  {(usuario.nome || usuario.email)
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((parte) => parte[0])
                    .join("")}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="flex items-center gap-2 text-sm font-medium">
                    <span className="break-words">
                      {usuario.nome || usuario.email}
                    </span>
                    {usuario.role === "ROLE_ADMIN" && (
                      <ShieldCheck
                        className="h-4 w-4 shrink-0 text-primary"
                        aria-label="Administrador"
                      />
                    )}
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {usuario.perfil ||
                      usuario.regProfissional ||
                      (usuario.role === "ROLE_ADMIN"
                        ? "Administrador"
                        : "Usuário")}
                  </p>
                  <p className="mt-0.5 break-all text-xs text-muted-foreground">
                    {usuario.email}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs",
                      usuario.ativo
                        ? "border-primary/20 bg-primary/5 text-primary-dark"
                        : "border-border bg-accent text-muted-foreground",
                    )}
                  >
                    {usuario.ativo ? "Ativo" : "Inativo"}
                  </span>
                  {admin && (
                    <ChevronRight
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </>
            );
            const estilo =
              "flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6";
            return admin ? (
              <Link
                key={usuario.id}
                href={`/configuracoes/equipe/${usuario.id}/editar`}
                aria-label={`Editar ${usuario.nome || usuario.email}`}
                className={`${estilo} hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-primary`}
              >
                {conteudo}
              </Link>
            ) : (
              <article key={usuario.id} className={estilo}>
                {conteudo}
              </article>
            );
          })}
        {!carregando && !erro && !filtrados.length && (
          <div className="rounded-2xl border border-dashed border-secondary bg-card p-10 text-center">
            <Users className="mx-auto mb-3 h-7 w-7 text-primary" />
            <h2 className="font-semibold">Nenhum usuário encontrado</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Altere a busca ou o filtro de status.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
