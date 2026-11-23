export interface DashResponse {
    pacientesAtivos: number;
    mediaAcolhimentos: number;
    qtdDocumentos: number;
    documentosPendentes: number;
}

export interface AniversarioResponse {
    pacienteId: number,
    nome: string,
    dtNasc: string,
    proximoAniversario: string,
    idade: number,
    diasRestantes: number
}