export interface Documento {
  id: number;

  tipoDocumentoId: number;
  tipoDocumento: string;
  versao: number;

  pacienteId: number;

  criadoPorId: number;

  observacao: string | null;
  dados: string;

  ativo: boolean;

  dtCriacao: string;
  dtAssinatura: string | null;
}

export interface DocumentoLista {
  id: number;

  tipoDocumentoId: number;
  tipoDocumento: string;
  versao: number;

  pacienteId: number;
  paciente: string;
  apelido: string | null;

  criadoPorId: number;
  criadoPor: string;

  ativo: boolean;

  dtCriacao: string;
  dtAssinatura: string | null;
}

export interface DocumentoDetalhes {
  id: number;

  tipoDocumentoId: number;
  tipoDocumento: string;
  versao: number;

  pacienteId: number;

  criadoPorId: number;
  criadoPor: string;

  observacao: string | null;

  campos: string;
  dados: Record<string, unknown>;

  ativo: boolean;

  dtCriacao: string;
  dtAtualizacao: string | null;
  dtAssinatura: string | null;
}