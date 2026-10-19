package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.application.DTO.paciente.PacienteRequest;
import com.luzdovale.reabilitah.backend.application.exceptions.UsuarioSemAutorizacao;
import com.luzdovale.reabilitah.backend.domain.entities.Paciente;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import com.luzdovale.reabilitah.backend.domain.repository.PacienteRepository;
import com.luzdovale.reabilitah.backend.domain.valueobjects.CPF;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    public Paciente criar(PacienteRequest dto, Usuario usuarioLogado) {
        if(!usuarioLogado.isAdmin() && (
                usuarioLogado.getPerfil() == null || Boolean.FALSE.equals(usuarioLogado.getPerfil().getPermCadPaciente())
        )){
            throw new UsuarioSemAutorizacao();
        }
        return salvar(new Paciente(), dto);
    }

    private Paciente salvar(Paciente paciente, PacienteRequest dados){

        if (dados.nome() != null) {
            paciente.setNome(dados.nome());
        }
        if (dados.apelido() != null) {
            paciente.setApelido(dados.apelido());
        }
        if (dados.telefone() != null) {
            paciente.setTelefone(dados.telefone());
        }
        if (dados.endereco() != null) {
            var endereco         = dados.endereco();
            var pacienteEndereco = paciente.getEndereco();

            if(endereco.getEstado() != null){
                pacienteEndereco.setEstado(endereco.getEstado());
            }
            if(endereco.getMunicipio() != null){
                pacienteEndereco.setMunicipio(endereco.getMunicipio());
            }
            if(endereco.getBairro() != null){
                pacienteEndereco.setBairro(endereco.getBairro());
            }
            if(endereco.getRua() != null){
                pacienteEndereco.setRua(endereco.getRua());
            }
            if(endereco.getNumero() != null){
                pacienteEndereco.setNumero(endereco.getNumero());
            }
        }

        if (dados.cpf() != null) {
            paciente.setCpf(new CPF(dados.cpf()));
        }

        if (dados.rg() != null) {
            paciente.setRg(dados.rg());
        }

        if (dados.dtNasc() != null) {
            paciente.setDtNasc(dados.dtNasc());
        }

        validarCampos(paciente);
        return pacienteRepository.save(paciente);
    }

    private void validarCampos(Paciente dado) {
        List<String> camposInvalidos = new ArrayList<>();

        if(dado.getNome() == null || dado.getNome().length() < 3){
            camposInvalidos.add("nome");
        }
        if(dado.getCpf() == null){
            camposInvalidos.add("cpf");
        }
        if(dado.getRg() == null){
            camposInvalidos.add("rg");
        }

        if (!camposInvalidos.isEmpty()) {
            throw new IllegalArgumentException("verifique os campos: " +String.join(", ", camposInvalidos));
        }
    }

    public List<Paciente> listarTodos(Boolean ativo) {
        return pacienteRepository.findAll()
                .stream()
                .filter(paciente ->
                        ativo == null || paciente.isAtivo() == ativo
                )
                .toList();
    }
}
