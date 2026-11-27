package com.luzdovale.reabilitah.backend.domain.entities;

import com.luzdovale.reabilitah.backend.domain.enuns.EnumStatusDocumento;
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

    @Enumerated(EnumType.STRING)
    private EnumStatusDocumento status = EnumStatusDocumento.PENDENTE;

    private String hash;
    private String caminhoAssinado;

    private boolean ativo = true;
    private LocalDateTime dtCriacao = LocalDateTime.now();
    private LocalDateTime dtAtualizacao;
    private LocalDateTime dtFinalizacao;
    private LocalDateTime dtAssinatura;
    private LocalDateTime dtDesativado;

    public boolean permiteEditar(){
        return this.ativo
                && this.status == EnumStatusDocumento.PENDENTE
                && this.dtAssinatura == null;
    }

    public void finalizar(){
        this.status = EnumStatusDocumento.FINALIZADO;
        this.dtFinalizacao = LocalDateTime.now();
    }

    public void assinar(String caminhoAssinado){
        this.caminhoAssinado = caminhoAssinado;
        this.dtAssinatura = LocalDateTime.now();
        finalizar();
    }

    public void desativar(){
        this.ativo = false;
        this.dtDesativado = LocalDateTime.now();
    }

}
