package com.luzdovale.reabilitah.backend.application.DTO.tipoDocumento;

public record TipoDocumentoResponse(
    Long id,
    String nome,
    String descricao,
    boolean exigeAssinatura
) {
}
