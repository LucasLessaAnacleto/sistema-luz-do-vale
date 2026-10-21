package com.luzdovale.reabilitah.backend.domain.repository;

import com.luzdovale.reabilitah.backend.domain.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail_Email(String email);
    boolean existsByEmail_Email(String email);

}
