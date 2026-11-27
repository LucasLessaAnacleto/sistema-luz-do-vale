import type { EditarInformacoesPessoaisRequest, Usuario, UsuarioNome, UsuarioRequest } from "@/app/types/usuarios";
import api from "./api";

export async function buscarUsuarioLogado(): Promise<Usuario> {

    const resultado = await api.get<Usuario>("/usuarios/usuariologado");
    return resultado.data;
}

export async function alterarInformacoesPessoais(dados: EditarInformacoesPessoaisRequest): Promise<Usuario> {

    const response = await api.patch<Usuario>("/usuarios/usuariologado", dados);
    return response.data;
}

export async function buscarListaUsuarios(ativo?: boolean): Promise<Usuario[]> {

    const response = await api.get<Usuario[]>("/usuarios", {
        params: ativo !== undefined ? { ativo } : {},
    });

    if (response.status === 200) {
        return response.data;
    }

    return [];
}

export async function listarNomesUsuarios(): Promise<UsuarioNome[]> {

    const response = await api.get<UsuarioNome[]>("/usuarios/nomes");
    return response.data;
}

export async function buscarUsuario(id: number): Promise<Usuario> {

    const response = await api.get<Usuario>(`/usuarios/${id}`);

    return response.data;
}

export async function criarUsuario(dados: UsuarioRequest): Promise<Usuario> {

    const response = await api.post<Usuario>("/usuarios", dados);

    return response.data;
}

export async function editarUsuario(id: number, dados: UsuarioRequest): Promise<Usuario> {

    const response = await api.put<Usuario>(`/usuarios/${id}`, dados);

    return response.data;
}

export async function alterarStatusUsuario(id: number, ativo: boolean): Promise<Usuario> {

    const response = await api.put<Usuario>(`/usuarios/${id}`, { ativo });

    return response.data;
}

export async function redefinirSenhaUsuario(id: number, senha: string): Promise<void> {

    await api.patch(`/usuarios/${id}/senha`, { senha });
}