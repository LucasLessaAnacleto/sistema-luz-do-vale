package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.application.DTO.aviso.AlterarAvisoRequest;
import com.luzdovale.reabilitah.backend.application.DTO.aviso.AvisoResponse;
import com.luzdovale.reabilitah.backend.application.DTO.aviso.CriarAvisoRequest;
import com.luzdovale.reabilitah.backend.application.exceptions.AvisoJaDesativadoException;
import com.luzdovale.reabilitah.backend.application.exceptions.AvisoNaoEncontradoException;
import com.luzdovale.reabilitah.backend.domain.entities.Aviso;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import com.luzdovale.reabilitah.backend.domain.repository.AvisoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AvisoService {

    @Autowired
    private AvisoRepository avisoRepository;

    @Transactional
    public Page<AvisoResponse> listarTodos(Pageable pageable) {
        desativarAvisosExpirados();
        return avisoRepository.findAll(pageable)
                .map(this::mapeiaParaDTO);
    }

    @Transactional
    public Page<AvisoResponse> listarAtivos(Pageable pageable) {
        desativarAvisosExpirados();
        return avisoRepository.findByAtivo(true, pageable)
                .map(this::mapeiaParaDTO);
    }

    public AvisoResponse buscarPorId(Long id) {
        return avisoRepository.findById(id)
                .map(this::mapeiaParaDTO)
                .orElseThrow(AvisoNaoEncontradoException::new);
    }

    public Aviso criar(CriarAvisoRequest dto, Usuario usuarioLogado) {
        Aviso aviso = new Aviso();

        aviso.setCriadoPor(usuarioLogado);
        aviso.setMensagem(dto.mensagem());
        aviso.setDtFinalizacao(dto.dtFinalizacao());

        return avisoRepository.save(aviso);
    }

    public void desativar(Long id) {
        var aviso = avisoRepository.findById(id).orElseThrow(AvisoNaoEncontradoException::new);
        aviso.setAtivo(false);
        aviso.setDtDesativado(LocalDateTime.now());
        avisoRepository.save(aviso);
    }

    public void desativarAvisosExpirados() {
        LocalDateTime agora = LocalDateTime.now();
        var avisos = avisoRepository.findByAtivoTrueAndDtFinalizacaoLessThanEqual(agora);

        for(var aviso : avisos){
            aviso.setAtivo(false);
            aviso.setDtDesativado(agora);
            avisoRepository.save(aviso);
        };
    }

    private AvisoResponse mapeiaParaDTO(Aviso aviso) {
        var usuario = aviso.getCriadoPor();
        Long   usuarioId   = null;
        String nomeUsuario = null;
        if(usuario != null){
            usuarioId   = usuario.getId();
            nomeUsuario = usuario.getEmail();
            if(usuario.getProfissional() != null){
                nomeUsuario = usuario.getProfissional().getNome();
            }
        }
        return new AvisoResponse(
            aviso.getId(),
            aviso.getMensagem(),
            usuarioId,
            nomeUsuario,
            aviso.getDtCriacao(),
            aviso.getDtFinalizacao(),
            aviso.isAtivo(),
            aviso.getDtDesativado()
        );
    }
}
