"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { setUsuario } from "@/app/redux/slices/authSlice";
import { atualizar, salvar } from "@/app/services/usuarioService";
import type {
  CriarUsuarioRequest,
  Usuario,
  UsuarioFormProps,
} from "@/app/types/usuarios";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";

export default function UsuarioForm({ usuarioExistente }: UsuarioFormProps) {
  const usuarioLogado = useAppSelector((state) => state.auth.usuario);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [usuario, setUsuarioForm] = useState({
    nome: usuarioExistente?.nome ?? "",
    telefone: usuarioExistente?.telefone ?? "",
    regProfissional: usuarioExistente?.regProfissional ?? "",
    cpf: usuarioExistente?.cpf ?? "",
    dtNasc: usuarioExistente?.dtNasc ?? "",
    email: usuarioExistente?.email ?? "",
    senha: "",
    role: usuarioExistente?.role ?? ("ROLE_USER" as Usuario["role"]),
    ativo: usuarioExistente?.ativo ?? true,
  });
  const semProfissional =
    !!usuarioExistente && usuarioExistente.profissionalId === null;

  function handleChange(campo: string, valor: string | boolean) {
    setUsuarioForm((anterior) => ({ ...anterior, [campo]: valor }));
  }

  async function handleSalvar() {
    if (usuarioLogado?.role !== "ROLE_ADMIN") return;
    setSalvando(true);
    setErro("");
    try {
      const dados: CriarUsuarioRequest = {
        nome: usuario.nome.trim(),
        telefone: usuario.telefone.trim() || null,
        regProfissional: usuario.regProfissional.trim() || null,
        cpf: usuario.cpf.replace(/\D/g, ""),
        dtNasc: usuario.dtNasc,
        email: usuario.email.trim(),
        senha: usuario.senha,
        role: usuario.role,
        perfilId: null,
      };
      let resultado: Usuario;
      if (usuarioExistente) {
        const { senha, perfilId, ...campos } = dados;
        void senha;
        void perfilId;
        resultado = await atualizar(usuarioExistente.id, {
          ...campos,
          ativo: usuario.ativo,
        });
      } else {
        resultado = await salvar(dados);
      }
      if (resultado.id === usuarioLogado.id)
        dispatch(setUsuario({ usuario: resultado }));
      router.push("/configuracoes/equipe");
    } catch (error) {
      const mensagem = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      setErro(
        typeof mensagem === "string"
          ? mensagem
          : error instanceof Error && !axios.isAxiosError(error)
            ? error.message
            : "Não foi possível salvar o usuário. Confira os dados e tente novamente.",
      );
    } finally {
      setSalvando(false);
    }
  }

  if (usuarioLogado?.role !== "ROLE_ADMIN")
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <p>Somente administradores podem criar ou editar usuários.</p>
        <Link
          href="/configuracoes/equipe"
          className="mt-4 inline-block text-primary underline"
        >
          Voltar para equipe
        </Link>
      </div>
    );

  return (
    <form
      action={handleSalvar}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8"
      aria-busy={salvando}
    >
      <fieldset
        disabled={salvando}
        className="grid min-w-0 gap-5 sm:grid-cols-2"
      >
        <legend className="mb-5 text-base font-semibold">
          Dados do usuário
        </legend>
        {semProfissional && (
          <p className="text-sm text-muted-foreground sm:col-span-2">
            Esta conta não possui profissional vinculado. Os dados profissionais
            não podem ser alterados aqui.
          </p>
        )}
        <Input
          label="Nome completo"
          value={usuario.nome}
          onChange={(event) => handleChange("nome", event.target.value)}
          required={!semProfissional}
          minLength={3}
          disabled={semProfissional}
          autoComplete="name"
        />
        <Input
          label="E-mail"
          type="email"
          value={usuario.email}
          onChange={(event) => handleChange("email", event.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label="CPF"
          value={usuario.cpf}
          onChange={(event) => handleChange("cpf", event.target.value)}
          required={!semProfissional}
          disabled={semProfissional}
          inputMode="numeric"
          maxLength={14}
          placeholder="000.000.000-00"
        />
        <Input
          label="Data de nascimento"
          type="date"
          value={usuario.dtNasc}
          onChange={(event) => handleChange("dtNasc", event.target.value)}
          required={!semProfissional}
          disabled={semProfissional}
        />
        <Input
          label="Telefone"
          type="tel"
          value={usuario.telefone}
          onChange={(event) => handleChange("telefone", event.target.value)}
          disabled={semProfissional}
          autoComplete="tel"
        />
        <Input
          label="Registro profissional"
          value={usuario.regProfissional}
          onChange={(event) =>
            handleChange("regProfissional", event.target.value)
          }
          disabled={semProfissional}
        />
        <div>
          <label htmlFor="permissao" className="mb-2 block text-sm font-medium">
            Permissão de acesso
          </label>
          <select
            id="permissao"
            value={usuario.role}
            onChange={(event) => handleChange("role", event.target.value)}
            className="min-h-12 w-full rounded-xl border border-border bg-input-background px-4 focus:ring-2 focus:ring-ring focus:outline-none"
          >
            <option value="ROLE_USER">Usuário</option>
            <option value="ROLE_ADMIN">Administrador</option>
          </select>
        </div>
        {!usuarioExistente && (
          <Input
            label="Senha inicial"
            type="password"
            value={usuario.senha}
            onChange={(event) => handleChange("senha", event.target.value)}
            required
            autoComplete="new-password"
          />
        )}
        {usuarioExistente && (
          <div>
            <label
              htmlFor="status-usuario"
              className="mb-2 block text-sm font-medium"
            >
              Status
            </label>
            <select
              id="status-usuario"
              value={String(usuario.ativo)}
              onChange={(event) =>
                handleChange("ativo", event.target.value === "true")
              }
              className="min-h-12 w-full rounded-xl border border-border bg-input-background px-4 focus:ring-2 focus:ring-ring focus:outline-none"
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </div>
        )}
      </fieldset>
      {erro && (
        <p role="alert" className="mt-5 text-sm text-red-700">
          {erro}
        </p>
      )}
      <div className="mt-7 flex flex-wrap items-center justify-end gap-4 border-t border-border pt-5">
        <Link
          href="/configuracoes/equipe"
          className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-primary"
        >
          Cancelar
        </Link>
        <Button type="submit" loading={salvando} loadingText="Salvando...">
          {usuarioExistente ? "Salvar alterações" : "Criar usuário"}
        </Button>
      </div>
    </form>
  );
}
