package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.application.DTO.documento.HistDocumentoResponse;
import com.luzdovale.reabilitah.backend.domain.entities.*;
import com.luzdovale.reabilitah.backend.domain.repository.HistDocumentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.print.Doc;
import java.util.List;

@Service
public class HistDocumentoService {
    @Autowired
    private HistDocumentoRepository histDocumentoRepository;
    @Autowired
    private PacienteService pacienteService;

    public List<HistDocumentoResponse> listarPorPaciente(Long pacienteId) {
        var paciente = pacienteService.buscarPaciente(pacienteId);
        return histDocumentoRepository.findByPacienteOrderByDtCriacaoDesc(paciente)
                .stream().map(this::mapeiaParaDTO).toList();
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
