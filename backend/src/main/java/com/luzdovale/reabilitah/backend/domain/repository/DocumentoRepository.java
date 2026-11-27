package com.luzdovale.reabilitah.backend.domain.repository;

import com.luzdovale.reabilitah.backend.domain.entities.Documento;
import com.luzdovale.reabilitah.backend.domain.enuns.EnumStatusDocumento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    // busca por paciente, tipo de documento, quem criou ou hash
    @Query("""
        SELECT d FROM Documento d
        LEFT JOIN d.criadoPor u
        LEFT JOIN u.profissional p
        WHERE d.ativo = true
          AND (:status IS NULL OR d.status = :status)
          AND (
              LOWER(d.paciente.nome) LIKE LOWER(CONCAT('%', :busca, '%'))
              OR LOWER(d.paciente.apelido) LIKE LOWER(CONCAT('%', :busca, '%'))
              OR LOWER(d.tipoDocumentoVersao.tipoDocumento.nome) LIKE LOWER(CONCAT('%', :busca, '%'))
              OR LOWER(p.nome) LIKE LOWER(CONCAT('%', :busca, '%'))
              OR LOWER(u.email) LIKE LOWER(CONCAT('%', :busca, '%'))
              OR d.hash LIKE LOWER(CONCAT('%', :busca, '%'))
          )
        ORDER BY d.dtCriacao DESC
    """)
    Page<Documento> buscar(
        @Param("busca") String busca,
        @Param("status") EnumStatusDocumento status,
        Pageable pageable
    );

    long countByAtivoTrue();
    long countByAtivoTrueAndStatus(EnumStatusDocumento status);
    List<Documento> findTop10ByAtivoTrueAndDtCriacaoGreaterThanEqualOrderByDtCriacaoDesc(
        LocalDateTime data
    );
    long countByAtivoTrueAndDtCriacaoGreaterThanEqualAndDtCriacaoLessThan(
        LocalDateTime inicio,
        LocalDateTime fim
    );
}
