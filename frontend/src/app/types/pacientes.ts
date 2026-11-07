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