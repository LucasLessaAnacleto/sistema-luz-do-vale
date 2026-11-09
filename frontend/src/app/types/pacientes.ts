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

export interface ResponsavelRequest {
    nome: string;
    parentesco: string | null;
    cpf: string | null;
    rg: string | null;
    telefone: string | null;
    endereco: Endereco;
    dtNasc: string | null;
}


export interface FichaAcolhimentoRequest {
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
    endereco: Endereco;
    dtNasc: string | null;

    responsavel: ResponsavelRequest;
    fichaAcolhimento: FichaAcolhimentoRequest;
}