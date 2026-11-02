package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.domain.entities.Documento;
import com.luzdovale.reabilitah.backend.domain.entities.HistDocumento;
import com.luzdovale.reabilitah.backend.domain.entities.Paciente;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import com.luzdovale.reabilitah.backend.domain.repository.HistDocumentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HistDocumentoService {
    @Autowired
    private HistDocumentoRepository histDocumentoRepository;

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
}
