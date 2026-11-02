package com.luzdovale.reabilitah.backend.application.services;

import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import com.google.gson.reflect.TypeToken;
import com.luzdovale.reabilitah.backend.application.exceptions.CamposDocumentoInvalidosException;
import com.luzdovale.reabilitah.backend.application.exceptions.DadosDocumentoInvalidosException;
import com.luzdovale.reabilitah.backend.domain.entities.TipoDocumentoVersao;
import com.luzdovale.reabilitah.backend.domain.enuns.EnumTipoCampo;
import com.luzdovale.reabilitah.backend.domain.valueobjects.CampoDocumento;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DocumentoCamposService {
    private static final Logger logger = LoggerFactory.getLogger(DocumentoCamposService.class);

    private final Gson gson;
    public DocumentoCamposService(Gson gson) {
        this.gson = gson;
    }

    public List<Map.Entry<String, String>> buscaListaOpcao(String nomeLista){
        // if(nomeLista.equals("DROGAS_ILICITAS")){
        //    return TipoDependenciaRepository.findByCategoriaILICITA()
        //          .steam()
        //          .map(d -> Map.entry(String.valueOf(d.getId()), d.getNome())
        //          .toList();
        // }
        return List.of();
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

    public String validarENormalizarDados(List<CampoDocumento> campos, Map<String, Object> dados) {
        Map<String, Object> dadosNormalizados =
                normalizarDados(campos, dados);

        return gson.toJson(dadosNormalizados);
    }

    private Map<String, Object> normalizarDados(
            List<CampoDocumento> campos,
            Map<String, Object> dados
    ) {
        var documento = new HashMap<String, Object>();
        for (CampoDocumento campo : campos) {
            String nomeCampo = campo.getNome();

            if (!dados.containsKey(nomeCampo) || dados.get(nomeCampo) == null ) {
                if (campo.isObrigatorio()) {
                    throw new DadosDocumentoInvalidosException("Campo \"%s\" é obrigatório.".formatted(campo.getRotulo()));
                }
                continue;
            }

            Object valor = validaValorCampo(campo, dados.get(nomeCampo));

            documento.put(nomeCampo, valor);
        }

        return documento;
    }

    private Object validaValorCampo(
            CampoDocumento campo,
            Object input
    ) {
        var tipo = campo.getTipo();

        if (tipo == EnumTipoCampo.TEXTO ||
                tipo == EnumTipoCampo.TEXTO_LONGO) {

            return validarTexto(campo, input);

        } else if (tipo == EnumTipoCampo.INTEIRO || tipo == EnumTipoCampo.DECIMAL) {

            return validarNumero(campo, input);

        } else if (tipo == EnumTipoCampo.BOOLEANO) {

            return validarBooleano(campo, input);

        } else if (tipo == EnumTipoCampo.DATA) {

            return validarData(campo, input);

        } else if (tipo == EnumTipoCampo.SELECAO) {

            return validarSelecao(campo, input);

        } else if (tipo == EnumTipoCampo.MULTIPLA_SELECAO) {

            return validarMultiplaSelecao(campo, input);

        } else if (tipo == EnumTipoCampo.GRUPO) {

            return validarGrupo(campo, input);
        }

        return input;
    }

    private String validarTexto(CampoDocumento campo, Object input) {
        if(!(input instanceof String)){
            throw new DadosDocumentoInvalidosException(
                    "Campo \"%s\" %s.".formatted(campo.getRotulo(), "deve ser um texto")
            );
        }
        String valor = (String) input;
        if(campo.isObrigatorio() && valor.isBlank()){
            throw new DadosDocumentoInvalidosException(
                    "Campo \"%s\" %s.".formatted(campo.getRotulo(), "não pode ser vazio")
            );
        }
        return valor;
    }

    private Number validarNumero(CampoDocumento campo, Object input) {
        boolean isInteiro = campo.getTipo() == EnumTipoCampo.INTEIRO;
        if(isInteiro && input instanceof Integer){
            return (Integer) input;
        }
        if(!isInteiro && input instanceof Float){
            return (Float) input;
        }
        if(input instanceof String){

            try{
                if(isInteiro) {
                    return Integer.valueOf((String) input);
                }else{
                    return Float.valueOf((String) input);
                }
            }catch (NumberFormatException e){
                throw new DadosDocumentoInvalidosException(
                        "Campo \"%s\" possui valor inválido para um %s.".formatted(campo.getRotulo(), isInteiro ? "inteiro" : "número")
                );
            }
        }

        throw new DadosDocumentoInvalidosException(
                "Campo \"%s\" %s.".formatted(campo.getRotulo(), "deve ser um número")
        );
    }

    private Boolean validarBooleano(CampoDocumento campo, Object input) {
        if (input instanceof Boolean) {
            return (Boolean) input;
        }

        if (input instanceof String) {
            String valor = (String) input;
            if ("true".equalsIgnoreCase(valor)) {
                return true;
            }

            if ("false".equalsIgnoreCase(valor)) {
                return false;
            }
        }

        throw new DadosDocumentoInvalidosException("Campo \"%s\" %s.".formatted(campo.getRotulo(), "deve ser  verdadeiro ou falso"));
    }

    private LocalDate validarData(CampoDocumento campo, Object input) {
        if(input instanceof LocalDate){
            return (LocalDate) input;
        }
        if(input instanceof String) {
            try{
                return LocalDate.parse((String) input);
            }catch (DateTimeParseException ex){}
        }
        throw new DadosDocumentoInvalidosException("Campo \"%s\" %s.".formatted(
                campo.getRotulo(),
                "deve ser uma data válida no formato YYYY-MM-DD"
            )
        );
    }

    private String validarSelecao(CampoDocumento campo, Object input) {
        String valor = String.valueOf(input);
        if(campo.getOpcoes() != null) {
            if (campo.getOpcoes().contains(valor)) {
                return valor;
            }
        }else{
            // verificar se existe o codigo na tabela?
            return String.valueOf(input);
        }
        throw new DadosDocumentoInvalidosException(
            "Campo \"%s\" com valor \"%s\" não é uma opção válida."
                .formatted(campo.getRotulo(), valor)
        );
    }

    private List<String> validarMultiplaSelecao(CampoDocumento campo, Object input) {
        if(!(input instanceof List<?>)){
            throw new DadosDocumentoInvalidosException("Campo \"%s\" deve ser uma lista de valores");
        }
        List<?> valores = (List<?>) input;
        List<String> lista = new ArrayList<>();

        for(Object item : valores){
            lista.add(validarSelecao(campo, item));
        }
        return lista;
    }

    private Map<String, Object> validarGrupo(CampoDocumento campo, Object input) {
        if (!(input instanceof Map<?, ?>)) {
            throw new DadosDocumentoInvalidosException("Campo \"%s\" deve ser um objeto");
        }
        Map<?, ?> inputGrupo = (Map<?, ?>) input;
        Map<String, Object> dadosGrupo = new HashMap<>();

        inputGrupo.forEach((chave, valor) ->
            dadosGrupo.put(String.valueOf(chave), valor)
        );

        return normalizarDados(campo.getCampos(), dadosGrupo);
    }

    private void validarCampos(List<CampoDocumento> campos) {
        validarCampos(campos, true);
    }

    private void validarCampos(List<CampoDocumento> campos, boolean permiteGrupo){
        if(campos == null || campos.isEmpty())
            throw new IllegalArgumentException("JSON dos campos do TIPO_DOCUMENTO não definido");

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
