package com.luzdovale.reabilitah.backend.application.DTO.dash;

import java.time.LocalDate;

public record AniversarianteResponse(
    Long pacienteId,
    String nome,
    LocalDate dtNasc,
    LocalDate proximoAniversario,
    int idade,
    long diasRestantes
) {
}
