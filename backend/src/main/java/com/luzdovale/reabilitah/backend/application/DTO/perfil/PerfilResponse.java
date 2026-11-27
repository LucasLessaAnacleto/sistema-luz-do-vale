package com.luzdovale.reabilitah.backend.application.DTO.perfil;

import java.util.List;

public record PerfilResponse(
    Long id,
    String nome,
    boolean permCadPaciente,
    List<Long> tiposDocumento
) {
}
