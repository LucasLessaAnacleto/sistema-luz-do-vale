package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.domain.entities.Log;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import com.luzdovale.reabilitah.backend.domain.enuns.EnumTipoLog;
import com.luzdovale.reabilitah.backend.domain.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LogService {
    @Autowired
    private LogRepository logRepository;

    public Log registrar(Usuario usuario,
         EnumTipoLog tipo,
         String acao,
         String descricao
    ) {

        Log log = new Log();

        log.setUsuario(usuario);
        log.setTipo(tipo);
        log.setAcao(acao);
        log.setDescricao(descricao);

        return logRepository.save(log);
    }
}
