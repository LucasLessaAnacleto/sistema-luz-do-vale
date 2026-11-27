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
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
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
    @Autowired
    private DocumentoPdfService documentoPdfService;
    @Autowired
    private DocumentoTemplateService documentoTemplateService;

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

        if(!versao.getTipoDocumento().isExigeAssinatura()){
            documento.finalizar();
        }

        documento = documentoRepository.save(documento);

        documento.setHash(documentoTemplateService.gerarHashDocumento(documento));
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

        if(!versao.getTipoDocumento().isExigeAssinatura()){
            documento.finalizar();
        }

        documento = documentoRepository.save(documento);

        documento.setHash(documentoTemplateService.gerarHashDocumento(documento));
        documento = documentoRepository.save(documento);

        histDocumentoService.registrarHistorico(
                documento,
                paciente,
                usuarioLogado,
                documentoOrigem == null ? "CRIADO" : "ALTERADO"
        );

        return documento;
    }

    public Page<DocumentoListaResponse> listar(
            int pagina,
            EnumStatusDocumento status,
            String busca,
            Long usuarioId,
            Long pacienteId,
            LocalDate dataInicio,
            LocalDate dataFim,
            boolean ativo
    ) {

        var pageable = PageRequest.of(pagina, 50);

        if(busca == null){
            busca = "";
        }

        boolean temFiltro = !busca.isBlank() || usuarioId != null || pacienteId != null
                || dataInicio != null || dataFim != null || !ativo;

        if(temFiltro){
            return buscar(
                    busca.trim().toLowerCase(),
                    status,
                    usuarioId,
                    pacienteId,
                    dataInicio,
                    dataFim,
                    ativo,
                    pageable
            );
        }

        if(status == null){
            return documentoRepository
                .findByAtivoTrueOrderByDtCriacaoDesc(pageable)
                .map(this::mapeiaParaListaDTO);
        }

        return documentoRepository
            .findByAtivoTrueAndStatusOrderByDtCriacaoDesc(status, pageable)
            .map(this::mapeiaParaListaDTO);
    }

    private Page<DocumentoListaResponse> buscar(
            String busca,
            EnumStatusDocumento status,
            Long usuarioId,
            Long pacienteId,
            LocalDate dataInicio,
            LocalDate dataFim,
            boolean ativo,
            Pageable pageable
    ) {

        List<DocumentoListaResponse> encontrados = new ArrayList<>();

        for(Documento documento : documentoRepository.findAllByAtivoOrderByDtCriacaoDesc(ativo)){

            if(status != null && documento.getStatus() != status){
                continue;
            }

            if(usuarioId != null && !documento.getCriadoPor().getId().equals(usuarioId)){
                continue;
            }

            if(pacienteId != null && !documento.getPaciente().getId().equals(pacienteId)){
                continue;
            }

            LocalDate dataCriacao = documento.getDtCriacao().toLocalDate();

            if(dataInicio != null && dataCriacao.isBefore(dataInicio)){
                continue;
            }

            if(dataFim != null && dataCriacao.isAfter(dataFim)){
                continue;
            }

            String tipo = documento.getTipoDocumentoVersao().getTipoDocumento().getNome().toLowerCase();
            String numero = documento.getId().toString();
            String hash = documento.getHash() != null ? documento.getHash() : "";

            if(tipo.contains(busca) || numero.equals(busca) || hash.startsWith(busca) || hash.endsWith(busca)){
                encontrados.add(mapeiaParaListaDTO(documento));
            }
        }

        int inicio = Math.min((int) pageable.getOffset(), encontrados.size());
        int fim = Math.min(inicio + pageable.getPageSize(), encontrados.size());

        return new PageImpl<>(encontrados.subList(inicio, fim), pageable, encontrados.size());
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
            versao.getTipoDocumento().isExigeAssinatura(),
            documento.getHash(),
            documento.getDtCriacao(),
            documento.getDtAtualizacao(),
            documento.getDtAssinatura(),
            documento.getDtFinalizacao()
        );
    }

    @Transactional
    public void assinar(Long id, MultipartFile arquivo, Usuario usuarioLogado) throws IOException {
        Documento documento = buscarDocumento(id);

        if(!usuarioLogado.isAdmin() &&
                (documento.getCriadoPor() == null || !documento.getCriadoPor().getId().equals(usuarioLogado.getId()))){
            throw new UsuarioSemAutorizacao();
        }

        if(!documento.isAtivo()){
            throw new DocumentoDesativadoException();
        }

        if(!documento.getTipoDocumentoVersao().getTipoDocumento().isExigeAssinatura()){
            throw new IllegalArgumentException("Este tipo de documento não exige assinatura.");
        }

        if(documento.getStatus() == EnumStatusDocumento.FINALIZADO){
            throw new IllegalArgumentException("O documento já foi finalizado.");
        }

        String nomeArquivo = documentoPdfService.salvarAssinado(documento, arquivo);

        documento.assinar(nomeArquivo);
        documentoRepository.save(documento);
        histDocumentoService.registrarHistorico(
            documento,
            documento.getPaciente(),
            usuarioLogado,
            "ASSINADO"
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
            documento.getHash(),
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