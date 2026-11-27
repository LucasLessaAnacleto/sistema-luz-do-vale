import type { AlterarStatusPacienteRequest, Paciente, PacienteDetalhes, PacienteRequest } from "@/app/types/pacientes";
import api from "./api";
import { HistoricoDocumento } from "../types/documentos";

export async function buscarListaPacientes(ativo?: boolean): Promise<Paciente[]> {

    const response = await api.get<Paciente[]>("/pacientes", {
        params: ativo !== undefined ? { ativo } : {},
    });

    return response.data;
}

export async function buscarPaciente(id: number): Promise<PacienteDetalhes> {

    const response = await api.get<PacienteDetalhes>(`/pacientes/${id}`);

    return response.data;
}

export async function buscarHistoricoPaciente(id: number): Promise<HistoricoDocumento[]> {

    const response = await api.get<HistoricoDocumento[]>(`/pacientes/${id}/historico`);

    return response.data;
}


export async function criarPaciente(dados: PacienteRequest): Promise<Paciente> {

    const response = await api.post<Paciente>("/pacientes", dados);

    return response.data;
}

export async function editarPaciente(id: number, dados: PacienteRequest): Promise<Paciente> {
    
    const response = await api.put<Paciente>(`/pacientes/${id}`, dados);

    return response.data;
}


export async function desativarPaciente(id: number, dados: AlterarStatusPacienteRequest): Promise<Paciente> {

    const response = await api.patch<Paciente>(`/pacientes/${id}/desativar`, dados);

    return response.data;
}

export async function reativarPaciente(id: number, dados: AlterarStatusPacienteRequest): Promise<Paciente> {

    const response = await api.patch<Paciente>(`/pacientes/${id}/reativar`, dados);

    return response.data;
}
