package com.luzdovale.reabilitah.backend.presentation.controllers;

import com.luzdovale.reabilitah.backend.application.DTO.documento.OpcaoLista;
import com.luzdovale.reabilitah.backend.application.services.DocumentoCamposService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/listas")
public class ListaController {

    @Autowired
    private DocumentoCamposService documentoCamposService;

    @GetMapping("/{nomeLista}")
    public ResponseEntity<List<OpcaoLista>> buscar(@PathVariable String nomeLista) {

        return ResponseEntity.ok(documentoCamposService.buscaListaOpcao(nomeLista));
    }
}
