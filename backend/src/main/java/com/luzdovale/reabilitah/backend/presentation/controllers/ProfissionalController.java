package com.luzdovale.reabilitah.backend.presentation;

import com.luzdovale.reabilitah.backend.application.DTO.profissional.CriarProfissionalRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/profissionais")
public class ProfissionalController {

    @PostMapping
    public ResponseEntity<?> criarProfissional(@RequestBody CriarProfissionalRequest request){

        return ResponseEntity.ok().build();
    }
}
