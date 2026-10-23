package com.luzdovale.reabilitah.backend.domain.entities;

import com.luzdovale.reabilitah.backend.domain.valueobjects.CPF;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;
    private String apelido;

    @Embedded
    private CPF cpf;

    private String rg;
    private String telefone;

    @Embedded
    private Endereco endereco = new Endereco();

    private LocalDate dtNasc;

    private boolean ativo = true;
    private LocalDateTime dtCriacao = LocalDateTime.now();
    private LocalDateTime dtDesativado;
}
