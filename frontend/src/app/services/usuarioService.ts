import type { Usuario } from "@/app/types/usuarios";
import api from "./api";
import { buscarUsuarioLogadoMock } from "./mocks/authMock";

export async function buscarUsuarioLogado(): Promise<Usuario> {
  if (process.env.NEXT_PUBLIC_USE_AUTH_MOCK === "true") {
    return buscarUsuarioLogadoMock();
  }

  const resultado = await api.get<Usuario>("/usuarios/usuariologado");

  return resultado.data;
}