package com.luzdovale.reabilitah.backend.presentation.controllers;

import com.luzdovale.reabilitah.backend.application.DTO.documento.OpcaoLista;
import com.luzdovale.reabilitah.backend.application.services.DocumentoCamposService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tipos-dependencia")
public class TipoDependenciaController {

    @Autowired
    private DocumentoCamposService documentoCamposService;

    @GetMapping
    public ResponseEntity<Map<String, List<OpcaoLista>>> listar() {
        return ResponseEntity.ok(Map.of(
                "tipos", documentoCamposService.buscaListaOpcao("TIPO_DEPENDENCIA"),
                "licitas", documentoCamposService.buscaListaOpcao("TIPO_DEPENDENCIA_LICITA"),
                "ilicitas", documentoCamposService.buscaListaOpcao("TIPO_DEPENDENCIA_ILICITA")
        ));
    }
}
