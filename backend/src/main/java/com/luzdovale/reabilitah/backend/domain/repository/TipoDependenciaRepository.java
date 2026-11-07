package com.luzdovale.reabilitah.backend.domain.repository;

import com.luzdovale.reabilitah.backend.domain.entities.TipoDependencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TipoDependenciaRepository extends JpaRepository<TipoDependencia, Long> {

    List<TipoDependencia> findAllByOrderByNomeAsc();
}
