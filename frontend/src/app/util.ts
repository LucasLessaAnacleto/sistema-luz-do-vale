export function normalizeSearch(value: string) {
    return value.normalize("NFD").trim().toLowerCase();
}

export function formatarData(data: string) {
    return new Date(data).toLocaleString("pt-BR", {dateStyle: "short",timeStyle: "short"});
}