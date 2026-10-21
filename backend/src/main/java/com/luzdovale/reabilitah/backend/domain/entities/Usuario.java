package com.luzdovale.reabilitah.backend.domain.entities;

import com.luzdovale.reabilitah.backend.domain.valueobjects.Email;
import com.luzdovale.reabilitah.backend.domain.enuns.EnumRoleUsuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Embedded
    private Email email;

    @Column(nullable = false)
    private String senha;

    @ManyToOne
    @JoinColumn(name = "perfil_id")
    private Perfil perfil;

    @OneToOne
    @JoinColumn(name = "profissional_id")
    private Profissional profissional;

    @Enumerated(EnumType.STRING)
    private EnumRoleUsuario role = EnumRoleUsuario.ROLE_USER;

    private Boolean ativo = true;

    private LocalDateTime dtDesativado;

    private LocalDateTime dtCriacao = LocalDateTime.now();

    public boolean isAdmin(){
        return role.equals(EnumRoleUsuario.ROLE_ADMIN);
    }

    @Override
    @NonNull
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(this.role.name()));
    }

    @Override
    public @Nullable String getPassword() {
        return this.senha;
    }

    @Override
    @NonNull
    public String getUsername() {
        return this.email.toString();
    }

    @Override
    public boolean isEnabled() {
        return this.ativo;
    }

}
