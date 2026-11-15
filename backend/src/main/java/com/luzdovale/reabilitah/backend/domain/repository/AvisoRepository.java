package com.luzdovale.reabilitah.backend.domain.repository;


import com.luzdovale.reabilitah.backend.domain.entities.Aviso;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AvisoRepository extends JpaRepository<Aviso, Long> {

    Page<Aviso> findByAtivo(boolean ativo, Pageable pageable);
    List<Aviso> findByAtivoTrueAndDtFinalizacaoLessThanEqual(LocalDateTime dtFinalizacao);
}
