package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.application.DTO.profissional.CriarProfissionalRequest;
import com.luzdovale.reabilitah.backend.application.DTO.profissional.EditarProfissionalRequest;
import com.luzdovale.reabilitah.backend.application.DTO.profissional.ProfissionalDados;
import com.luzdovale.reabilitah.backend.application.DTO.usuario.UsuarioProfissionalResponse;
import com.luzdovale.reabilitah.backend.application.exceptions.ProfissionalNaoEncontradoException;
import com.luzdovale.reabilitah.backend.application.exceptions.UsuarioSemAutorizacao;
import com.luzdovale.reabilitah.backend.domain.entities.Perfil;
import com.luzdovale.reabilitah.backend.domain.entities.Profissional;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import com.luzdovale.reabilitah.backend.domain.enuns.EnumRoleUsuario;
import com.luzdovale.reabilitah.backend.domain.repository.ProfissionalRepository;
import com.luzdovale.reabilitah.backend.domain.valueobjects.CPF;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
            usuario.getRole().equals(EnumRoleUsuario.ROLE_ADMIN)
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
        if (dados.enderecoEstado() != null) {
            profissional.setEnderecoEstado(dados.enderecoEstado());
        }

        if (dados.enderecoMunicipio() != null) {
            profissional.setEnderecoMunicipio(dados.enderecoMunicipio());
        }

        if (dados.enderecoBairro() != null) {
            profissional.setEnderecoBairro(dados.enderecoBairro());
        }

        if (dados.enderecoRua() != null) {
            profissional.setEnderecoRua(dados.enderecoRua());
        }

        if (dados.enderecoNr() != null) {
            profissional.setEnderecoNr(dados.enderecoNr());
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
        return profissionalRepository.save(profissional);
    }

}
