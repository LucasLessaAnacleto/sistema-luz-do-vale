package com.luzdovale.reabilitah.backend.presentation.controllers;

import com.luzdovale.reabilitah.backend.application.DTO.documento.HistDocumentoResponse;
import com.luzdovale.reabilitah.backend.application.DTO.paciente.PacienteDetalhesResponse;
import com.luzdovale.reabilitah.backend.application.DTO.paciente.PacienteRequest;
import com.luzdovale.reabilitah.backend.application.DTO.paciente.PacienteResponse;
import com.luzdovale.reabilitah.backend.application.services.HistDocumentoService;
import com.luzdovale.reabilitah.backend.application.services.PacienteService;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pacientes")
@Tag(name = "Pacientes", description = "Cadastro, consulta e atualização de pacientes e consulta ao histórico de seus documentos.")
public class PacienteController {
    @Autowired
    private PacienteService pacienteService;
    @Autowired
    private HistDocumentoService histDocumentoService;

    @GetMapping
    @Operation(summary = "Listar pacientes", description = "Retorna a lista de pacientes, com filtro opcional pelo status ativo.")
    public ResponseEntity<List<PacienteResponse>> listar(@RequestParam(required = false) Boolean ativo) {

        return ResponseEntity.ok(
            pacienteService.listarTodos(ativo)
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consultar paciente", description = "Retorna os detalhes do paciente identificado pelo ID.")
    public ResponseEntity<PacienteDetalhesResponse> buscar(@PathVariable Long id) {

        return ResponseEntity.ok(pacienteService.buscar(id));
    }

    @PostMapping
    @Operation(summary = "Cadastrar paciente", description = "Cadastra um paciente com os dados informados, considerando o usuário autenticado.")
    public ResponseEntity<PacienteResponse> criar(@RequestBody PacienteRequest dto, Authentication auth) {
        return ResponseEntity.ok(
            pacienteService.criar(dto, (Usuario) auth.getPrincipal())
        );
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar paciente", description = "Atualiza os dados do paciente identificado pelo ID, considerando o usuário autenticado.")
    public ResponseEntity<PacienteResponse> editar(@PathVariable Long id, @RequestBody PacienteRequest dto, Authentication auth) {
        return ResponseEntity.ok(
            pacienteService.editar(id, dto, (Usuario) auth.getPrincipal())
        );
    }

    @GetMapping("/{id}/historico")
    @Operation(summary = "Consultar histórico de documentos do paciente", description = "Retorna o histórico de documentos do paciente identificado pelo ID, com filtro opcional por usuário.")
    public ResponseEntity<List<HistDocumentoResponse>> listarHistorico(@PathVariable Long id, @RequestParam(required = false) Long usuarioId) {
        return ResponseEntity.ok(
                histDocumentoService.listarPorPaciente(id, usuarioId)
        );
    }
}
