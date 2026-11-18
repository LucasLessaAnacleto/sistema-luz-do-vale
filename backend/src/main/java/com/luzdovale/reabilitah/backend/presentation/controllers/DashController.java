package com.luzdovale.reabilitah.backend.presentation.controllers;

import com.luzdovale.reabilitah.backend.application.DTO.dash.DashResponse;
import com.luzdovale.reabilitah.backend.application.services.DashService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
public class DashController {
    @Autowired
    private DashService dashService;

    @GetMapping
    public ResponseEntity<DashResponse> indicadoresGerais(){

        return ResponseEntity.ok( dashService.indicadoresGerais() );
    }
}
