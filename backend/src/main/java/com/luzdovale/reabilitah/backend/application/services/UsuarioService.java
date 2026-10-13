package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.application.DTO.profissional.UsuarioProfissionalResponse;
import com.luzdovale.reabilitah.backend.application.exceptions.EmailJaCadastradoException;
import com.luzdovale.reabilitah.backend.application.exceptions.UsuarioNaoEncontradoException;
import com.luzdovale.reabilitah.backend.application.exceptions.UsuarioSemAutorizacao;
import com.luzdovale.reabilitah.backend.domain.entities.Perfil;
import com.luzdovale.reabilitah.backend.domain.entities.Profissional;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import com.luzdovale.reabilitah.backend.domain.enuns.EnumRoleUsuario;
import com.luzdovale.reabilitah.backend.domain.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;


    @Transactional
    public Usuario criar(
            Profissional profissional,
            Perfil perfil,
            String email,
            String senha,
            EnumRoleUsuario role
    ) {

        if (usuarioRepository.existsByEmail(email)) {
            throw new EmailJaCadastradoException(email);
        }

        Usuario usuario = new Usuario();

        usuario.setProfissional(profissional);
        usuario.setPerfil(perfil);
        usuario.setEmail(email);

        usuario.setSenha(passwordEncoder.encode(senha));

        usuario.setRole(role);
        usuario.setAtivo(true);

        return usuarioRepository.save(usuario);
    }


    public Usuario buscarPorId(Long id) {

        return usuarioRepository
                .findById(id)
                .orElseThrow(() ->
                        new UsuarioNaoEncontradoException(id)
                );
    }


    public Usuario buscarPorEmail(String email) {

        return usuarioRepository
                .findByEmail(email)
                .orElseThrow(() -> new UsuarioNaoEncontradoException(email));
    }


    public boolean existeUsuarioComEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }

    public void redefinirSenha(
            Long usuarioId,
            String novaSenha,
            Usuario usuarioLogado
    ) {
        if(!usuarioLogado.isAdmin()){
            throw new UsuarioSemAutorizacao();
        }

        Usuario usuario = buscarPorId(usuarioId);
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);
    }

    public List<UsuarioProfissionalResponse> listarComDadosProfissional(Usuario usuarioLogado) {
        if(!usuarioLogado.isAdmin()){
            throw new UsuarioSemAutorizacao();
        }
        return usuarioRepository.findAll()
                .stream()
                .map(usuario -> mapeiaParaDTO(usuario))
                .toList();
    }

    private UsuarioProfissionalResponse mapeiaParaDTO(Usuario usuario){
        Profissional profissional = usuario.getProfissional();

        return new UsuarioProfissionalResponse(
                usuario.getId(),
                profissional.getId(),
                profissional.getNome(),
                usuario.getEmail(),
                profissional.getTelefone(),
                usuario.getRole(),
                usuario.getPerfil() != null
                        ? usuario.getPerfil().getNome()
                        : null,
                usuario.getAtivo(),
                usuario.getDtCriacao().toLocalDate()
        );
    }
}