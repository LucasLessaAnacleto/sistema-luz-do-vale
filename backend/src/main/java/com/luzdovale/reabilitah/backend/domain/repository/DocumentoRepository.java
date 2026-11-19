package com.luzdovale.reabilitah.backend.domain.repository;

import com.luzdovale.reabilitah.backend.domain.entities.Documento;
import com.luzdovale.reabilitah.backend.domain.enuns.EnumStatusDocumento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.print.Doc;
import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface DocumentoRepository extends JpaRepository<Documento, Long> {

    List<Documento> findByDocumentoOrigem(Documento documentoOrigem);
    List<Documento> findAllByAtivoTrue();
    Page<Documento> findByAtivoTrueOrderByDtCriacaoDesc(Pageable pageable);
    Page<Documento> findByAtivoTrueAndStatusOrderByDtCriacaoDesc(
        EnumStatusDocumento status,
        Pageable pageable
    );
    long countByAtivoTrue();
    long countByAtivoTrueAndStatus(EnumStatusDocumento status);
    List<Documento> findTop10ByAtivoTrueAndDtCriacaoGreaterThanEqualOrderByDtCriacaoDesc(
        LocalDateTime data
    );
}
