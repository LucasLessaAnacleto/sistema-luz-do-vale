package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.application.DTO.paciente.PacienteRequest;
import com.luzdovale.reabilitah.backend.application.DTO.paciente.PacienteResponse;
import com.luzdovale.reabilitah.backend.application.DTO.responsavel.ResponsavelResponse;
import com.luzdovale.reabilitah.backend.application.exceptions.PacienteNaoEncontradoException;
import com.luzdovale.reabilitah.backend.application.exceptions.UsuarioSemAutorizacao;
import com.luzdovale.reabilitah.backend.domain.entities.Paciente;
import com.luzdovale.reabilitah.backend.domain.entities.Responsavel;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import com.luzdovale.reabilitah.backend.domain.repository.PacienteRepository;
import com.luzdovale.reabilitah.backend.domain.valueobjects.CPF;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;
    @Autowired
    private ResponsavelService responsavelService;

    public List<PacienteResponse> listarTodos(Boolean ativo) {
        return pacienteRepository.findAll()
            .stream()
            .filter(paciente ->
                    ativo == null || paciente.isAtivo() == ativo
            )
            .map(paciente -> {
                var responsavel = responsavelService.buscarComPaciente(paciente);
                return mapeiaParaDTO(paciente, responsavel);
            })
            .toList();
    }

    public PacienteResponse buscar(Long id) {
        var paciente    = pacienteRepository.findById(id).orElseThrow(PacienteNaoEncontradoException::new);
        var responsavel = responsavelService.buscarComPaciente(paciente);
        return mapeiaParaDTO(paciente,responsavel);
    }

    @Transactional
    public PacienteResponse criar(PacienteRequest dto, Usuario usuarioLogado) {
        if(!usuarioLogado.isAdmin() && (
                usuarioLogado.getPerfil() == null || !usuarioLogado.getPerfil().isPermCadPaciente()
        )){
            throw new UsuarioSemAutorizacao();
        }

        if(dto.responsavel() == null){
            throw new IllegalArgumentException("verifique os campos: responsavel");
        }
        var paciente = salvar(new Paciente(), dto);

        var responsavel = responsavelService.criar(
                paciente,
                dto.responsavel()
        );

        return mapeiaParaDTO(paciente, responsavel);

    }

    private PacienteResponse mapeiaParaDTO(Paciente paciente, Responsavel responsavel) {
        var responsavelResponse = new ResponsavelResponse(
            responsavel.getId(),
            responsavel.getNome(),
            responsavel.getParentesco(),
            responsavel.getCpf() != null
                    ? responsavel.getCpf().toString()
                    : "",
            responsavel.getRg(),
            responsavel.getTelefone(),
            responsavel.getEndereco(),
            responsavel.getDtNasc()
        );

        return new PacienteResponse(
            paciente.getId(),
            paciente.getNome(),
            paciente.getApelido(),
            paciente.getCpf() != null
                    ? paciente.getCpf().toString()
                    : "",
            paciente.getRg(),
            paciente.getTelefone(),
            paciente.getEndereco(),
            paciente.getDtNasc(),
            paciente.isAtivo(),
            paciente.getDtCriacao(),
            paciente.getDtDesativado(),
            responsavelResponse
        );
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

}
