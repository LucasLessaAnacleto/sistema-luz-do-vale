package com.luzdovale.reabilitah.backend.domain.entities;

import com.luzdovale.reabilitah.backend.domain.valueobjects.CPF;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Profissional {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String telefone;
    private String regProfissional;

    @Embedded
    private CPF CPF;

    @Embedded
    private Endereco endereco = new Endereco();

    private LocalDate dtNasc;

}
