package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.domain.repository.TipoDocumentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TipoDocumentoService {
    @Autowired
    private TipoDocumentoRepository tipoDocumentoRepository;


}
