export function normalizeSearch(value: string) {
    return value.normalize("NFD").trim().toLowerCase();
}

export function formatarData(data: string) {
    return new Date(data).toLocaleString("pt-BR", {dateStyle: "short",timeStyle: "short"});
}

export function mensagemErro(error: unknown, padrao: string) {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    return padrao;
}

export function calcularIdade(dataNascimento: string | null) {

    if (!dataNascimento) {
        return null;
    }

    const nascimento = new Date(dataNascimento + "T00:00:00");
    const hoje = new Date();

    let idade = hoje.getFullYear() - nascimento.getFullYear();

    const diferencaMes = hoje.getMonth() - nascimento.getMonth();

    if (diferencaMes < 0 || (diferencaMes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade = idade-1;
    }

    return idade;
}