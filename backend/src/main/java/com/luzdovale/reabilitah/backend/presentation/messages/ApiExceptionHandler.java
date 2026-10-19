package com.luzdovale.reabilitah.backend.presentation.messages;

import com.luzdovale.reabilitah.backend.application.exceptions.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorMessage> handleIllegalArgument(IllegalArgumentException ex) {

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
        UsuarioNaoEncontradoException.class
    })
    public ResponseEntity<ApiErrorMessage> handleNaoEncontrado(RuntimeException ex) {

        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    private ResponseEntity<ApiErrorMessage> buildResponse(HttpStatus status, String message) {
        ApiErrorMessage error = new ApiErrorMessage(status, message);
        return ResponseEntity.status(status).body(error);
    }
}
