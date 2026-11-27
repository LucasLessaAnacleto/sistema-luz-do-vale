package com.luzdovale.reabilitah.backend.domain.repository;

import com.luzdovale.reabilitah.backend.domain.entities.Paciente;
import com.luzdovale.reabilitah.backend.domain.valueobjects.CPF;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    boolean existsByCpf(CPF cpf);
    boolean existsByCpfAndIdNot(CPF cpf, Long id);
    long countByAtivoTrue();
    List<Paciente> findByAtivoTrueAndDtNascIsNotNull();
}
