package com.luzdovale.reabilitah.backend.domain.repository;

import com.luzdovale.reabilitah.backend.domain.entities.Documento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface DocumentoRepository extends JpaRepository<Documento, Long> {
    List<Documento> findByDocumentoOrigem(Documento documentoOrigem);

    Page<Documento> findByAtivoTrueOrderByDtCriacaoDesc(Pageable pageable);

    List<Documento> findTop10ByAtivoTrueAndDtCriacaoGreaterThanEqualOrderByDtCriacaoDesc(LocalDateTime data);
}
