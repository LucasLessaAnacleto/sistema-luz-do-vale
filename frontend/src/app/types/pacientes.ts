import type { Endereco } from "./endereco";

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
  fichaDocumentoId: number | null;
}

export interface FichaAcolhimento {
  nacionalidade: string | null;
  naturalidade: string | null;
  nomePai: string | null;
  nomeMae: string | null;
  escolaridade: string | null;
  profissao: string | null;
  cor: string | null;
  estadoCivil: string | null;
  filhos: boolean | null;
  tiposDependencia: string[];
  primeiraDrogaLicita: string | null;
  idadePrimeiraDrogaLicita: number | null;
  primeiraDrogaIlicita: string | null;
  idadePrimeiraDrogaIlicita: number | null;
}

export interface PacienteRequest {
  nome: string;
  apelido: string | null;
  cpf: string;
  rg: string;
  telefone: string | null;
  endereco: Endereco | null;
  dtNasc: string | null;
  responsavel: Omit<Responsavel, "id">;
  fichaAcolhimento: FichaAcolhimento;
}

export interface OpcaoDependencia {
  valor: string;
  rotulo: string;
}

export interface OpcoesDependencia {
  tipos: OpcaoDependencia[];
  licitas: OpcaoDependencia[];
  ilicitas: OpcaoDependencia[];
}

export interface FichaPaciente {
  dados: {
    acolhido?: Partial<Pick<FichaAcolhimento, "nacionalidade" | "naturalidade" | "nomePai" | "nomeMae" | "escolaridade" | "profissao" | "cor" | "estadoCivil" | "filhos">>;
    dependencia?: {
      tipos?: string[];
      primeiraDrogaLicita?: string;
      idadePrimeiraDrogaLicita?: number;
      primeiraDrogaIlicita?: string;
      idadePrimeiraDrogaIlicita?: number;
    };
  };
}

export interface HistoricoPaciente {
  id: number;
  documentoId: number | null;
  tipoDocumento: string | null;
  acao: string;
  usuario: string;
  observacao: string | null;
  dtCriacao: string;
}
