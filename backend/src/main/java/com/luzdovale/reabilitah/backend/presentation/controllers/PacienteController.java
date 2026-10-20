package com.luzdovale.reabilitah.backend.presentation.controllers;

import com.luzdovale.reabilitah.backend.application.DTO.paciente.PacienteRequest;
import com.luzdovale.reabilitah.backend.application.services.PacienteService;
import com.luzdovale.reabilitah.backend.domain.entities.Paciente;
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

    @GetMapping
    public ResponseEntity<List<Paciente>> listar(@RequestParam(required = false) Boolean ativo) {

        return ResponseEntity.ok(
                pacienteService.listarTodos(ativo)
        );
    }

    @PostMapping
    public ResponseEntity<Paciente> criar(@RequestBody PacienteRequest dto, Authentication auth) {
        return ResponseEntity.ok(
            pacienteService.criar(dto, (Usuario) auth.getPrincipal())
        );
    }
}
