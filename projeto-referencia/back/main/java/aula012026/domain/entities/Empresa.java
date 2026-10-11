package com.senac.aula012026.aula012026.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String RazaoSocial;

    private String NomeFantasia;

    private String CNPJ;

    @OneToMany(mappedBy = "empresa")
    private List<Usuario> usuarios;

}
