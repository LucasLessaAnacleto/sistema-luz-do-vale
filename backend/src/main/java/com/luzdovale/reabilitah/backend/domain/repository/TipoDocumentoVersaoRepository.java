package com.luzdovale.reabilitah.backend.domain.repository;

import com.luzdovale.reabilitah.backend.domain.entities.TipoDocumento;
import com.luzdovale.reabilitah.backend.domain.entities.TipoDocumentoVersao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TipoDocumentoVersaoRepository extends JpaRepository<TipoDocumentoVersao, Long> {

    Optional<TipoDocumentoVersao> findFirstByTipoDocumentoOrderByVersaoDesc(TipoDocumento tipoDocumento);
    Optional<TipoDocumentoVersao> findFirstByTemplateOrderByVersaoDesc(String template);
}
