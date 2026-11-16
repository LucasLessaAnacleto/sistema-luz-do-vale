package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.application.DTO.aviso.AvisoResponse;
import com.luzdovale.reabilitah.backend.application.DTO.aviso.CriarAvisoRequest;
import com.luzdovale.reabilitah.backend.application.exceptions.AvisoNaoEncontradoException;
import com.luzdovale.reabilitah.backend.application.exceptions.UsuarioSemAutorizacao;
import com.luzdovale.reabilitah.backend.domain.entities.Aviso;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import com.luzdovale.reabilitah.backend.domain.repository.AvisoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AvisoService {

    @Autowired
    private AvisoRepository avisoRepository;

    @Transactional
    public Page<AvisoResponse> listarTodos(Boolean ativo, int pagina, Usuario usuarioLogado) {
        desativarAvisosExpirados();

        var pageable = PageRequest.of(pagina, 10, Sort.by("dtCriacao", "id").descending());
        if(usuarioLogado.isAdmin()){
            if(ativo == null){
                return avisoRepository
                    .findAll(pageable)
                    .map(this::mapeiaParaDTO);
            }
            return listarPorStatus(ativo, pageable);
        }
        if(ativo == null){
            return avisoRepository
                .findByAtivoTrueOrCriadoPor_Id(usuarioLogado.getId(), pageable)
                .map(this::mapeiaParaDTO);
        }
        if(ativo){
            return listarPorStatus(true, pageable);
        }

        return avisoRepository
            .findByAtivoFalseAndCriadoPor_Id(usuarioLogado.getId(), pageable)
            .map(this::mapeiaParaDTO);
    }

    private Page<AvisoResponse> listarPorStatus(boolean status, Pageable pageable) {

        return avisoRepository.findByAtivo(status, pageable)
                .map(this::mapeiaParaDTO);
    }


    @Transactional
    public AvisoResponse buscarPorId(Long id, Usuario usuarioLogado) {
        desativarAvisosExpirados();

        var aviso = avisoRepository.findById(id)
                .orElseThrow(AvisoNaoEncontradoException::new);

        if(!aviso.isAtivo() && !usuarioLogado.isAdmin() && (
                aviso.getCriadoPor() == null || !aviso.getCriadoPor().getId().equals(usuarioLogado.getId())
        )){

            throw new UsuarioSemAutorizacao();
        }

        return mapeiaParaDTO(aviso);
    }

    public AvisoResponse criar(CriarAvisoRequest dto, Usuario usuarioLogado) {
        if (dto.mensagem() == null || dto.mensagem().isBlank()) {
            throw new IllegalArgumentException("Informe a mensagem do aviso.");
        }
        Aviso aviso = new Aviso();
        aviso.setCriadoPor(usuarioLogado);
        aviso.setMensagem(dto.mensagem());
        aviso.setDtFinalizacao(dto.dtFinalizacao());

        return mapeiaParaDTO(avisoRepository.save(aviso));
    }

    public void desativar(Long id, Usuario usuarioLogado) {
        var aviso = avisoRepository.findById(id).orElseThrow(AvisoNaoEncontradoException::new);

        if(!aviso.getCriadoPor().getId().equals(usuarioLogado.getId()) && !usuarioLogado.isAdmin()){
            throw new UsuarioSemAutorizacao();
        }

        if(!aviso.isAtivo()) return;

        aviso.setAtivo(false);
        aviso.setDtDesativado(LocalDateTime.now());
        avisoRepository.save(aviso);
    }

    private void desativarAvisosExpirados() {
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
