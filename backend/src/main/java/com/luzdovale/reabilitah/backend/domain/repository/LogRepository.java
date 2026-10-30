package com.luzdovale.reabilitah.backend.domain.repository;

import com.luzdovale.reabilitah.backend.domain.entities.Log;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogRepository extends JpaRepository<Log, Long> {
}
