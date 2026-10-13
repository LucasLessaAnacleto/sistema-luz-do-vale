package com.luzdovale.reabilitah.backend.infra.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfiguration {

    @Bean
    public OpenAPI customOpenApi(){
        return new OpenAPI()
                .addSecurityItem( new SecurityRequirement().addList("bearerAuth"))
                .components(new Components().addSecuritySchemes("bearerAuth",
                        new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Autenticação por token JWT.")
                ))
                .info( new Info()
                        .title("API Reabilitah - Luz do Vale")
                        .version("1.0")
                        .description("API REST do Reabilitah, sistema de prontuário eletrônico desenvolvido para a instituição Luz do Vale.")
                        // .termsOfService("")
                );
    }


}

