package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.application.exceptions.PerfilNaoEncontradoException;
import com.luzdovale.reabilitah.backend.domain.entities.Perfil;
import com.luzdovale.reabilitah.backend.domain.repository.PerfilRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PerfilService {

    @Autowired
    private PerfilRepository perfilRepository;

    public Perfil buscarPorId(Long id){
        return perfilRepository.findById(id)
                .orElseThrow(() -> new PerfilNaoEncontradoException(id));
    }

    public Perfil buscarOpcional(Long id){
        if(id == null){
            return null;
        }
        return buscarPorId(id);
    }
}
