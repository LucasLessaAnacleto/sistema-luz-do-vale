export interface Perfil {
    id: number;
    nome: string;
    permCadPaciente: boolean;
    tiposDocumento: number[];
}

export interface PerfilRequest {
    nome: string;
    permCadPaciente: boolean;
    tiposDocumento: number[];
}
