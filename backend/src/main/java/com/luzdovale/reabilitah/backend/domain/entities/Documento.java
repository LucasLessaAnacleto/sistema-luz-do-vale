package com.luzdovale.reabilitah.backend.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Documento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tipo_documento_versao_id")
    private TipoDocumentoVersao tipoDocumentoVersao;

    @OneToOne
    @JoinColumn(name = "documento_origem_id")
    private Documento documentoOrigem;

    @ManyToOne
    @JoinColumn(name = "paciente_id")
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    private String observacao;
    private String dados;

    private boolean ativo = true;
    private LocalDateTime dtCriacao = LocalDateTime.now();
    private LocalDateTime dtAtualizacao;
    private LocalDateTime dtDesativado;

}
