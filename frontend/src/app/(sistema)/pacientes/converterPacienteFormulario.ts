import type { PacienteDetalhes } from "@/app/types/pacientes";

export function converterPacienteFormulario(paciente: PacienteDetalhes): Record<string, string> {

    const responsavel = paciente.responsavel;
    const ficha = paciente.fichaAcolhimento?.dados ?? {};

    const acolhido = (ficha.acolhido ?? {}) as Record<string, unknown>;
    const dependencia = (ficha.dependencia ?? {}) as Record<string, unknown>;

    const texto = (valor: unknown) => valor === null || valor === undefined ? "" : String(valor);

    return {
        nome: texto(paciente.nome),
        apelido: texto(paciente.apelido),
        cpf: texto(paciente.cpf),
        rg: texto(paciente.rg),
        telefone: texto(paciente.telefone),
        dtNasc: texto(paciente.dtNasc),

        rua: texto(paciente.endereco?.rua),
        numero: texto(paciente.endereco?.numero),
        bairro: texto(paciente.endereco?.bairro),
        municipio: texto(paciente.endereco?.municipio),
        estado: texto(paciente.endereco?.estado),

        responsavelNome: texto(responsavel?.nome),
        responsavelParentesco: texto(responsavel?.parentesco),
        responsavelCpf: texto(responsavel?.cpf),
        responsavelRg: texto(responsavel?.rg),
        responsavelTelefone: texto(responsavel?.telefone),
        responsavelDtNasc: texto(responsavel?.dtNasc),

        responsavelRua: texto(responsavel?.endereco?.rua),
        responsavelNumero: texto(responsavel?.endereco?.numero),
        responsavelBairro: texto(responsavel?.endereco?.bairro),
        responsavelMunicipio: texto(responsavel?.endereco?.municipio),
        responsavelEstado: texto(responsavel?.endereco?.estado),

        nacionalidade: texto(acolhido.nacionalidade),
        naturalidade: texto(acolhido.naturalidade),
        nomePai: texto(acolhido.nomePai),
        nomeMae: texto(acolhido.nomeMae),
        escolaridade: texto(acolhido.escolaridade),
        profissao: texto(acolhido.profissao),
        cor: texto(acolhido.cor),
        estadoCivil: texto(acolhido.estadoCivil),
        filhos: texto(acolhido.filhos),

        tiposDependencia: Array.isArray(dependencia.tipos)
            ? dependencia.tipos.join(",")
            : "",

        primeiraDrogaLicita: texto(dependencia.primeiraDrogaLicita),
        idadePrimeiraDrogaLicita: texto(dependencia.idadePrimeiraDrogaLicita),
        primeiraDrogaIlicita: texto(dependencia.primeiraDrogaIlicita),
        idadePrimeiraDrogaIlicita: texto(dependencia.idadePrimeiraDrogaIlicita)
    };
}