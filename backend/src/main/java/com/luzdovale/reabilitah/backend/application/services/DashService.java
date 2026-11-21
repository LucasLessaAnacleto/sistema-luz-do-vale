package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.application.DTO.dash.DashResponse;
import com.luzdovale.reabilitah.backend.domain.enuns.EnumStatusDocumento;
import com.luzdovale.reabilitah.backend.domain.repository.DocumentoRepository;
import com.luzdovale.reabilitah.backend.domain.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.YearMonth;

@Service
public class DashService {
    @Autowired
    private PacienteRepository pacienteRepository;
    @Autowired
    private DocumentoRepository documentoRepository;

    public DashResponse indicadoresGerais(){
        var qtdPacienteAtivos = pacienteRepository.countByAtivoTrue();
        var qtdDocumentos = documentoRepository.countByAtivoTrue();
        var documentosPendentes = documentoRepository
                .countByAtivoTrueAndStatus(EnumStatusDocumento.PENDENTE);

        return new DashResponse(
            qtdPacienteAtivos,
            mediaAcolhimento(),
            qtdDocumentos,
            documentosPendentes
        );
    }

    public long contarDocumentosMes(int ano, int mes){
        if(ano < 1 || mes < 1 || mes > 12){
            throw new IllegalArgumentException("Ano ou mês inválido.");
        }

        YearMonth periodo = YearMonth.of(ano, mes);

        LocalDateTime inicio = periodo.atDay(1).atStartOfDay();

        LocalDateTime fim = periodo.plusMonths(1)
            .atDay(1).atStartOfDay();

        return documentoRepository
            .countByAtivoTrueAndDtCriacaoGreaterThanEqualAndDtCriacaoLessThan(
                inicio,
                fim
            );
    }

    private long mediaAcolhimento(){
        LocalDateTime agora = LocalDateTime.now();
        double media = pacienteRepository.findAll().stream()
            .mapToLong(p -> {
                LocalDateTime fim = p.isAtivo()
                        ? agora : p.getDtDesativado();

                return Duration.between(
                        p.getDtCriacao(),
                        fim
                ).toDays();
            }).average().orElse(0d);

        return (long) Math.round(media);
    }

}
