package com.luzdovale.reabilitah.backend.application.services;

import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import com.google.gson.reflect.TypeToken;
import com.luzdovale.reabilitah.backend.application.DTO.documento.OpcaoLista;
import com.luzdovale.reabilitah.backend.application.exceptions.CamposDocumentoInvalidosException;
import com.luzdovale.reabilitah.backend.application.exceptions.DadosDocumentoInvalidosException;
import com.luzdovale.reabilitah.backend.domain.entities.Paciente;
import com.luzdovale.reabilitah.backend.domain.entities.Responsavel;
import com.luzdovale.reabilitah.backend.domain.entities.TipoDependencia;
import com.luzdovale.reabilitah.backend.domain.entities.TipoDocumentoVersao;
import com.luzdovale.reabilitah.backend.domain.enuns.EnumTipoCampo;
import com.luzdovale.reabilitah.backend.domain.repository.TipoDependenciaRepository;
import com.luzdovale.reabilitah.backend.domain.valueobjects.CampoDocumento;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private TipoDependenciaRepository tipoDependenciaRepository;

    public List<OpcaoLista> buscaListaOpcao(String nomeLista) {

        if(nomeLista.startsWith("TIPO_DEPENDENCIA")){
            List<TipoDependencia> dependencias = tipoDependenciaRepository.findAllByOrderByNomeAsc();

            if ("TIPO_DEPENDENCIA_LICITA".equals(nomeLista)) {
                dependencias = dependencias.stream().filter(dep -> dep.getCategoria() == 1).toList();
            }

            if ("TIPO_DEPENDENCIA_ILICITA".equals(nomeLista)) {
                dependencias = dependencias.stream().filter(dep -> dep.getCategoria() == 2).toList();
            }

            return dependencias.stream().map(dep -> new OpcaoLista(String.valueOf(dep.getId()), dep.getNome()))
                    .toList();
        }

        throw new IllegalArgumentException(
                "Lista \"%s\" não encontrada.".formatted(nomeLista)
        );
    }

    public Map<String, List<OpcaoLista>> resolverListas(List<CampoDocumento> campos) {
        Map<String, List<OpcaoLista>> listas = new HashMap<>();

        resolverListasOpcoes(campos, listas);

        return listas;
    }

    public Map<String, Object> resolverDadosPadrao(List<CampoDocumento> campos, Paciente paciente, Responsavel responsavel) {

        Map<String, Object> dados = new HashMap<>();
        for (CampoDocumento campo : campos) {

            if (campo.getTipo() == EnumTipoCampo.GRUPO) {

                var dadosGrupo = resolverDadosPadrao(campo.getCampos(), paciente, responsavel);

                if (!dadosGrupo.isEmpty()) {
                    dados.put(campo.getNome(),dadosGrupo);
                }

                continue;
            }

            if (campo.getOrigem() == null || campo.getOrigem().isBlank()) {
                continue;
            }

            Object valor = resolverOrigem(campo.getOrigem(), paciente, responsavel);

            if (valor != null) {
                dados.put(campo.getNome(), valor);
            }
        }

        return dados;
    }

    public Map<String, Object> lerDados(String dadosJson) {
        Type tipoMap = new TypeToken<Map<String, Object>>() {}.getType();
        return gson.fromJson(dadosJson, tipoMap);
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

    private Object resolverOrigem(String origem, Paciente paciente, Responsavel responsavel) {

        return switch (origem) {

            case "PACIENTE.nome" -> paciente.getNome();

            case "PACIENTE.cpf" -> paciente.getCpf() != null ? paciente.getCpf().toString() : null;

            case "PACIENTE.rg" -> paciente.getRg();

            case "PACIENTE.telefone" -> paciente.getTelefone();

            case "PACIENTE.dtNasc" -> paciente.getDtNasc() != null
                ? paciente.getDtNasc().toString() : null;

            case "PACIENTE.endereco.rua" -> paciente.getEndereco() != null
                ? paciente.getEndereco().getRua() : null;

            case "PACIENTE.endereco.numero" -> paciente.getEndereco() != null
                ? paciente.getEndereco().getNumero() : null;

            case "PACIENTE.endereco.bairro" -> paciente.getEndereco() != null
                ? paciente.getEndereco().getBairro() : null;

            case "PACIENTE.endereco.municipio" -> paciente.getEndereco() != null
                ? paciente.getEndereco().getMunicipio() : null;

            case "PACIENTE.endereco.estado" -> paciente.getEndereco() != null
                ? paciente.getEndereco().getEstado() : null;

            case "RESPONSAVEL.nome" -> responsavel != null
                ? responsavel.getNome() : null;

            case "RESPONSAVEL.parentesco" -> responsavel != null
                ? responsavel.getParentesco() : null;

            case "RESPONSAVEL.cpf" -> responsavel != null && responsavel.getCpf() != null
                ? responsavel.getCpf().toString() : null;

            case "RESPONSAVEL.rg" -> responsavel != null
                ? responsavel.getRg() : null;

            case "RESPONSAVEL.telefone" -> responsavel != null
                ? responsavel.getTelefone() : null;

            case "RESPONSAVEL.endereco.rua" -> responsavel != null && responsavel.getEndereco() != null
                ? responsavel.getEndereco().getRua() : null;

            case "RESPONSAVEL.endereco.numero" -> responsavel != null && responsavel.getEndereco() != null
                ? responsavel.getEndereco().getNumero() : null;

            case "RESPONSAVEL.endereco.bairro" -> responsavel != null && responsavel.getEndereco() != null
                ? responsavel.getEndereco().getBairro() : null;

            case "RESPONSAVEL.endereco.municipio" -> responsavel != null && responsavel.getEndereco() != null
                ? responsavel.getEndereco().getMunicipio() : null;

            case "RESPONSAVEL.endereco.estado" -> responsavel != null && responsavel.getEndereco() != null
                ? responsavel.getEndereco().getEstado() : null;

            default -> null;
        };
    }

    private void resolverListasOpcoes(List<CampoDocumento> campos, Map<String, List<OpcaoLista>> listas){
        for (CampoDocumento campo : campos){
            String nomeLista = campo.getTabelaLista();

            if(nomeLista != null && !nomeLista.isBlank()){
                if(!listas.containsKey(nomeLista)){
                    listas.put(nomeLista, buscaListaOpcao(nomeLista));
                }
            }

            if(campo.getTipo() == EnumTipoCampo.GRUPO && campo.getCampos() != null){
                resolverListasOpcoes(campo.getCampos(), listas);
            }
        }
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
        if(input instanceof Number){
            Number numero = (Number) input;
            if(isInteiro){
                return numero.intValue();
            }
            return numero.doubleValue();
        }
        if(input instanceof String){

            try{
                if(isInteiro) {
                    return Integer.valueOf((String) input);
                }
                return Double.valueOf((String) input);

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

    private String validarData(CampoDocumento campo, Object input) {
        if(input instanceof LocalDate){
            return ((LocalDate) input).toString();
        }
        if(input instanceof String) {
            try{
                return LocalDate.parse((String) input).toString();
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
        if(campo.getOpcoes() != null && !campo.getOpcoes().isEmpty()) {
            if (campo.getOpcoes().contains(valor)) {
                return valor;
            }
        }else if(campo.getTabelaLista() != null && !campo.getTabelaLista().isBlank()){
            var opcoes = buscaListaOpcao(campo.getTabelaLista());
            boolean existe = opcoes.stream().anyMatch(opcao -> opcao.valor().equals(valor));
            if (existe) {
                return valor;
            }
        }
        throw new DadosDocumentoInvalidosException(
            "Campo \"%s\" com valor \"%s\" não é uma opção válida."
                .formatted(campo.getRotulo(), valor)
        );
    }

    private List<String> validarMultiplaSelecao(CampoDocumento campo, Object input) {
        if(!(input instanceof List<?>)){
            throw new DadosDocumentoInvalidosException(
                    "Campo \"%s\" deve ser uma lista de valores"
                            .formatted(campo.getRotulo())
            );
        }
        List<?> valores = (List<?>) input;
        List<String> valoresValidos;

        if (campo.getOpcoes() != null && !campo.getOpcoes().isEmpty()) {
            valoresValidos = campo.getOpcoes();
        } else {
            valoresValidos = buscaListaOpcao(campo.getTabelaLista()).stream().map(op -> op.valor())
                .toList();
        }
        List<String> resultado = new ArrayList<>();

        for(Object item : valores){
            String valor = String.valueOf(item);

            if(!valoresValidos.contains(valor)){
                throw new DadosDocumentoInvalidosException("Campo \"%s\" com valor \"%s\" não é uma opção válida."
                    .formatted(campo.getRotulo(), valor)
                );

            }
            resultado.add(valor);
        }
        return resultado;
    }

    private Map<String, Object> validarGrupo(CampoDocumento campo, Object input) {
        if (!(input instanceof Map<?, ?>)) {
            throw new DadosDocumentoInvalidosException("Campo \"%s\" deve ser um objeto".formatted(campo.getRotulo()));
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
                throw new IllegalArgumentException("campo \"tipo\" é obrigatório");
            }

            if (campo.getTipo() == EnumTipoCampo.SELECAO  || campo.getTipo() == EnumTipoCampo.MULTIPLA_SELECAO) {

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
