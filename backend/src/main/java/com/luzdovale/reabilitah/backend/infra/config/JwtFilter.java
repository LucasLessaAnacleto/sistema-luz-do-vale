package com.luzdovale.reabilitah.backend.infra.config;

import com.luzdovale.reabilitah.backend.application.exceptions.ErroTokenInvalido;
import com.luzdovale.reabilitah.backend.application.services.TokenService;
import com.luzdovale.reabilitah.backend.domain.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final TokenService tokenService;

    public JwtFilter(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();

        // Liberação de metodos para nao travar o token JWT
        return path.equals("/auth/login")
                || path.startsWith("/swagger-ui")
                || path.startsWith("/webjars")
                || path.startsWith("/swagger-resources")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/error")
                || request.getMethod().equalsIgnoreCase("OPTIONS");
    }

    @Override
    public void doFilterInternal(HttpServletRequest request,
                         HttpServletResponse response,
                         FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if(header == null || !header.startsWith("Bearer ")){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token nao informado ou invalido");
            return;
        }
        String token = header.replace("Bearer ", "");

        try{
            // Validar token JWT
            var usuarioLogado = tokenService.validarToken(token);

            UsernamePasswordAuthenticationToken usuario = new UsernamePasswordAuthenticationToken(
                    usuarioLogado,
                    null,
                    usuarioLogado.getAuthorities()
            );

            SecurityContextHolder.getContext().setAuthentication(usuario);

        } catch (RuntimeException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token invalido ou expirado");
            return;
        }

        filterChain.doFilter(request, response);
    }
}

