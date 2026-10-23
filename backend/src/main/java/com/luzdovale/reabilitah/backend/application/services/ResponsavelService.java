package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.application.DTO.responsavel.ResponsavelRequest;
import com.luzdovale.reabilitah.backend.domain.entities.Paciente;
import com.luzdovale.reabilitah.backend.domain.entities.Responsavel;
import com.luzdovale.reabilitah.backend.domain.repository.ResponsavelRepository;
import com.luzdovale.reabilitah.backend.domain.valueobjects.CPF;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ResponsavelService {
    @Autowired
    private ResponsavelRepository responsavelRepository;

    public Responsavel criar(
            Paciente paciente,
            ResponsavelRequest dto
    ){
        Responsavel responsavel = new Responsavel();

        responsavel.setPaciente(paciente);

        return salvar(
            responsavel,
            dto
        );
    }

    private Responsavel salvar(
            Responsavel responsavel,
            ResponsavelRequest dados
    ){

        if(dados.nome() != null){
            responsavel.setNome(dados.nome());
        }

        if(dados.parentesco() != null){
            responsavel.setParentesco(dados.parentesco());
        }

        if(dados.telefone() != null){
            responsavel.setTelefone(dados.telefone());
        }

        if(dados.endereco() != null){
            var endereco            = dados.endereco();
            var responsavelEndereco = responsavel.getEndereco();

            if(endereco.getEstado() != null){
                responsavelEndereco.setEstado(endereco.getEstado());
            }

            if(endereco.getMunicipio() != null){
                responsavelEndereco.setMunicipio(endereco.getMunicipio());
            }

            if(endereco.getBairro() != null){
                responsavelEndereco.setBairro(endereco.getBairro());
            }

            if(endereco.getRua() != null){
                responsavelEndereco.setRua(endereco.getRua());
            }

            if(endereco.getNumero() != null){
                responsavelEndereco.setNumero(endereco.getNumero());
            }
        }

        if(dados.cpf() != null){
            responsavel.setCpf(
                    new CPF(dados.cpf())
            );
        }

        if(dados.rg() != null){
            responsavel.setRg(dados.rg());
        }

        if(dados.dtNasc() != null){
            responsavel.setDtNasc(dados.dtNasc());
        }

        return responsavelRepository.save(responsavel);
    }

    public Responsavel buscarComPaciente(Paciente paciente) {
        return responsavelRepository.findByPaciente(paciente);
    }
}
