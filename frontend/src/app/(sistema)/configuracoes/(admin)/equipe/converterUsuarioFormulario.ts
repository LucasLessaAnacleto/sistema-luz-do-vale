import type { Usuario } from "@/app/types/usuarios";

export function converterUsuarioFormulario(usuario: Usuario): Record<string, string> {

    const texto = (valor: unknown) => valor === null || valor === undefined ? "" : String(valor);

    return {
        nome: texto(usuario.nome),
        cpf: texto(usuario.cpf),
        dtNasc: texto(usuario.dtNasc),
        telefone: texto(usuario.telefone),
        regProfissional: texto(usuario.regProfissional),

        rua: texto(usuario.endereco?.rua),
        numero: texto(usuario.endereco?.numero),
        bairro: texto(usuario.endereco?.bairro),
        municipio: texto(usuario.endereco?.municipio),
        estado: texto(usuario.endereco?.estado),

        email: texto(usuario.email),
        role: texto(usuario.role),
        perfilId: texto(usuario.perfilId)
    };
}
