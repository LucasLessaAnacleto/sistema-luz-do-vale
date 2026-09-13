'use client'
import { Usuario } from "../types/usuarios";
import api from "./api";



export async function buscarListaUsuarios(): Promise<Usuario[]> {
    const dados = await api.get<Usuario[]>('/usuarios');

    if (dados.status == 200) {
        return dados.data;
    }
    return [];
}
export async function atualizar(usuarioExistente : Usuario): Promise<number> {
    var dadosResult = await api
            .put<number>('http://localhost:8080/usuarios/'+usuarioExistente.id, usuarioExistente);
          
    return dadosResult.data;
    
}

export async function salvar(usuario:Usuario) : Promise<number>{

       var dadosResult = await api.post<number>('http://localhost:8080/usuarios', usuario);

        return dadosResult.data;
}
export async function buscarPorId(codigo:number): Promise<Usuario> {
    return (await api.get<Usuario>('http://localhost:8080/usuarios/'+codigo)).data
}

export async function alterarStatusUsuario(usuario: Usuario): Promise<void> {

    var novoStatus = {};
    if (usuario.status === "ATIVO") {
        novoStatus = { status: "INATIVO" };
    } else {
        novoStatus = { status: "ATIVO" };
    }

    var dadosResult = await api
        .put<number>('/usuarios/' + usuario.id + '/AlterarStatus', novoStatus);

    if (dadosResult.status !== 200) {
        alert("Erro ao atualizar Status!")
    }
}

export async function  buscarUsuarioLogado() : Promise<Usuario> {
     return (await api.get<Usuario>('http://localhost:8080/usuarios/usuariologado')).data;
}

