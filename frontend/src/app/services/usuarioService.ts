import type { Usuario } from "@/app/types/usuarios";
import api from "./api";
import { buscarUsuarioLogadoMock } from "./mocks/authMock";

export async function buscarUsuarioLogado(): Promise<Usuario> {
  if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
    return buscarUsuarioLogadoMock();
  }

  const resultado = await api.get<Usuario>("/usuarios/usuariologado");

  return resultado.data;
}

export async function buscarListaUsuarios(ativo?: boolean): Promise<Usuario[]> {

  const response = await api.get<Usuario[]>("/usuarios", {
    params: ativo !== undefined ? { ativo } : {},
  });

  if (response.status === 200) {
    return response.data;
  }

  return [];
}

export async function buscarUsuario(id: number): Promise<Usuario | null> {

  const response = await api.get<Usuario>(`/usuarios/${id}`);

  if (response.status === 200) {
    return response.data;
  }

  return null;
}