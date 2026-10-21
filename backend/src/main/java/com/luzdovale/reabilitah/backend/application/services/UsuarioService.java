package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.application.DTO.usuario.CriarUsuarioRequest;
import com.luzdovale.reabilitah.backend.application.DTO.usuario.EditarUsuarioRequest;
import com.luzdovale.reabilitah.backend.application.DTO.usuario.UsuarioResponse;
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
    @Autowired
    private ProfissionalService profissionalService;


    public List<UsuarioResponse> listarComDadosProfissional(Usuario usuarioLogado) {

        if(!usuarioLogado.isAdmin()){
            throw new UsuarioSemAutorizacao();
        }
        return usuarioRepository.findAll().stream()
                .map(this::mapeiaParaDTO)
                .toList();
    }

    public UsuarioResponse buscarComDadosProfissional( Long usuarioId, Usuario usuarioLogado ) {

        if(!usuarioId.equals(usuarioLogado.getId()) && !usuarioLogado.isAdmin()){
            throw new UsuarioSemAutorizacao();
        }

        var usuario = buscarPorId(usuarioId);
        return mapeiaParaDTO(usuario);
    }

    @Transactional
    public UsuarioResponse criar(CriarUsuarioRequest usuarioDto){

        Perfil perfil = perfilService.buscarOpcional(
            usuarioDto.perfilId()
        );

        Profissional profissional = profissionalService.criar(
            usuarioDto
        );

        var usuario = criarFinal(
            profissional,
            perfil,
            usuarioDto.email(),
            usuarioDto.senha(),
            usuarioDto.role()
        );

        return mapeiaParaDTO(usuario);
    }

    @Transactional
    public Usuario criarFinal(
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

    @Transactional
    public UsuarioResponse alterar(
        Long usuarioId,
        EditarUsuarioRequest usuarioDto,
        Usuario usuarioLogado
    ) {

        if(!usuarioId.equals(usuarioLogado.getId()) && !usuarioLogado.isAdmin()){
            throw new UsuarioSemAutorizacao();
        }

        Usuario usuario = buscarPorId(usuarioId);
        if(usuarioDto.email() != null && !usuarioDto.email().equals(usuario.getEmail())){

            if(existeUsuarioComEmail( usuarioDto.email() )){
                throw new EmailJaCadastradoException( usuarioDto.email() );
            }
            usuario.setEmail( usuarioDto.email() );
        }

        if(usuarioLogado.isAdmin()){

            if(usuarioDto.role() != null){
                usuario.setRole( usuarioDto.role() );
            }
            if(usuarioDto.perfilId() != null){
                usuario.setPerfil( perfilService.buscarOpcional(usuarioDto.perfilId()) );
            }
            if(usuarioDto.ativo() != null){
                usuario.setAtivo( usuarioDto.ativo() );
                usuario.setDtDesativado( usuarioDto.ativo() ? null : LocalDateTime.now() );
            }
        }

        var profissional = usuario.getProfissional();

        if(profissional != null){
            profissionalService.alterar( profissional, usuarioDto, usuarioLogado );
        }

        validarCampos(usuario);
        usuarioRepository.save(usuario);
        return mapeiaParaDTO(usuario);
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

    public UsuarioResponse getUsuarioLogado(){
        var usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return mapeiaParaDTO(usuarioLogado);
    }

    public Usuario buscarPorId(Long id) {

        return usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNaoEncontradoException(id) );
    }


    public Usuario buscarPorEmail(String email) {

        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsuarioNaoEncontradoException(email));
    }

    public boolean existeUsuarioComEmail(String email) {
        return usuarioRepository.existsByEmail(email);
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

    private UsuarioResponse mapeiaParaDTO(Usuario usuario){

        Profissional profissional = usuario.getProfissional();
        return new UsuarioResponse(
            usuario.getId(),
            profissional != null
                    ? profissional.getId()
                    : null,
            profissional != null
                    ? profissional.getNome()
                    : "",
            profissional != null
                    ? profissional.getTelefone()
                    : "",
            profissional != null
                    ? profissional.getRegProfissional()
                    : "",
            profissional != null
                    && profissional.getCPF() != null
                    ? profissional.getCPF().toString()
                    : "",
            profissional != null
                    ? profissional.getDtNasc()
                    : null,
            profissional != null
                    ? profissional.getEndereco()
                    : null,
            usuario.getEmail(),
            usuario.getRole(),
            usuario.getPerfil() != null
                    ? usuario.getPerfil().getId()
                    : null,
            usuario.getPerfil() != null
                    ? usuario.getPerfil().getNome()
                    : "",
            usuario.getAtivo(),
            usuario.getDtCriacao(),
            usuario.getDtDesativado()
        );
    }

}