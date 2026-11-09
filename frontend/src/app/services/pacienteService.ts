import type { Paciente, PacienteRequest } from "@/app/types/pacientes";
import { buscarListaPacientesMock } from "./mocks/pacienteMock";
import api from "./api";

export async function buscarListaPacientes(ativo?: boolean): Promise<Paciente[]> {

  const response = await api.get<Paciente[]>("/pacientes", {
    params: ativo !== undefined ? { ativo } : {},
  });

  return response.data;
}

export async function criarPaciente(dados: PacienteRequest): Promise<Paciente> {

    const response = await api.post<Paciente>("/pacientes", dados);

    return response.data;
}