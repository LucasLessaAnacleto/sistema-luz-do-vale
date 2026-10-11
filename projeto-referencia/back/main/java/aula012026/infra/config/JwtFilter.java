package com.senac.aula012026.aula012026.infra.config;


import com.senac.aula012026.aula012026.application.services.TokenService;
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

    @Autowired
    private TokenService tokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Liberação de metodos para nao travar o token JWT
        if(path.equals("/auth/login")
                || path.startsWith("/swagger-ui")
                || path.startsWith("/webjars")
                || path.startsWith("/usuarios/adm")
                || path.startsWith("/swagger-resources")
                || path.startsWith("/v3/api-docs")
                || request.getMethod().startsWith("OPTIONS") )
        {
            filterChain.doFilter(request,response);
            return;
        }

        String header = request.getHeader("Authorization");

        if(header != null&& header.startsWith("Bearer ")){
            String token = header.replace("Bearer ","");

            //Validar TOken JWT
            var retornotoken =tokenService.validarToken(token);

            var usuarioLogado  = retornotoken;

            UsernamePasswordAuthenticationToken usuario = new UsernamePasswordAuthenticationToken(
                    usuarioLogado,
                    null,
                    usuarioLogado.getAuthorities()
            );

            SecurityContextHolder.getContext().setAuthentication(usuario);



        }else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token não informado ou invalido");
            return;
        }

        filterChain.doFilter(request,response);



    }
}
