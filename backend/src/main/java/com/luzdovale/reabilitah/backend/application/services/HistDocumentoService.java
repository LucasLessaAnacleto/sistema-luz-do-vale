package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.application.DTO.documento.HistDocumentoResponse;
import com.luzdovale.reabilitah.backend.application.exceptions.PacienteNaoEncontradoException;
import com.luzdovale.reabilitah.backend.domain.entities.*;
import com.luzdovale.reabilitah.backend.domain.repository.HistDocumentoRepository;
import com.luzdovale.reabilitah.backend.domain.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HistDocumentoService {
    @Autowired
    private HistDocumentoRepository histDocumentoRepository;
    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private PacienteRepository pacienteRepository;

    public List<HistDocumentoResponse> listarPorPaciente(Long pacienteId, Long usuarioId) {
        var paciente = pacienteRepository.findById(pacienteId).orElseThrow(() -> new PacienteNaoEncontradoException(pacienteId));
        List<HistDocumento> historicos;

        if(usuarioId != null) {
            Usuario criadoPor = usuarioService.buscarPorId(usuarioId);

            historicos = histDocumentoRepository
                    .findByPacienteAndCriadoPorOrderByDtCriacaoDesc(
                        paciente,
                        criadoPor
                    );
        }else{
            historicos = histDocumentoRepository.findByPacienteOrderByDtCriacaoDesc(paciente);
        }
        return historicos
                .stream().map(this::mapeiaParaDTO).toList();
    }

    public List<HistDocumentoResponse> listarPorDocumento(Documento documento) {
        return histDocumentoRepository
                .findByDocumentoOrderByDtCriacaoDesc(documento)
                .stream()
                .map(this::mapeiaParaDTO)
                .toList();
    }

    public void registrarHistorico(
           Documento documento,
           Paciente paciente,
           Usuario usuario,
           String acao
    ) {
        registrarHistorico(documento, paciente, usuario, acao, null);
    }

    public void registrarHistorico(
            Documento documento,
            Paciente paciente,
            Usuario usuario,
            String acao,
            String observacao
    ) {
        if(acao == null || acao.isBlank()){
            throw new IllegalArgumentException("Ação deve ser informada para registrar o historico");
        }
        HistDocumento historico = new HistDocumento();

        historico.setDocumento(documento);
        historico.setPaciente(paciente);
        historico.setCriadoPor(usuario);
        historico.setAcao(acao);
        historico.setObservacao(observacao != null ? observacao : "");

        histDocumentoRepository.save(historico);
    }

    private HistDocumentoResponse mapeiaParaDTO(HistDocumento histDocumento) {
        Long documentoId = null;
        String nomeTipoDocumento = null;

        Usuario usuario = histDocumento.getCriadoPor();

        String nomeUsuario;
        if (usuario.getProfissional() != null) {
            nomeUsuario = usuario.getProfissional().getNome();
        } else {
            nomeUsuario = usuario.getEmail();
        }

        if (histDocumento.getDocumento() != null) {
            documentoId = histDocumento.getDocumento().getId();

            if (histDocumento.getDocumento().getTipoDocumentoVersao() != null) {
                nomeTipoDocumento = histDocumento
                        .getDocumento()
                        .getTipoDocumentoVersao()
                        .getTipoDocumento()
                        .getNome();
            }
        }

        return new HistDocumentoResponse(
                histDocumento.getId(),
                documentoId,
                nomeTipoDocumento,
                histDocumento.getAcao(),
                usuario.getId(),
                nomeUsuario,
                histDocumento.getObservacao(),
                histDocumento.getDtCriacao()
        );
    }

}
