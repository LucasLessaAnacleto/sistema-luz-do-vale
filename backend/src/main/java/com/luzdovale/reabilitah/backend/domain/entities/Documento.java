package com.luzdovale.reabilitah.backend.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

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

    @ManyToOne
    @JoinColumn(name = "documento_origem_id")
    private Documento documentoOrigem;

    @ManyToOne
    @JoinColumn(name = "paciente_id")
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario criadoPor;

    private String observacao;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String dados = "{}";

    private boolean ativo = true;
    private LocalDateTime dtCriacao = LocalDateTime.now();
    private LocalDateTime dtAtualizacao;
    private LocalDateTime dtAssinatura;
    private LocalDateTime dtDesativado;

    public boolean permiteEditar(){
        return this.dtAssinatura == null;
    }

}
