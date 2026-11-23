export interface Aviso {
    id: number;
    mensagem: string;
    criadoPorId: number;
    criadoPor: string;
    dtCriacao: string;
    dtFinalizacao: string | null;
    ativo: boolean;
    dtDesativado: string | null;
}

export interface CriarAvisoRequest {
    mensagem: string;
    dtFinalizacao?: string | null;
}