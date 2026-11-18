package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.application.DTO.dash.DashResponse;
import com.luzdovale.reabilitah.backend.domain.repository.DocumentoRepository;
import com.luzdovale.reabilitah.backend.domain.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
public class DashService {
    @Autowired
    private PacienteRepository pacienteRepository;
    @Autowired
    private DocumentoRepository documentoRepository;

    public DashResponse indicadoresGerais(){
        var qtdPacienteAtivos = pacienteRepository.countByAtivoTrue();
        var qtdDocumentos = documentoRepository.countDistinctByAtivoTrue();
        var documentosPendentes = documentoRepository.countDistinctByAtivoTrueAndDtAssinaturaIsEmpty();

        return new DashResponse(
            qtdPacienteAtivos,
            mediaAcolhimento(),
            qtdDocumentos,
            documentosPendentes
        );
    }

    private long mediaAcolhimento(){
        LocalDateTime agora = LocalDateTime.now();
        double media = pacienteRepository.findAll().stream()
            .mapToLong(p -> {
                LocalDateTime fim = p.isAtivo() ? agora : p.getDtDesativado();
                return Duration.between(
                    p.getDtCriacao(),
                    fim
                ).toDays();
            }).average().orElse(0d);

        return (long) Math.ceil(media);
    }

}
