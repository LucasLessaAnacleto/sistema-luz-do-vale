"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useAppSelector } from "@/app/redux/hook";
import { buscarPorId } from "@/app/services/usuarioService";
import type { Usuario } from "@/app/types/usuarios";
import UsuarioForm from "../../componentes/UsuarioForm";

export default function EditarUsuarioPage() {
  const { id } = useParams<{ id: string }>();
  const admin = useAppSelector(
    (state) => state.auth.usuario?.role === "ROLE_ADMIN",
  );
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!admin) return;
    let cancelado = false;
    setUsuario(null);
    setErro("");
    async function carregarDados() {
      try {
        const dados = await buscarPorId(Number(id));
        if (!cancelado) setUsuario(dados);
      } catch {
        if (!cancelado) setErro("Não foi possível carregar este usuário.");
      }
    }
    carregarDados();
    return () => {
      cancelado = true;
    };
  }, [id, admin]);

  return (
    <div className="mx-auto max-w-4xl px-5 py-6 sm:px-8">
      <Link
        href="/configuracoes/equipe"
        className="mb-5 inline-flex items-center gap-2 text-sm text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para equipe
      </Link>
      <h1 className="mb-6 text-2xl font-semibold">Editar usuário</h1>
      {!admin ? (
        <p role="alert">Somente administradores podem editar usuários.</p>
      ) : erro ? (
        <p role="alert" className="text-red-700">
          {erro}
        </p>
      ) : usuario ? (
        <UsuarioForm key={usuario.id} usuarioExistente={usuario} />
      ) : (
        <p role="status">Carregando usuário...</p>
      )}
    </div>
  );
}
