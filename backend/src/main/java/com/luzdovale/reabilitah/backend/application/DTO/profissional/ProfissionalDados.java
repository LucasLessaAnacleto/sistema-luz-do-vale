package com.luzdovale.reabilitah.backend.application.DTO.profissional;

import com.luzdovale.reabilitah.backend.domain.entities.Endereco;

import java.time.LocalDate;

public interface ProfissionalDados {
    String nome();
    String telefone();
    String regProfissional();
    String cpf();
    LocalDate dtNasc();
    Endereco endereco();
}
