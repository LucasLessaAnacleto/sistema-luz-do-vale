package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.domain.entities.Log;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import com.luzdovale.reabilitah.backend.domain.enuns.EnumTipoLog;
import com.luzdovale.reabilitah.backend.domain.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class LogService {
    @Autowired
    private LogRepository logRepository;

    public Log evento(Usuario usuario, String acao, String descricao) {

        return registrar(usuario, EnumTipoLog.EVENTO, acao, descricao);
    }

    public Log erro(Exception ex, String acao) {

        Usuario usuario = null;

        var authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication != null){
            usuario = (Usuario) authentication.getPrincipal();
        }

        String descricao = ex.getClass().getSimpleName() + ": " + ex.getMessage();

        return registrar(usuario, EnumTipoLog.ERRO, acao, descricao);
    }

    private Log registrar(Usuario usuario, EnumTipoLog tipo, String acao, String descricao) {
        Log log = new Log();

        log.setUsuario(usuario);
        log.setTipo(EnumTipoLog.EVENTO);
        log.setAcao(acao);
        log.setDescricao(descricao);

        return logRepository.save(log);
    }
}
