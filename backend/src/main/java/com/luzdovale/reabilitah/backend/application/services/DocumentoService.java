package com.luzdovale.reabilitah.backend.application.services;


import com.luzdovale.reabilitah.backend.application.DTO.documento.*;
import com.luzdovale.reabilitah.backend.application.DTO.paciente.FichaAcolhimentoRequest;
import com.luzdovale.reabilitah.backend.application.exceptions.DocumentoDesativadoException;
import com.luzdovale.reabilitah.backend.application.exceptions.DocumentoNaoEncontradoException;
import com.luzdovale.reabilitah.backend.application.exceptions.PacienteNaoEncontradoException;
import com.luzdovale.reabilitah.backend.application.exceptions.UsuarioSemAutorizacao;
import com.luzdovale.reabilitah.backend.domain.entities.*;
import com.luzdovale.reabilitah.backend.domain.enuns.EnumStatusDocumento;
import com.luzdovale.reabilitah.backend.domain.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DocumentoService {
    @Autowired
    private DocumentoRepository documentoRepository;
    @Autowired
    private TipoDocumentoService tipoDocumentoService;
    @Autowired
    private PacienteRepository pacienteRepository;
    @Autowired
    private DocumentoCamposService documentoCamposService;
    @Autowired
    private HistDocumentoService histDocumentoService;

    @Transactional
    public DocumentoResponse criar(CriarDocumentoRequest request, Usuario usuarioLogado) {

        TipoDocumentoVersao versao = tipoDocumentoService.buscarVersaoId(request.tipoDocumentoVersaoId());

        tipoDocumentoService.validarPermissao(versao.getTipoDocumento(), usuarioLogado);

        var paciente = pacienteRepository.findById(request.pacienteId())
                .orElseThrow(() -> new PacienteNaoEncontradoException());

        Documento documentoOrigem = null;

        if (request.documentoOrigemId() != null) {

            documentoOrigem = buscarDocumento(request.documentoOrigemId());

            if (!documentoOrigem.getPaciente().getId().equals(paciente.getId())) {
                throw new IllegalArgumentException(
                        "O documento de origem pertence a outro paciente."
                );
            }

            if (!documentoOrigem.getTipoDocumentoVersao()
                    .getTipoDocumento().getId()
                    .equals(versao.getTipoDocumento().getId())) {

                throw new IllegalArgumentException(
                        "O documento de origem possui outro tipo de documento."
                );
            }
        }

        var campos = documentoCamposService.lerCampos(versao);

        String dadosNormalizados = documentoCamposService
            .validarENormalizarDados(
                    campos,
                    request.dados()
            );

        Documento documento = new Documento();

        documento.setTipoDocumentoVersao(versao);
        documento.setPaciente(paciente);
        documento.setCriadoPor(usuarioLogado);
        documento.setObservacao(request.observacao());
        documento.setDados(dadosNormalizados);
        documento.setDocumentoOrigem(documentoOrigem);

        documento = documentoRepository.save(documento);

        histDocumentoService.registrarHistorico(
            documento,
            paciente,
            usuarioLogado,
            "CRIADO"
        );

        return mapeiaParaDTO(documento);
    }

    @Transactional
    public Documento criarFichaAcolhimento(
            Paciente paciente,
            Responsavel responsavel,
            FichaAcolhimentoRequest ficha,
            Usuario usuarioLogado,
            Documento documentoOrigem
    ) {

        TipoDocumentoVersao versao = tipoDocumentoService.ultimaVersaoFichaAcolhimento();

        var campos =
                documentoCamposService.lerCampos(versao);

        Map<String, Object> dados = documentoCamposService.resolverDadosPadrao(campos,paciente, responsavel);

        completarDadosFicha(dados, ficha);

        String dadosNormalizados =
                documentoCamposService.validarENormalizarDados(
                        campos,
                        dados
                );

        Documento documento = new Documento();

        documento.setTipoDocumentoVersao(versao);
        documento.setPaciente(paciente);
        documento.setCriadoPor(usuarioLogado);
        documento.setDocumentoOrigem(documentoOrigem);
        documento.setDados(dadosNormalizados);

        documento = documentoRepository.save(documento);

        histDocumentoService.registrarHistorico(
                documento,
                paciente,
                usuarioLogado,
                "CRIADO"
        );

        return documento;
    }

    public Page<DocumentoListaResponse> listar(int pagina, EnumStatusDocumento status) {

        var pageable = PageRequest.of(pagina, 50);
        if(status == null){
            return documentoRepository
                .findByAtivoTrueOrderByDtCriacaoDesc(pageable)
                .map(this::mapeiaParaListaDTO);
        }

        return documentoRepository
            .findByAtivoTrueAndStatusOrderByDtCriacaoDesc(status, pageable)
            .map(this::mapeiaParaListaDTO);
    }

    public List<DocumentoListaResponse> listarRecentes() {

        LocalDateTime doisDiasAtras = LocalDateTime.now().minusDays(2);

        return documentoRepository
                .findTop10ByAtivoTrueAndDtCriacaoGreaterThanEqualOrderByDtCriacaoDesc(doisDiasAtras)
                .stream()
                .map(this::mapeiaParaListaDTO)
                .toList();
    }

    public List<DocumentoRelacionadoResponse> listarRelacionados(Long id) {

        Documento documento = buscarDocumento(id);
        List<DocumentoRelacionadoResponse> relacionados = new ArrayList<>();

        if (documento.getDocumentoOrigem() != null) {
            relacionados.add(
                mapeiaRelacionado(documento.getDocumentoOrigem(), "ORIGEM")
            );
        }

        var derivados = documentoRepository.findByDocumentoOrigem(documento);

        derivados.forEach(derivado ->
            relacionados.add(
                mapeiaRelacionado(derivado, "DERIVADO")
            )
        );

        return relacionados;
    }

    public List<HistDocumentoResponse> listarHistorico(Long documentoId) {

        Documento documento = buscarDocumento(documentoId);

        return histDocumentoService.listarPorDocumento(documento);
    }

    public DocumentoDetalhesResponse buscar(Long id) {
        Documento documento = buscarDocumento(id);

        var versao = documento.getTipoDocumentoVersao();
        var usuario = documento.getCriadoPor();

        var campos = documentoCamposService.lerCampos(versao);
        var dados = documentoCamposService.lerDados(documento.getDados());

        String nomeUsuario;

        if (usuario.getProfissional() != null) {
            nomeUsuario = usuario.getProfissional().getNome();
        } else {
            nomeUsuario = usuario.getEmail();
        }

        return new DocumentoDetalhesResponse(
            documento.getId(),
            versao.getTipoDocumento().getId(),
            versao.getTipoDocumento().getNome(),
            versao.getVersao(),
            documento.getPaciente().getId(),
            usuario.getId(),
            nomeUsuario,
            documento.getObservacao(),
            campos,
            dados,
            documento.isAtivo(),
            documento.getStatus(),
            documento.getDtCriacao(),
            documento.getDtAtualizacao(),
            documento.getDtAssinatura(),
            documento.getDtFinalizacao()
        );
    }

    @Transactional
    public void finalizar(Long id, Usuario usuarioLogado){
        Documento documento = buscarDocumento(id);

        if(!usuarioLogado.isAdmin() &&
                (documento.getCriadoPor() == null || !documento.getCriadoPor().getId().equals(usuarioLogado.getId()))){
            throw new UsuarioSemAutorizacao();
        }

        if(!documento.isAtivo()){
            throw new DocumentoDesativadoException();
        }

        if(documento.getStatus() == EnumStatusDocumento.FINALIZADO){
            return;
        }

        documento.finalizar();
        documentoRepository.save(documento);
        histDocumentoService.registrarHistorico(
            documento,
            documento.getPaciente(),
            usuarioLogado,
            "FINALIZADO"
        );
    }

    public long contarDocumentos(){
        return documentoRepository.countByAtivoTrue();
    }

    public long contarDocumentosPendentes(){
        return documentoRepository.countByAtivoTrueAndStatus( EnumStatusDocumento.PENDENTE );
    }

    private void completarDadosFicha(Map<String, Object> dados, FichaAcolhimentoRequest ficha) {

        Map<String, Object> acolhido = (Map<String, Object>) dados.get("acolhido");

        acolhido.put("nacionalidade", ficha.nacionalidade());
        acolhido.put("naturalidade", ficha.naturalidade());
        acolhido.put("nomePai", ficha.nomePai());
        acolhido.put("nomeMae", ficha.nomeMae());
        acolhido.put("escolaridade", ficha.escolaridade());
        acolhido.put("profissao", ficha.profissao());
        acolhido.put("cor", ficha.cor());
        acolhido.put("estadoCivil", ficha.estadoCivil());
        acolhido.put("filhos", ficha.filhos());

        Map<String, Object> dependencia = new HashMap<>();

        dependencia.put("tipos", ficha.tiposDependencia());
        dependencia.put("primeiraDrogaLicita", ficha.primeiraDrogaLicita());
        dependencia.put("idadePrimeiraDrogaLicita", ficha.idadePrimeiraDrogaLicita());
        dependencia.put("primeiraDrogaIlicita", ficha.primeiraDrogaIlicita());
        dependencia.put("idadePrimeiraDrogaIlicita", ficha.idadePrimeiraDrogaIlicita());

        dados.put("dependencia", dependencia);
    }

    private Documento buscarDocumento(Long id) {
        return documentoRepository.findById(id).orElseThrow(DocumentoNaoEncontradoException::new);
    }

    private DocumentoResponse mapeiaParaDTO(Documento documento) {

        var versao = documento.getTipoDocumentoVersao();
        return new DocumentoResponse(
            documento.getId(),
            versao.getTipoDocumento().getId(),
            versao.getTipoDocumento().getNome(),
            versao.getVersao(),
            documento.getPaciente().getId(),
            documento.getCriadoPor().getId(),
            documento.getObservacao(),
            documento.getDados(),
            documento.isAtivo(),
            documento.getStatus(),
            documento.getDtCriacao(),
            documento.getDtAssinatura(),
            documento.getDtFinalizacao()
        );
    }

    private DocumentoListaResponse mapeiaParaListaDTO(Documento documento) {
        var versao = documento.getTipoDocumentoVersao();
        var paciente = documento.getPaciente();
        var usuario = documento.getCriadoPor();

        String nomeUsuario;
        if (usuario.getProfissional() != null) {
            nomeUsuario = usuario.getProfissional().getNome();
        } else {
            nomeUsuario = usuario.getEmail();
        }

        return new DocumentoListaResponse(
            documento.getId(),
            versao.getTipoDocumento().getId(),
            versao.getTipoDocumento().getNome(),
            versao.getVersao(),
            paciente.getId(),
            paciente.getNome(),
            paciente.getApelido(),
            usuario.getId(),
            nomeUsuario,
            documento.isAtivo(),
            documento.getStatus(),
            documento.getDtCriacao(),
            documento.getDtAssinatura(),
            documento.getDtFinalizacao()
        );
    }

    private DocumentoRelacionadoResponse mapeiaRelacionado(Documento documento, String relacao) {
        return new DocumentoRelacionadoResponse(
            documento.getId(),
            documento.getTipoDocumentoVersao().getTipoDocumento().getNome(),
            relacao,
            documento.isAtivo(),
            documento.getStatus(),
            documento.getDtFinalizacao(),
            documento.getDtAssinatura(),
            documento.getDtCriacao()
        );
    }
}