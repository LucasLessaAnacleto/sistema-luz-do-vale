package com.luzdovale.reabilitah.backend.domain.repository;

import com.luzdovale.reabilitah.backend.domain.entities.Documento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface DocumentoRepository extends JpaRepository<Documento, Long> {
//    List<Documento> findByDocumentoOrigem(Documento documentoOrigem);
}
