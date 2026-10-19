package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.application.DTO.usuario.UsuarioProfissionalResponse;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private PerfilService perfilService;


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

        if(role != null){
            usuario.setRole(role);
        }
        usuario.setAtivo(true);

        validarCampos(usuario);
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

    public void alterarStatus(Long usuarioId, boolean ativo, Usuario usuarioLogado) {
        if (!usuarioLogado.isAdmin()) {
            throw new UsuarioSemAutorizacao();
        }
        Usuario usuario = buscarPorId(usuarioId);
        usuario.setAtivo(ativo);
        usuario.setDtDesativado(ativo ? null : LocalDateTime.now());
        usuarioRepository.save(usuario);
    }

    public void alterarPerfil(Long usuarioId, Long perfilId, Usuario usuarioLogado) {
        if (!usuarioLogado.isAdmin()) {
            throw new UsuarioSemAutorizacao();
        }
        var usuario = buscarPorId(usuarioId);
        var perfil  = perfilService.buscarOpcional(perfilId);
        usuario.setPerfil(perfil);
        usuarioRepository.save(usuario);
    }

    public UsuarioProfissionalResponse getUsuarioLogado(){
        var usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return mapeiaParaDTO(usuarioLogado);
    }

    private void validarCampos(Usuario usuario) {
        List<String> camposInvalidos = new ArrayList<>();

        if(usuario.getEmail() == null){
            camposInvalidos.add("email");
        }
        if(usuario.getSenha() == null){
            camposInvalidos.add("senha");
        }

        if (!camposInvalidos.isEmpty()) {
            throw new IllegalArgumentException("verifique os campos: " +String.join(", ", camposInvalidos));
        }
    }

    private UsuarioProfissionalResponse mapeiaParaDTO(Usuario usuario){
        Profissional profissional = usuario.getProfissional();

        return new UsuarioProfissionalResponse(
                usuario.getId(),
                profissional != null
                        ? profissional.getId()
                        : null,
                profissional != null
                        ? profissional.getNome()
                        : "",
                usuario.getEmail(),
                profissional != null
                        ? profissional.getTelefone()
                        : "",
                usuario.getRole(),
                usuario.getPerfil() != null
                        ? usuario.getPerfil().getNome()
                        : "",
                usuario.getAtivo(),
                usuario.getDtCriacao(),
                usuario.getDtDesativado()
        );
    }
}