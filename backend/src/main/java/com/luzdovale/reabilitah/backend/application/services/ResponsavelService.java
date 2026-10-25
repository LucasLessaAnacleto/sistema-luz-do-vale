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

    public Responsavel editar(Paciente paciente, ResponsavelRequest dto){

        var responsavel = buscarPorPaciente(paciente);
        return salvar(responsavel, dto);
    }

    private Responsavel salvar(Responsavel responsavel, ResponsavelRequest dados){

        responsavel.setNome(dados.nome());
        responsavel.setParentesco(dados.parentesco());
        responsavel.setTelefone(dados.telefone());
        responsavel.setEndereco(dados.endereco());

        responsavel.setCpf(
                dados.cpf() != null
                    ? new CPF(dados.cpf())
                    : null
        );

        responsavel.setRg(dados.rg());
        responsavel.setDtNasc(dados.dtNasc());

        return responsavelRepository.save(responsavel);
    }

    public Responsavel buscarPorPaciente(Paciente paciente) {
        return responsavelRepository.findByPaciente(paciente);
    }
}
