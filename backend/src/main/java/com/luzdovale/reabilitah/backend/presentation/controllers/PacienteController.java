package com.luzdovale.reabilitah.backend.presentation.controllers;

import com.luzdovale.reabilitah.backend.application.DTO.documento.HistDocumentoResponse;
import com.luzdovale.reabilitah.backend.application.DTO.paciente.PacienteRequest;
import com.luzdovale.reabilitah.backend.application.DTO.paciente.PacienteResponse;
import com.luzdovale.reabilitah.backend.application.services.HistDocumentoService;
import com.luzdovale.reabilitah.backend.application.services.PacienteService;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pacientes")
public class PacienteController {
    @Autowired
    private PacienteService pacienteService;
    @Autowired
    private HistDocumentoService histDocumentoService;

    @GetMapping
    public ResponseEntity<List<PacienteResponse>> listar(@RequestParam(required = false) Boolean ativo) {

        return ResponseEntity.ok(
            pacienteService.listarTodos(ativo)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<PacienteResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(
            pacienteService.buscar(id)
        );
    }

    @PostMapping
    public ResponseEntity<PacienteResponse> criar(@RequestBody PacienteRequest dto, Authentication auth) {
        return ResponseEntity.ok(
            pacienteService.criar(dto, (Usuario) auth.getPrincipal())
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<PacienteResponse> editar(@PathVariable Long id, @RequestBody PacienteRequest dto, Authentication auth) {
        return ResponseEntity.ok(
            pacienteService.editar(id, dto, (Usuario) auth.getPrincipal())
        );
    }

    @GetMapping("/{id}/historico")
    public ResponseEntity<List<HistDocumentoResponse>> listarHistorico(@PathVariable Long id) {
        return ResponseEntity.ok(
                histDocumentoService.listarPorPaciente(id)
        );
    }
}
