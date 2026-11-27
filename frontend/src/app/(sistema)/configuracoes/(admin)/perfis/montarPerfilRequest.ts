import type { PerfilRequest } from "@/app/types/perfis";

export function montarPerfilRequest(form: FormData): PerfilRequest {

    const tiposDocumento = form.getAll("tiposDocumento")
        .map((tipo) => Number(tipo));

    const dados: PerfilRequest = {

        nome: String(form.get("nome") ?? "").trim(),

        permCadPaciente: form.get("permCadPaciente") === "on",

        tiposDocumento,
    };

    return dados;
}
