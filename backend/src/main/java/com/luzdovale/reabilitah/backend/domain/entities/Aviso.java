package com.luzdovale.reabilitah.backend.domain.entities;

import com.luzdovale.reabilitah.backend.application.exceptions.AvisoDtFinalizacaoFuturaException;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Aviso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario criadoPor;

    @Column(nullable = false)
    private String mensagem;

    private LocalDateTime dtCriacao = LocalDateTime.now();
    private LocalDateTime dtFinalizacao;
    private boolean ativo = true;
    private LocalDateTime dtDesativado;

    public void setDtFinalizacao(LocalDateTime dtFinalizacao){
        if(dtFinalizacao == null) return;
        if(LocalDateTime.now().isAfter(dtFinalizacao))
            throw new AvisoDtFinalizacaoFuturaException();
        this.dtFinalizacao = dtFinalizacao;
    }
}
