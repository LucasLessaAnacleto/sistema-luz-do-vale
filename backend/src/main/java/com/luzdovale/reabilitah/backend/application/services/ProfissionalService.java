package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.application.DTO.profissional.CriarProfissionalRequest;
import com.luzdovale.reabilitah.backend.application.DTO.profissional.EditarProfissionalRequest;
import com.luzdovale.reabilitah.backend.application.DTO.profissional.ProfissionalDados;
import com.luzdovale.reabilitah.backend.application.DTO.usuario.UsuarioProfissionalResponse;
import com.luzdovale.reabilitah.backend.application.exceptions.ProfissionalNaoEncontradoException;
import com.luzdovale.reabilitah.backend.application.exceptions.UsuarioSemAutorizacao;
import com.luzdovale.reabilitah.backend.domain.entities.Endereco;
import com.luzdovale.reabilitah.backend.domain.entities.Perfil;
import com.luzdovale.reabilitah.backend.domain.entities.Profissional;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import com.luzdovale.reabilitah.backend.domain.enuns.EnumRoleUsuario;
import com.luzdovale.reabilitah.backend.domain.repository.ProfissionalRepository;
import com.luzdovale.reabilitah.backend.domain.valueobjects.CPF;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProfissionalService {

    @Autowired
    public ProfissionalRepository profissionalRepository;
    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private PerfilService perfilService;

    @Transactional
    public UsuarioProfissionalResponse criar(CriarProfissionalRequest profissionalDto){

        Perfil perfil = perfilService.buscarOpcional(profissionalDto.perfilId());

        Profissional profissional = salvar(
            new Profissional(),
            profissionalDto,
            true
        );

        var usuario = usuarioService.criar(
            profissional,
            perfil,
            profissionalDto.email(),
            profissionalDto.senha(),
            profissionalDto.role()
        );

        return new UsuarioProfissionalResponse(
                usuario.getId(),
                profissional.getId(),
                profissional.getNome(),
                usuario.getEmail(),
                profissional.getTelefone(),
                usuario.getRole(),
                perfil != null ? perfil.getNome() : null,
                usuario.getAtivo(),
                usuario.getDtCriacao(),
                usuario.getDtDesativado()
        );
    }

    public Profissional alterar(
        Long id,
        EditarProfissionalRequest profissionalDto,
        Usuario usuario
    ){
        var profissional = buscarPorId(id);
        return salvar(
            profissional,
            profissionalDto,
            usuario.isAdmin()
        );
    }



    public Profissional buscarPorIdPermissaoAdm(Long id, Usuario usuarioLogado) {
        var profLogado = usuarioLogado.getProfissional();
        if((profLogado == null || !id.equals(profLogado.getId()))
                && !usuarioLogado.isAdmin()){

            throw new UsuarioSemAutorizacao();
        }
        return buscarPorId(id);
    }
    public Profissional buscarPorId(Long id){

        return profissionalRepository
                .findById(id)
                .orElseThrow(() -> new ProfissionalNaoEncontradoException(id));
    }

//    private Profissional buscarPorUsuarioId(Long usuarioId) {
//        var usuarioBanco = usuarioService.buscarPorId(usuarioId);
//        var profissional = usuarioBanco.getProfissional();
//        if(profissional == null){
//            throw new UsuarioSemVinculoProfissional();
//        }
//        return profissional;
//    }

    private Profissional salvar(
        Profissional profissional,
        ProfissionalDados dados,
        boolean permissaoAdm
    ){
        if (dados.nome() != null) {
            profissional.setNome(dados.nome());
        }
        if (dados.telefone() != null) {
            profissional.setTelefone(dados.telefone());
        }
        if (dados.endereco() != null) {
            var endereco     = dados.endereco();
            var profEndereco = profissional.getEndereco();
            if(endereco.getEstado() != null){
                profEndereco.setEstado(endereco.getEstado());
            }
            if(endereco.getMunicipio() != null){
                profEndereco.setMunicipio(endereco.getMunicipio());
            }
            if(endereco.getBairro() != null){
                profEndereco.setBairro(endereco.getBairro());
            }
            if(endereco.getRua() != null){
                profEndereco.setRua(endereco.getRua());
            }
            if(endereco.getNumero() != null){
                profEndereco.setNumero(endereco.getNumero());
            }
        }

        if(permissaoAdm){
            if (dados.cpf() != null) {
                profissional.setCPF(new CPF(dados.cpf()));
            }

            if (dados.regProfissional() != null) {
                profissional.setRegProfissional(dados.regProfissional());
            }

            if (dados.dtNasc() != null) {
                profissional.setDtNasc(dados.dtNasc());
            }
        }
        validarCampos(profissional);
        return profissionalRepository.save(profissional);
    }

    private void validarCampos(Profissional dado) {
        List<String> camposInvalidos = new ArrayList<>();

        if (dado.getNome() == null || dado.getNome().trim().length() < 3) {
            camposInvalidos.add("nome");
        }
        if (dado.getCPF() == null) {
            camposInvalidos.add("CPF");
        }
        if (dado.getDtNasc() == null) {
            camposInvalidos.add("dtNasc");
        }
        if (!camposInvalidos.isEmpty()) {
            throw new IllegalArgumentException("verifique os campos: " +String.join(", ", camposInvalidos));
        }
    }

}
