package com.luzdovale.reabilitah.backend.application.services;

import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import com.google.gson.reflect.TypeToken;
import com.luzdovale.reabilitah.backend.application.exceptions.CamposDocumentoInvalidosException;
import com.luzdovale.reabilitah.backend.domain.entities.TipoDocumentoVersao;
import com.luzdovale.reabilitah.backend.domain.enuns.EnumTipoCampo;
import com.luzdovale.reabilitah.backend.domain.valueobjects.CampoDocumento;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.lang.reflect.Type;
import java.util.List;

@Service
public class DocumentoCamposService {
    private static final Logger logger = LoggerFactory.getLogger(DocumentoCamposService.class);

    private final Gson gson;
    public DocumentoCamposService(Gson gson) {
        this.gson = gson;
    }

    public List<CampoDocumento> lerCampos(TipoDocumentoVersao versaoDocumento)  {
        var camposJson    = versaoDocumento.getCampos();
        var tipoDocumento = versaoDocumento.getTipoDocumento();

        try{
            Type tipoLista = new TypeToken<List<CampoDocumento>>() {}.getType();
            List<CampoDocumento> campos = gson.fromJson(camposJson, tipoLista);
            validarCampos(campos);

            return campos;
        } catch (JsonParseException | IllegalArgumentException ex) {

            logger.error(
                    "Erro ao interpretar campos do tipo de documento '{}' (tipoId={}, versao={}, versaoId={})",
                    tipoDocumento.getNome(),
                    tipoDocumento.getId(),
                    versaoDocumento.getVersao(),
                    versaoDocumento.getId(),
                    ex
            );
            throw new CamposDocumentoInvalidosException(tipoDocumento.getNome());
        }
    }

    private void validarCampos(List<CampoDocumento> campos) {
        validarCampos(campos, true);
    }

    private void validarCampos(List<CampoDocumento> campos, boolean permiteGrupo){
        for (CampoDocumento campo : campos) {

            if(campo.getNome() == null || campo.getNome().isBlank()){
                throw new IllegalArgumentException("campo \"nome\" é obrigatório");
            }
            if(campo.getRotulo() == null || campo.getRotulo().isBlank()){
                throw new IllegalArgumentException("campo \"rotulo\" é obrigatório");
            }

            if (campo.getTipo() == null) {
                campo.setTipo(EnumTipoCampo.TEXTO);

            } else if (campo.getTipo() == EnumTipoCampo.SELECAO  || campo.getTipo() == EnumTipoCampo.MULTIPLA_SELECAO) {

                if ((campo.getOpcoes() == null || campo.getOpcoes().isEmpty()) &&
                        (campo.getTabelaLista() == null || campo.getTabelaLista().isBlank())) {
                    throw new IllegalArgumentException("campo de tipo SELECAO/MULTIPLA_SELECAO é obrigatório \"opcoes\" ou \"tabelaLista\" definidos");
                }

            } else if (campo.getTipo() == EnumTipoCampo.GRUPO) {

                if (!permiteGrupo) {
                    throw new IllegalArgumentException("campo tipo GRUPO não é permitido de forma aninhada");
                }else if(campo.getCampos() == null || campo.getCampos().isEmpty()){
                    throw new IllegalArgumentException("campo tipo GRUPO é obrigatório \"campos\" definidos");
                }
                validarCampos(campo.getCampos(), false);
            }
            if(campo.getLargura() < 1 || campo.getLargura() > 12){
                campo.setLargura(12);
            }

        }
    }

}
