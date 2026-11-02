package com.luzdovale.reabilitah.backend.domain.valueobjects;

import com.luzdovale.reabilitah.backend.domain.enuns.EnumTipoCampo;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CampoDocumento {
    private String nome;
    private String rotulo;
    private EnumTipoCampo tipo;
    private boolean obrigatorio = true;

    private List<String> opcoes;
    private String tabelaLista;

    private List<CampoDocumento> campos;
    private Integer largura = 12;

    // para preenchimento automatica
    private String origem;

    private boolean somenteLeitura = false;

    public int getLargura(){
        // LARGURA MAXIMA = 12
        return largura != null ? largura : 12;
    }
}
