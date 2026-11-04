import type { Endereco } from "./endereco";

export interface Responsavel {
  id: number;
  nome: string;
  parentesco: string | null;
  cpf: string | null;
  rg: string | null;
  telefone: string | null;
  endereco: Endereco | null;
  dtNasc: string | null;
}

export interface Paciente {
  id: number;
  nome: string;
  apelido: string | null;
  cpf: string | null;
  rg: string | null;
  telefone: string | null;
  endereco: Endereco | null;
  dtNasc: string | null;
  ativo: boolean;
  dtCriacao: string;
  dtDesativado: string | null;
  responsavel: Responsavel | null;
}

// Mantidos enquanto o prontuário usa os dados de demonstração.
export interface PatientField {
  label: string;
  value: string;
}

export interface PatientPreview {
  id: number;
  name: string;
  nickname: string;
  age: number;
  birthDate: string;
  admission: string;
  lastUpdate: string | null;
  fields: PatientField[];
  dependencies: string[];
  dependencyHistory: PatientField[];
  responsibles: PatientField[][];
}
