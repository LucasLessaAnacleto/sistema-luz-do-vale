package com.senac.aula012026.aula012026.application.DTO;

import com.senac.aula012026.aula012026.domain.entities.Usuario;

public record UsuarioResponse (
        Long id,
        String nome,
        String email,
        String status
) {
    public UsuarioResponse(Usuario usuario){
        this(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getStatus().toString()
        );
    }




}
