package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.application.DTO.documento.DocumentoDetalhesResponse;
import com.luzdovale.reabilitah.backend.application.DTO.paciente.PacienteRequest;
import com.luzdovale.reabilitah.backend.application.DTO.paciente.PacienteResponse;
import com.luzdovale.reabilitah.backend.application.DTO.responsavel.ResponsavelResponse;
import com.luzdovale.reabilitah.backend.application.exceptions.PacienteNaoEncontradoException;
import com.luzdovale.reabilitah.backend.application.exceptions.UsuarioSemAutorizacao;
import com.luzdovale.reabilitah.backend.application.DTO.paciente.PacienteDetalhesResponse;
import com.luzdovale.reabilitah.backend.domain.entities.Documento;
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
    @Autowired
    private DocumentoService documentoService;

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

    public PacienteDetalhesResponse buscar(Long id) {
        var paciente = buscarPaciente(id);
        var responsavel = responsavelService.buscarPorPaciente(paciente);

        DocumentoDetalhesResponse fichaAcolhimento = null;

        if (paciente.getFichaDocumento() != null) {
            fichaAcolhimento = documentoService.buscar(
                    paciente.getFichaDocumento().getId()
            );
        }

        return mapeiaParaDetalhesDTO(
                paciente,
                responsavel,
                fichaAcolhimento
        );
    }

    @Transactional
    public PacienteResponse criar(PacienteRequest dto, Usuario usuarioLogado) {

        validarPermissaoCadastro(usuarioLogado);

        if (dto.responsavel() == null) {
            throw new IllegalArgumentException("verifique os campos: responsavel");
        }

        if (dto.fichaAcolhimento() == null) {
            throw new IllegalArgumentException("verifique os campos: fichaAcolhimento");
        }

        var paciente = salvar(new Paciente(), dto);

        var responsavel = responsavelService.criar(paciente,dto.responsavel());

        Documento ficha = documentoService.criarFichaAcolhimento(
            paciente,
            responsavel,
            dto.fichaAcolhimento(),
            usuarioLogado,
            null
        );

        paciente.setFichaDocumento(ficha);
        pacienteRepository.save(paciente);

        return mapeiaParaDTO(paciente,responsavel);
    }

    @Transactional
    public PacienteResponse editar(Long id, PacienteRequest dto, Usuario usuarioLogado) {

        validarPermissaoCadastro(usuarioLogado);

        var paciente = pacienteRepository.findById(id)
            .orElseThrow(() -> new PacienteNaoEncontradoException(id));

        if (dto.responsavel() == null) {
            throw new IllegalArgumentException("verifique os campos: responsavel");
        }

        if (dto.fichaAcolhimento() == null) {
            throw new IllegalArgumentException("verifique os campos: fichaAcolhimento");
        }

        Documento fichaAnterior = paciente.getFichaDocumento();
        paciente = salvar(paciente, dto);

        var responsavel = responsavelService.editar(paciente,dto.responsavel());

        Documento novaFicha = documentoService.criarFichaAcolhimento(
            paciente,
            responsavel,
            dto.fichaAcolhimento(),
            usuarioLogado,
            fichaAnterior
        );

        paciente.setFichaDocumento(novaFicha);
        pacienteRepository.save(paciente);

        return mapeiaParaDTO(paciente, responsavel);
    }

    public Paciente buscarPaciente(Long id) {
        if(id == null) throw new PacienteNaoEncontradoException();
        return pacienteRepository.findById(id).orElseThrow(PacienteNaoEncontradoException::new);
    }

    private void validarPermissaoCadastro(Usuario usuarioLogado) {

        if (!usuarioLogado.isAdmin() && (
            usuarioLogado.getPerfil() == null || !usuarioLogado.getPerfil().isPermCadPaciente()
        )) {
            throw new UsuarioSemAutorizacao();
        }
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

    private PacienteDetalhesResponse mapeiaParaDetalhesDTO(
        Paciente paciente,
        Responsavel responsavel,
        DocumentoDetalhesResponse fichaAcolhimento
    ) {

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

        return new PacienteDetalhesResponse(
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
            responsavelResponse,
            fichaAcolhimento
        );
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
