package com.luzdovale.reabilitah.backend.domain.repository;

import com.luzdovale.reabilitah.backend.domain.entities.Perfil;
import com.luzdovale.reabilitah.backend.domain.entities.PermissaoTipoDocumento;
import com.luzdovale.reabilitah.backend.domain.entities.TipoDocumento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PermissaoTipoDocumentoRepository extends JpaRepository<PermissaoTipoDocumento, Long> {

    boolean existsByPerfilAndTipoDocumento(Perfil perfil, TipoDocumento tipoDocumento);
}