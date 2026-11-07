package com.luzdovale.reabilitah.backend.application.services;


import com.luzdovale.reabilitah.backend.application.DTO.documento.*;
import com.luzdovale.reabilitah.backend.application.exceptions.DocumentoNaoEncontradoException;
import com.luzdovale.reabilitah.backend.domain.entities.*;
import com.luzdovale.reabilitah.backend.domain.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class DocumentoService {
    @Autowired
    private DocumentoRepository documentoRepository;
    @Autowired
    private TipoDocumentoService tipoDocumentoService;
    @Autowired
    private PacienteService pacienteService;
    @Autowired
    private DocumentoCamposService documentoCamposService;
    @Autowired
    private HistDocumentoService histDocumentoService;

    @Transactional
    public DocumentoResponse criar(CriarDocumentoRequest request, Usuario usuarioLogado) {

        TipoDocumentoVersao versao = tipoDocumentoService.buscarVersaoId(request.tipoDocumentoVersaoId());

        var paciente = pacienteService.buscarPaciente(request.pacienteId());

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

        documento = documentoRepository.save(documento);

        histDocumentoService.registrarHistorico(
            documento,
            paciente,
            usuarioLogado,
            "CRIADO"
        );

        return mapeiaParaDTO(documento);
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
                documento.getDtCriacao(),
                documento.getDtAtualizacao(),
                documento.getDtAssinatura()
        );
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
                documento.getDtCriacao(),
                documento.getDtAssinatura()
        );
    }

    private DocumentoRelacionadoResponse mapeiaRelacionado(Documento documento, String relacao) {

        return new DocumentoRelacionadoResponse(
                documento.getId(),
                documento.getTipoDocumentoVersao()
                        .getTipoDocumento()
                        .getNome(),
                relacao,
                documento.getDtCriacao(),
                documento.getDtAssinatura(),
                documento.isAtivo()
        );
    }


}