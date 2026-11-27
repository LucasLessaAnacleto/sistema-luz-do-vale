package com.luzdovale.reabilitah.backend.application.DTO.perfil;

import java.util.List;

public record PerfilRequest(
    String nome,
    boolean permCadPaciente,
    List<Long> tiposDocumento
) {
}
