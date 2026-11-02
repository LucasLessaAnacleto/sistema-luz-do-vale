package com.luzdovale.reabilitah.backend.application.services;

import com.luzdovale.reabilitah.backend.application.exceptions.TipoDocumentoNaoEncontradoException;
import com.luzdovale.reabilitah.backend.application.exceptions.TipoDocumentoVersaoNaoEncontradoExeption;
import com.luzdovale.reabilitah.backend.domain.entities.TipoDocumento;
import com.luzdovale.reabilitah.backend.domain.entities.TipoDocumentoVersao;
import com.luzdovale.reabilitah.backend.domain.repository.TipoDocumentoRepository;
import com.luzdovale.reabilitah.backend.domain.repository.TipoDocumentoVersaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TipoDocumentoService {
    @Autowired
    private TipoDocumentoRepository tipoDocumentoRepository;
    @Autowired
    private TipoDocumentoVersaoRepository versaoRepository;

    TipoDocumentoVersao ultimaVersaoDocumento(Long tipoDocumentoId){
        TipoDocumento tipoDocumento = tipoDocumentoRepository
                .findById(tipoDocumentoId)
                .orElseThrow(() -> new TipoDocumentoNaoEncontradoException(tipoDocumentoId));

        return versaoRepository
                .findFirstByTipoDocumentoOrderByVersaoDesc(tipoDocumento)
                .orElseThrow(() -> new TipoDocumentoVersaoNaoEncontradoExeption());
    }


}
