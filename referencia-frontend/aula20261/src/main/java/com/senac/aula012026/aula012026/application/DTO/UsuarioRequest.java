package com.senac.aula012026.aula012026.application.DTO;

public record UsuarioRequest(
         String nome,
         String email,
         String senha,
         String cpf
) {
}
