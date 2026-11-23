
import { alterarInformacoesPessoais } from "@/app/services/usuarioService";
import { EditarInformacoesPessoaisRequest, Usuario } from "@/app/types/usuarios";

export interface DadosInformacoesPessoais {
    nome: string;
    email: string;
    telefone: string;
    senhaAtual: string;
    novaSenha: string;
    confirmarSenha: string;
}

export async function actionEditarInformacoesPessoais(usuario: Usuario, dados: DadosInformacoesPessoais): Promise<Usuario> {

    const nome = dados.nome.trim();
    const email = dados.email.trim();
    const telefone = dados.telefone.trim();

    if (!email) {
        throw new Error("Informe o e-mail.");
    }

    const alteracoes: EditarInformacoesPessoaisRequest = {};

    if (usuario.profissionalId !== null && nome !== usuario.nome) {
        if (!nome) {
            throw new Error("Informe o nome completo.");
        }

        alteracoes.nome = nome;
    }

    if (email !== usuario.email) {
        alteracoes.email = email;
    }

    if (usuario.profissionalId !== null && 
        telefone.replace(/\D/g, "") !== (usuario.telefone ?? "").replace(/\D/g, "")
    ) {
        alteracoes.telefone = telefone;
    }

    if (dados.senhaAtual || dados.novaSenha || dados.confirmarSenha) {
        if (!dados.senhaAtual || !dados.novaSenha || !dados.confirmarSenha) {
            throw new Error("Preencha todos os campos para alterar a senha.");
        }

        if (dados.novaSenha !== dados.confirmarSenha) {
            throw new Error("A confirmação da senha não corresponde à nova senha.");
        }

        alteracoes.senhaAtual = dados.senhaAtual;
        alteracoes.novaSenha = dados.novaSenha;
    }

    if (Object.keys(alteracoes).length === 0) {
        throw new Error("Nenhuma alteração para salvar.");
    }

    return alterarInformacoesPessoais(alteracoes);
}
