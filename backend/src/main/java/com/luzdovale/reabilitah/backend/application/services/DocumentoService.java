package com.luzdovale.reabilitah.backend.application.services;


import com.luzdovale.reabilitah.backend.application.DTO.documento.CriarDocumentoRequest;
import com.luzdovale.reabilitah.backend.application.DTO.documento.DocumentoResponse;
import com.luzdovale.reabilitah.backend.application.exceptions.PacienteNaoEncontradoException;
import com.luzdovale.reabilitah.backend.domain.entities.*;
import com.luzdovale.reabilitah.backend.domain.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        TipoDocumentoVersao versao = tipoDocumentoService.ultimaVersaoDocumento(request.tipoDocumentoId());

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


}