package com.luzdovale.reabilitah.backend.application.DTO.documento;

import java.util.Map;

public record CriarDocumentoRequest(
    Long tipoDocumentoVersaoId,
    Long pacienteId,
    String observacao,
    Map<String, Object> dados
) {
}
