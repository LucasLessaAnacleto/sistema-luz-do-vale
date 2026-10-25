package com.luzdovale.reabilitah.backend;

import com.luzdovale.reabilitah.backend.application.DTO.auth.LoginRequest;
import com.luzdovale.reabilitah.backend.application.DTO.auth.LoginResponse;
import com.luzdovale.reabilitah.backend.application.DTO.paciente.PacienteRequest;
import com.luzdovale.reabilitah.backend.application.DTO.paciente.PacienteResponse;
import com.luzdovale.reabilitah.backend.application.DTO.responsavel.ResponsavelRequest;
import com.luzdovale.reabilitah.backend.application.DTO.usuario.CriarUsuarioRequest;
import com.luzdovale.reabilitah.backend.application.DTO.usuario.EditarUsuarioRequest;
import com.luzdovale.reabilitah.backend.application.DTO.usuario.RedefinirSenhaDto;
import com.luzdovale.reabilitah.backend.application.DTO.usuario.UsuarioResponse;
import com.luzdovale.reabilitah.backend.domain.entities.*;
import com.luzdovale.reabilitah.backend.domain.enuns.EnumRoleUsuario;
import com.luzdovale.reabilitah.backend.domain.repository.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpMethod;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class TestesEndpoints {

    private static final String ADMIN = "regressao.admin@teste.invalid";
    private static final String MARIA = "regressao.maria@teste.invalid";
    private static final String MARIA_NOVA = "regressao.maria.nova@teste.invalid";
    private static final String PERFIL = "ENFERMAGEM_TESTE_REGRESSAO";
    private static final String PACIENTE = "PACIENTE_TESTE_REGRESSAO_JOAO";

    private int porta = 8080;

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private ProfissionalRepository profissionalRepository;
    @Autowired
    private PerfilRepository perfilRepository;
    @Autowired
    private PacienteRepository pacienteRepository;
    @Autowired
    private ResponsavelRepository responsavelRepository;
    @Autowired
    private TokenRepository tokenRepository;
    @Autowired
    private PasswordEncoder passwordEnconder;

    private RestClient http;
    private Long perfilId;

    @Test
    void deveTestarFluxoDeEndpoints() {
        preparar();
        try {

            // 1. Login do administrador.
            String tokenAdmin = login(ADMIN, "123456");

            // 2. POST /usuarios (DTO real da aplicação).
            CriarUsuarioRequest cadastro = new CriarUsuarioRequest(
                    "Maria Teste Regressao", "48988888888", "COREN-12345", "11144477735",
                    LocalDate.of(1995, 5, 10),
                    new Endereco("Rua das Flores", "250", "Centro", "Criciuma", "SC"),
                    MARIA, "123456", EnumRoleUsuario.ROLE_USER, perfilId
            );

            UsuarioResponse criado = http.post().uri("/usuarios")
                    .header("Authorization", "Bearer " + tokenAdmin)
                    .body(cadastro).retrieve().body(UsuarioResponse.class);

            assertNotNull(criado);
            assertNotNull(criado.id());
            assertNotNull(criado.profissionalId());
            assertEquals(MARIA, criado.email());
            assertEquals("Maria Teste Regressao", criado.nome());
            assertEquals(EnumRoleUsuario.ROLE_USER, criado.role());
            assertTrue(usuarioRepository.existsById(criado.id()));
            assertTrue(profissionalRepository.existsById(criado.profissionalId()));

            Long idMaria = criado.id();

            // 3. PATCH /usuarios/{id} — edição completa.
            UsuarioResponse editado = editar(idMaria, tokenAdmin, new EditarUsuarioRequest(
                    "Maria da Silva Teste", "48977777777", null, "93541134780",
                    LocalDate.of(1996, 6, 20),
                    new Endereco("Rua Nova", "300", "Michel", "Criciuma", "SC"),
                    MARIA_NOVA, EnumRoleUsuario.ROLE_USER, perfilId, true
            ));

            assertEquals("Maria da Silva Teste", editado.nome());
            assertEquals(MARIA_NOVA, editado.email());
            assertEquals("935.411.347-80", editado.cpf());
            assertEquals("Michel", editado.endereco().getBairro());

            // 4. Desativação e reativação.
            UsuarioResponse desativado = editar(idMaria, tokenAdmin,
                    new EditarUsuarioRequest(null, null, null, null, null, null,
                            null, null, null, false));
            assertFalse(desativado.ativo());
            assertNotNull(desativado.dtDesativado());

            UsuarioResponse reativado = editar(idMaria, tokenAdmin,
                    new EditarUsuarioRequest(null, null, null, null, null, null,
                            null, null, null, true));
            assertTrue(reativado.ativo());
            assertNull(reativado.dtDesativado());

            // 5. Atualização do perfil.
            UsuarioResponse comPerfil = editar(idMaria, tokenAdmin,
                    new EditarUsuarioRequest(null, null, null, null, null, null,
                            null, null, perfilId, null));
            assertEquals(perfilId, comPerfil.perfilId());

            // 6. PATCH /usuarios/{id}/senha — senha protegida por BCrypt.
            var respostaSenha = http.method(HttpMethod.PATCH).uri("/usuarios/{id}/senha", idMaria)
                    .header("Authorization", "Bearer " + tokenAdmin)
                    .body(new RedefinirSenhaDto("654321"))
                    .retrieve().toBodilessEntity();
            assertEquals(200, respostaSenha.getStatusCode().value());
            assertTrue(passwordEnconder.matches("654321", usuarioRepository.findById(idMaria).orElseThrow().getSenha()));

            // 7. A senha antiga não deve mais autenticar.
            assertThrows(HttpClientErrorException.Unauthorized.class, () -> login(MARIA_NOVA, "123456"));
            String tokenMaria = login(MARIA_NOVA, "654321");

            // 8. POST /pacientes — com responsável, usando DTOs reais.
            Endereco endereco = new Endereco("Rua das Palmeiras", "150", "Centro", "Criciuma", "SC");
            ResponsavelRequest responsavel = new ResponsavelRequest(
                    "Maria da Silva Teste", "Mae", "52998224725", "987654321",
                    "48999997777", endereco, LocalDate.of(1965, 4, 10)
            );
            PacienteRequest paciente = new PacienteRequest(
                    PACIENTE, "Joao", "11144477735", "123456789", "48999998888",
                    endereco, LocalDate.of(1990, 8, 15), responsavel
            );

            PacienteResponse pacienteCriado = http.post().uri("/pacientes")
                    .header("Authorization", "Bearer " + tokenMaria)
                    .body(paciente).retrieve().body(PacienteResponse.class);

            assertNotNull(pacienteCriado);
            assertNotNull(pacienteCriado.id());
            assertEquals(PACIENTE, pacienteCriado.nome());
            assertEquals("111.444.777-35", pacienteCriado.cpf());
            assertNotNull(pacienteCriado.responsavel());
            assertEquals("Maria da Silva Teste", pacienteCriado.responsavel().nome());
            assertEquals("529.982.247-25", pacienteCriado.responsavel().cpf());
            assertEquals(pacienteCriado.id(), responsavelRepository.findById(
                    pacienteCriado.responsavel().id()).orElseThrow().getPaciente().getId());
            assertTrue(pacienteRepository.existsById(pacienteCriado.id()));


        }finally {
            limpar();
        }
    }

    private String login(String email, String senha) {
        LoginResponse resposta = http.post().uri("/auth/login")
                .body(new LoginRequest(email, senha))
                .retrieve().body(LoginResponse.class);
        assertNotNull(resposta);
        assertNotNull(resposta.token());
        return resposta.token();
    }

    private UsuarioResponse editar(Long id, String token, EditarUsuarioRequest dados) {
        UsuarioResponse resposta = http.method(HttpMethod.PATCH).uri("/usuarios/{id}", id)
                .header("Authorization", "Bearer " + token)
                .body(dados).retrieve().body(UsuarioResponse.class);
        assertNotNull(resposta);
        return resposta;
    }

    private void preparar() {
        http = RestClient.create("http://localhost:" + porta);
        limpar();

        Perfil perfil = new Perfil();
        perfil.setNome(PERFIL);
        perfil.setPermCadPaciente(true);
        perfilId = perfilRepository.save(perfil).getId();

        Usuario admin = new Usuario();
        admin.setEmail(ADMIN);
        admin.setSenha(passwordEnconder.encode("123456"));
        admin.setRole(EnumRoleUsuario.ROLE_ADMIN);
        admin.setAtivo(true);
        usuarioRepository.save(admin);
    }

    private void limpar() {

        for (Paciente p : pacienteRepository.findAll()) {
            if (PACIENTE.equals(p.getNome())) {
                for (Responsavel r : responsavelRepository.findAll()) {
                    if (r.getPaciente() != null && p.getId().equals(r.getPaciente().getId())) {
                        responsavelRepository.delete(r);
                    }
                }
                pacienteRepository.delete(p);
            }
        }

        List<String> emailsTeste = List.of(ADMIN, MARIA, MARIA_NOVA);
        for (Token t : tokenRepository.findAll()) {
            if (t.getUsuario() != null && emailsTeste.contains(t.getUsuario().getEmail())) {
                tokenRepository.delete(t);
            }
        }
        for (String email : emailsTeste) {
            usuarioRepository.findByEmail(email).ifPresent(u -> {
                Profissional profissional = u.getProfissional();
                usuarioRepository.delete(u);
                if (profissional != null) profissionalRepository.delete(profissional);
            });
        }
        for (Perfil p : perfilRepository.findAll()) {
            if (PERFIL.equals(p.getNome())) perfilRepository.delete(p);
        }
    }
}
