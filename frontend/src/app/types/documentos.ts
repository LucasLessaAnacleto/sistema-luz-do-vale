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

  campos: CampoDocumento[];
  dados: Record<string, unknown>;

  ativo: boolean;

  dtCriacao: string;
  dtAtualizacao: string | null;
  dtAssinatura: string | null;
}

export interface HistoricoDocumento {
    id: number;
    documentoId: number | null;
    tipoDocumento: string | null;
    acao: string;
    usuarioId: number;
    usuario: string;
    observacao: string | null;
    dtCriacao: string;
}

export interface CriarDocumentoRequest {
    tipoDocumentoVersaoId: number;
    pacienteId: number;
    observacao: string | null;
    dados: Record<string, unknown>;
}

// documentos dinamicos

export type TipoCampoDocumento =
  | "TEXTO"
  | "TEXTO_LONGO"
  | "INTEIRO"
  | "DECIMAL"
  | "DATA"
  | "HORA"
  | "BOOLEANO"
  | "SELECAO"
  | "MULTIPLA_SELECAO"
  | "GRUPO";


export interface CampoDocumento {
  nome: string;
  rotulo: string;
  tipo: TipoCampoDocumento;

  obrigatorio: boolean;

  opcoes: string[] | null;
  tabelaLista: string | null;

  campos: CampoDocumento[] | null;

  largura: number | null;

  origem: string | null;

  somenteLeitura: boolean;
}


export interface OpcaoLista {
  valor: string;
  rotulo: string;
}


export interface TipoDocumento {
  id: number;
  nome: string;
  descricao: string;
  exigeAssinatura: boolean;
}


export interface FormularioDocumento {
  tipoDocumentoId: number;

  nome: string;
  descricao: string;

  exigeAssinatura: boolean;

  versaoId: number;
  versao: number;

  campos: CampoDocumento[];

  listas: Record<string, OpcaoLista[]>;

  dadosPadrao: Record<string, unknown>;
}

