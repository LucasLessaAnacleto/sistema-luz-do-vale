package com.luzdovale.reabilitah.backend.application.DTO.profissional;

import java.time.LocalDate;

public interface ProfissionalDados {
    String nome();
    String telefone();
    String regProfissional();
    String cpf();
    LocalDate dtNasc();
    String enderecoRua();
    String enderecoNr();
    String enderecoBairro();
    String enderecoMunicipio();
    String enderecoEstado();
}
