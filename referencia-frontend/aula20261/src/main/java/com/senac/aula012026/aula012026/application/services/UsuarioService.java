package com.senac.aula012026.aula012026.application.services;

import com.senac.aula012026.aula012026.application.DTO.*;
import com.senac.aula012026.aula012026.domain.entities.Usuario;
import com.senac.aula012026.aula012026.domain.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Value("${spring.secretkey}")
    private String secret;


    public boolean ValidaUsuarioSenha(LoginRequest loginRequest) {
        try {

            return usuarioRepository.existsUsuarioByEmailContainingAndSenha(loginRequest.email(), loginRequest.senha());

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    public List<UsuarioResponse> ListarTodos() {
        try{
            Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            var empresa = usuarioLogado.getEmpresa();

            return usuarioRepository.getUsuariosByEmpresa_Id(empresa.getId())
                    .stream()
                    .map(UsuarioResponse::new)
                    .collect(Collectors.toList());

//            return usuarioRepository.findAll()
//                    .stream()
//                    .filter(a-> a.getEmpresa().getId().equals(empresa.getId()))
//                    .map(UsuarioResponse::new)
//                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public UsuarioResponse BuscarUsuarioLogado(Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        try{
            return  usuarioRepository.findById(usuario.getId())
                    .stream().map(UsuarioResponse::new).findFirst().orElse(null);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }



    public UsuarioResponse BuscarUsuarioPorId(Long id) {
        try{

            Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

           var usuario = usuarioRepository.findByIdAndEmpresa_Id(id,usuarioLogado.getEmpresa().getId()).orElse(null);
           return new UsuarioResponse(usuario);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    public boolean AterarUsuario(Long id, UsuarioRequest usuario) {

        var usuarioBanco = usuarioRepository.findById(id).orElse(null);

        if (usuarioBanco != null){
            usuarioBanco.setEmail(usuario.email());
            usuarioBanco.setNome(usuario.nome());
            usuarioBanco.setSenha(usuario.senha());


            usuarioRepository.save(usuarioBanco);

            return true;
        }

        return false;
    }

    public Long SalvarUsuario(UsuarioRequest usuario) {
        try {
            return usuarioRepository.save(new Usuario(usuario)).getId();
        }catch (Exception e){
            throw new RuntimeException(e);
        }

    }

    public Long SalvarUsuarioAdm(UsuarioAdmRequest usuario) {
        try {

            if(usuario.secretKey().equals( secret)) {
                return usuarioRepository.save(new Usuario(usuario)).getId();
            }else
            {
                return 0L;
            }

        }catch (Exception e){
            throw new RuntimeException(e);
        }

    }

    public boolean AlterarStatus(Long id, AlterarStatusRequest statusRequest) {

        var usuarioBanco = usuarioRepository.findById(id).orElse(null);

        if (usuarioBanco != null){

            usuarioBanco.setStatus(statusRequest.status());
            usuarioRepository.save(usuarioBanco);

            return true;
        }
        return false;
    }
}
