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
                var responsavel = responsavelService.buscarPorPaciente(paciente);
                return mapeiaParaDTO(paciente, responsavel);
            })
            .toList();
    }

    public PacienteResponse buscar(Long id) {
        var paciente    = pacienteRepository.findById(id).orElseThrow(PacienteNaoEncontradoException::new);
        var responsavel = responsavelService.buscarPorPaciente(paciente);
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
        var responsavel = responsavelService.criar(paciente, dto.responsavel());

        return mapeiaParaDTO(paciente, responsavel);
    }

    @Transactional
    public PacienteResponse editar(Long id, PacienteRequest dto, Usuario usuarioLogado) {
        if(!usuarioLogado.isAdmin() && (
                usuarioLogado.getPerfil() == null || !usuarioLogado.getPerfil().isPermCadPaciente()
        )){
            throw new UsuarioSemAutorizacao();
        }

        var paciente = pacienteRepository
                .findById(id)
                .orElseThrow(() -> new PacienteNaoEncontradoException(id));

        if(dto.responsavel() == null){
            throw new IllegalArgumentException("verifique os campos: responsavel");
        }

        paciente = salvar(paciente, dto);
        var responsavel = responsavelService.editar(
                paciente,
                dto.responsavel()
        );

        return mapeiaParaDTO(paciente, responsavel);
    }

    private Paciente salvar(Paciente paciente, PacienteRequest dados){
        paciente.setNome(dados.nome());
        paciente.setApelido(dados.apelido());
        paciente.setTelefone(dados.telefone());
        paciente.setEndereco(dados.endereco());
        paciente.setCpf(new CPF(dados.cpf()));
        paciente.setRg(dados.rg());
        paciente.setDtNasc(dados.dtNasc());

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

}
