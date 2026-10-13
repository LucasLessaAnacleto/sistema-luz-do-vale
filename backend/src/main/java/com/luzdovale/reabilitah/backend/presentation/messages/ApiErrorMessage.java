package com.luzdovale.reabilitah.backend.presentation.messages;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
public class ApiErrorMessage {
    private HttpStatus status;
    private String message;
}
