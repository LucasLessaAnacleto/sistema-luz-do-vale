import type {
  Usuario,
  CriarUsuarioRequest,
  EditarUsuarioRequest,
} from "@/app/types/usuarios";
import api from "./api";
import {
  buscarListaUsuariosMock,
  buscarUsuarioPorIdMock,
  salvarUsuarioMock,
  atualizarUsuarioMock,
} from "./mocks/usuarioMock";
import { buscarUsuarioLogadoMock } from "./mocks/authMock";

export async function buscarUsuarioLogado(): Promise<Usuario> {
  if (process.env.NEXT_PUBLIC_USE_AUTH_MOCK === "true") {
    return buscarUsuarioLogadoMock();
  }

  const resultado = await api.get<Usuario>("/usuarios/usuariologado");

  return resultado.data;
}

export async function buscarListaUsuarios(): Promise<Usuario[]> {
  if (process.env.NEXT_PUBLIC_USE_AUTH_MOCK === "true") {
    return buscarListaUsuariosMock();
  }
  return (await api.get<Usuario[]>("/usuarios")).data;
}

export async function buscarPorId(id: number): Promise<Usuario> {
  if (process.env.NEXT_PUBLIC_USE_AUTH_MOCK === "true") {
    return buscarUsuarioPorIdMock(id);
  }
  return (await api.get<Usuario>(`/usuarios/${id}`)).data;
}

export async function salvar(dados: CriarUsuarioRequest): Promise<Usuario> {
  if (process.env.NEXT_PUBLIC_USE_AUTH_MOCK === "true") {
    return salvarUsuarioMock(dados);
  }
  return (await api.post<Usuario>("/usuarios", dados)).data;
}

export async function atualizar(
  id: number,
  dados: EditarUsuarioRequest,
): Promise<Usuario> {
  if (process.env.NEXT_PUBLIC_USE_AUTH_MOCK === "true") {
    return atualizarUsuarioMock(id, dados);
  }
  return (await api.patch<Usuario>(`/usuarios/${id}`, dados)).data;
}
