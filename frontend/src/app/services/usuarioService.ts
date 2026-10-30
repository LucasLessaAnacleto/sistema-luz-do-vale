import type { Usuario } from "@/app/types/usuarios";
import api from "./api";

export async function buscarUsuarioLogado(): Promise<Usuario> {
  const resultado = await api.get<Usuario>("/usuarios/usuariologado");

  return resultado.data;
}