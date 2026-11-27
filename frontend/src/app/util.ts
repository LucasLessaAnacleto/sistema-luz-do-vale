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