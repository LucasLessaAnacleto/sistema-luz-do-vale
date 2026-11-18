package com.luzdovale.reabilitah.backend.application.DTO.dash;

public record DashResponse(
    long pacientesAtivos,
    double mediaAcolhimentos,
    long qtdDocumentos,
    long pendentesAssinatura
) {
}
