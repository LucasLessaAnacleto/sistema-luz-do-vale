package com.luzdovale.reabilitah.backend.presentation.controllers;

import com.luzdovale.reabilitah.backend.application.DTO.dash.AniversarianteResponse;
import com.luzdovale.reabilitah.backend.application.DTO.dash.DashResponse;
import com.luzdovale.reabilitah.backend.application.services.DashService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
public class DashController {
    @Autowired
    private DashService dashService;

    @GetMapping
    public ResponseEntity<DashResponse> indicadoresGerais(){

        return ResponseEntity.ok( dashService.indicadoresGerais() );
    }

    @GetMapping("/documentos-mes")
    public ResponseEntity<Long> contarDocumentosMes(@RequestParam int ano, @RequestParam int mes){

        return ResponseEntity.ok(dashService.contarDocumentosMes(ano, mes));
    }

    @GetMapping("/proximos-aniversariantes")
    public ResponseEntity<List<AniversarianteResponse>> proximosAniversariantes(){

        return ResponseEntity.ok(dashService.proximosAniversariantes());
    }
}
