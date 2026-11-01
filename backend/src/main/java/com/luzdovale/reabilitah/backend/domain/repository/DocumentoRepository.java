package com.luzdovale.reabilitah.backend.domain.repository;

import com.luzdovale.reabilitah.backend.domain.entities.Documento;
import com.luzdovale.reabilitah.backend.domain.entities.Paciente;
import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentoRepository extends JpaRepository<Documento, Long> {
    List<Documento> findByPaciente(Paciente paciente);
    List<Documento> findByPacienteAndUsuario(Paciente paciente, Usuario criadoPor);
}
