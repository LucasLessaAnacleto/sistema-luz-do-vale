package com.luzdovale.reabilitah.backend.domain.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class Endereco {

    @Column(name = "endereco_rua")
    private String rua;

    @Column(name = "endereco_nr")
    private String numero;

    @Column(name = "endereco_bairro")
    private String bairro;

    @Column(name = "endereco_municipio")
    private String municipio;

    @Column(name = "endereco_estado")
    private String estado;
}
