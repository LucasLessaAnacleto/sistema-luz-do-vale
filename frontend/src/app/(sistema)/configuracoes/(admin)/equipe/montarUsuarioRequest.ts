import type { UsuarioRequest } from "@/app/types/usuarios";

export function montarUsuarioRequest(form: FormData): UsuarioRequest {

    const valorTexto = (campo: string): string => {
        return String(form.get(campo) ?? "").trim();
    };

    const dados: UsuarioRequest = {

        nome: valorTexto("nome"),
        cpf: valorTexto("cpf"),
        dtNasc: valorTexto("dtNasc") || null,
        telefone: valorTexto("telefone"),
        regProfissional: valorTexto("regProfissional"),

        endereco: {
            rua: valorTexto("rua"),
            numero: valorTexto("numero"),
            bairro: valorTexto("bairro"),
            municipio: valorTexto("municipio"),
            estado: valorTexto("estado"),
        },

        email: valorTexto("email"),
        role: valorTexto("role") === "ROLE_ADMIN" ? "ROLE_ADMIN" : "ROLE_USER",

        // perfilId 0 = sem perfil
        perfilId: Number(valorTexto("perfilId")),
    };

    const senha = String(form.get("senha") ?? "");

    if (senha) {
        dados.senha = senha;
    }

    return dados;
}
