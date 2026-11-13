package com.luzdovale.reabilitah.backend.presentation.controllers;

import com.luzdovale.reabilitah.backend.application.DTO.documento.OpcaoLista;
import com.luzdovale.reabilitah.backend.application.services.DocumentoCamposService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/listas")
@Tag(name = "Listas", description = "Consulta de listas de opções utilizadas nos campos dos documentos.")
public class ListaController {

    @Autowired
    private DocumentoCamposService documentoCamposService;

    @GetMapping("/{nomeLista}")
    @Operation(summary = "Consultar opções de uma lista", description = "Retorna as opções da lista identificada pelo nome informado.")
    public ResponseEntity<List<OpcaoLista>> buscar(@PathVariable String nomeLista) {

        return ResponseEntity.ok(documentoCamposService.buscaListaOpcao(nomeLista));
    }
}
