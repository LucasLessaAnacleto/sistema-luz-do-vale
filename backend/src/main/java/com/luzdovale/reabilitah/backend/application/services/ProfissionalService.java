package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.application.DTO.profissional.ProfissionalDados;
import com.luzdovale.reabilitah.backend.domain.entities.Profissional;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import com.luzdovale.reabilitah.backend.domain.repository.ProfissionalRepository;
import com.luzdovale.reabilitah.backend.domain.valueobjects.CPF;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProfissionalService {

    @Autowired
    public ProfissionalRepository profissionalRepository;

    public Profissional criar(ProfissionalDados profissionalDto){

        return salvar(
            new Profissional(),
            profissionalDto,
            true
        );
    }

    public Profissional alterar(
        Profissional profissional,
        ProfissionalDados profissionalDto,
        Usuario usuario
    ){
        return salvar(
            profissional,
            profissionalDto,
            usuario.isAdmin()
        );
    }

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
