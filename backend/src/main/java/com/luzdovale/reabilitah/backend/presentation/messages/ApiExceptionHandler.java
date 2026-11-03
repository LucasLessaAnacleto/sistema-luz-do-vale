package com.luzdovale.reabilitah.backend.presentation.messages;

import com.luzdovale.reabilitah.backend.application.exceptions.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(ApiExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorMessage> handleException(Exception ex, HttpServletRequest request) {

        logger.error("Erro interno na request: %s".formatted(request.getRequestURI()),ex);

        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR,"Erro interno no sistema");
    }

    @ExceptionHandler(TipoDocumentoVersaoNaoEncontradoExeption.class)
    public ResponseEntity<ApiErrorMessage> handleTipoDocumentoSemVersao(
            TipoDocumentoVersaoNaoEncontradoExeption ex,
            HttpServletRequest request
    ) {
        logger.error("Erro interno na request: {}", request.getRequestURI(), ex);

        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    @ExceptionHandler(CamposDocumentoInvalidosException.class)
    public ResponseEntity<ApiErrorMessage> handleCamposDocumentoInvalidos(CamposDocumentoInvalidosException ex) {

        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }
    
    @ExceptionHandler({
            IllegalArgumentException.class,
            DadosDocumentoInvalidosException.class
    })
    public ResponseEntity<ApiErrorMessage> handleIllegalArgument(RuntimeException ex) {

        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(EmailJaCadastradoException.class)
    public ResponseEntity<ApiErrorMessage> handleEmailJaCadastrado(EmailJaCadastradoException ex) {

        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(ErroAoVerificarAutenticacao.class)
    public ResponseEntity<ApiErrorMessage> handleErroAoVerificarAutenticacao(ErroAoVerificarAutenticacao ex) {

        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR,ex.getMessage());
    }

    @ExceptionHandler(UsuarioSemAutorizacao.class)
    public ResponseEntity<ApiErrorMessage> handleUsuarioSemAutorizacao(UsuarioSemAutorizacao ex) {

        return buildResponse(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    @ExceptionHandler({
        PerfilNaoEncontradoException.class,
        ProfissionalNaoEncontradoException.class,
        UsuarioNaoEncontradoException.class,
        PacienteNaoEncontradoException.class,
        TipoDocumentoNaoEncontradoException.class
    })
    public ResponseEntity<ApiErrorMessage> handleNaoEncontrado(RuntimeException ex) {

        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    private ResponseEntity<ApiErrorMessage> buildResponse(HttpStatus status, String message) {
        ApiErrorMessage error = new ApiErrorMessage(status, message);
        return ResponseEntity.status(status).body(error);
    }
}
