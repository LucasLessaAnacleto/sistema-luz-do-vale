import type { FichaPaciente, HistoricoPaciente, OpcoesDependencia, Paciente, PacienteRequest } from "@/app/types/pacientes";
import api from "./api";

export async function buscarListaPacientes(): Promise<Paciente[]> {
  const dados = await api.get<Paciente[]>("/pacientes");

  if (dados.status === 200) {
    return dados.data;
  }

  return [];
}

export async function buscarPaciente(id: number): Promise<Paciente> {
  const resultado = await api.get<Paciente>(`/pacientes/${id}`);
  return resultado.data;
}

export async function criarPaciente(dados: PacienteRequest): Promise<Paciente> {
  const resultado = await api.post<Paciente>("/pacientes", dados);
  return resultado.data;
}

export async function buscarTiposDependencia(): Promise<OpcoesDependencia> {
  const resultado = await api.get<OpcoesDependencia>("/tipos-dependencia");
  return resultado.data;
}

export async function buscarFichaPaciente(documentoId: number): Promise<FichaPaciente> {
  const resultado = await api.get<FichaPaciente>(`/documentos/${documentoId}`);
  return resultado.data;
}

export async function buscarHistoricoPaciente(id: number): Promise<HistoricoPaciente[]> {
  const resultado = await api.get<HistoricoPaciente[]>(`/pacientes/${id}/historico`);
  return resultado.data;
}
