package com.luzdovale.reabilitah.backend.application.DTO.dash;

public record DashResponse(
    long pacientesAtivos,
    long mediaAcolhimentos,
    long qtdDocumentos,
    long documentosPendentes
) {
}
