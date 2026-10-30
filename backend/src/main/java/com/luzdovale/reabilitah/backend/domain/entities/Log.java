package com.luzdovale.reabilitah.backend.domain.entities;

import com.luzdovale.reabilitah.backend.domain.enuns.EnumTipoLog;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Log {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    private EnumTipoLog tipo;

    private String acao;
    private String descricao;
    private LocalDateTime dtCriacao = LocalDateTime.now();
}
