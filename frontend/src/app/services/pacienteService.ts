import type { Paciente } from "@/app/types/pacientes";
import { buscarListaPacientesMock } from "./mocks/pacienteMock";
import api from "./api";

export async function buscarListaPacientes(): Promise<Paciente[]> {
  if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
    return buscarListaPacientesMock();
  }

  const dados = await api.get<Paciente[]>("/pacientes");

  if (dados.status === 200) {
    return dados.data;
  }

  return [];
}