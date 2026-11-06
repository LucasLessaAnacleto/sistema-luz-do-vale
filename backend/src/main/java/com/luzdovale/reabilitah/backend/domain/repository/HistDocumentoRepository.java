package com.luzdovale.reabilitah.backend.domain.repository;

import com.luzdovale.reabilitah.backend.domain.entities.Documento;
import com.luzdovale.reabilitah.backend.domain.entities.HistDocumento;
import com.luzdovale.reabilitah.backend.domain.entities.Paciente;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistDocumentoRepository extends JpaRepository<HistDocumento, Long> {
    List<HistDocumento> findByPacienteOrderByDtCriacaoDesc(Paciente paciente);
    List<HistDocumento> findByPacienteAndCriadoPorOrderByDtCriacaoDesc(Paciente paciente, Usuario criadoPor);
    List<HistDocumento> findByDocumentoOrderByDtCriacaoDesc(Documento documento);
}
