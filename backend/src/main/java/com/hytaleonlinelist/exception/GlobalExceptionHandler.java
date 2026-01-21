package com.hytaleonlinelist.exception;

import com.hytaleonlinelist.filter.CorrelationIdFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Global exception handler that provides consistent error responses
 * and comprehensive logging for all exceptions.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // ========== Custom Application Exceptions ==========

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
        log.warn("Resource not found: {} | Path: {}", ex.getMessage(), request.getRequestURI());

        return buildErrorResponse(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(), request);
    }

    @ExceptionHandler(VoteAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleVoteAlreadyExists(VoteAlreadyExistsException ex, HttpServletRequest request) {
        log.info("Vote conflict: {} | Path: {}", ex.getMessage(), request.getRequestURI());

        return buildErrorResponse(HttpStatus.CONFLICT, "Conflict", ex.getMessage(), request);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException ex, HttpServletRequest request) {
        log.warn("Unauthorized access attempt: {} | Path: {}", ex.getMessage(), request.getRequestURI());

        return buildErrorResponse(HttpStatus.UNAUTHORIZED, "Unauthorized", ex.getMessage(), request);
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ErrorResponse> handleForbidden(ForbiddenException ex, HttpServletRequest request) {
        log.warn("Forbidden access: {} | Path: {}", ex.getMessage(), request.getRequestURI());

        return buildErrorResponse(HttpStatus.FORBIDDEN, "Forbidden", ex.getMessage(), request);
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ErrorResponse> handleConflict(ConflictException ex, HttpServletRequest request) {
        log.info("Conflict: {} | Path: {}", ex.getMessage(), request.getRequestURI());

        return buildErrorResponse(HttpStatus.CONFLICT, "Conflict", ex.getMessage(), request);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException ex, HttpServletRequest request) {
        log.info("Bad request: {} | Path: {}", ex.getMessage(), request.getRequestURI());

        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request);
    }

    // ========== Spring Security Exceptions ==========

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        log.warn("Access denied: {} | Path: {}", ex.getMessage(), request.getRequestURI());

        return buildErrorResponse(HttpStatus.FORBIDDEN, "Forbidden", "Access denied", request);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException ex, HttpServletRequest request) {
        log.warn("Authentication failed: {} | Path: {}", ex.getMessage(), request.getRequestURI());

        return buildErrorResponse(HttpStatus.UNAUTHORIZED, "Unauthorized", "Authentication failed", request);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex, HttpServletRequest request) {
        log.warn("Invalid credentials | Path: {}", request.getRequestURI());

        return buildErrorResponse(HttpStatus.UNAUTHORIZED, "Unauthorized", "Invalid credentials", request);
    }

    // ========== Validation Exceptions ==========

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> new FieldError(err.getField(), err.getDefaultMessage()))
                .toList();

        log.info("Validation failed: {} errors | Path: {} | Fields: {}",
                fieldErrors.size(), request.getRequestURI(),
                fieldErrors.stream().map(FieldError::field).toList());

        ValidationErrorResponse error = new ValidationErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Validation Failed",
                "One or more fields have validation errors",
                fieldErrors,
                formatTimestamp(),
                request.getRequestURI(),
                CorrelationIdFilter.getCurrentCorrelationId()
        );
        return ResponseEntity.badRequest().body(error);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException ex, HttpServletRequest request) {
        log.info("Constraint violation: {} | Path: {}", ex.getMessage(), request.getRequestURI());

        // Extract a cleaner message from constraint violations
        String message = ex.getConstraintViolations().stream()
                .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                .reduce((a, b) -> a + "; " + b)
                .orElse(ex.getMessage());

        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Bad Request", message, request);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingParameter(MissingServletRequestParameterException ex, HttpServletRequest request) {
        log.info("Missing parameter: {} | Path: {}", ex.getParameterName(), request.getRequestURI());

        String message = String.format("Required parameter '%s' is missing", ex.getParameterName());
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Bad Request", message, request);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        log.info("Type mismatch: parameter={}, value={} | Path: {}",
                ex.getName(), ex.getValue(), request.getRequestURI());

        String message = String.format("Invalid value '%s' for parameter '%s'", ex.getValue(), ex.getName());
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Bad Request", message, request);
    }

    // ========== Standard Exceptions ==========

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalState(IllegalStateException ex, HttpServletRequest request) {
        log.warn("Illegal state: {} | Path: {}", ex.getMessage(), request.getRequestURI());

        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex, HttpServletRequest request) {
        log.info("Illegal argument: {} | Path: {}", ex.getMessage(), request.getRequestURI());

        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request);
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(NoHandlerFoundException ex, HttpServletRequest request) {
        log.warn("No handler found for {} {} | Path: {}",
                ex.getHttpMethod(), ex.getRequestURL(), request.getRequestURI());

        return buildErrorResponse(HttpStatus.NOT_FOUND, "Not Found",
                "The requested resource was not found", request);
    }

    // ========== Catch-all Handler ==========

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, HttpServletRequest request) {
        // Log the full stack trace for unexpected errors
        String correlationId = CorrelationIdFilter.getCurrentCorrelationId();

        log.error("Unexpected error occurred | Path: {} | CorrelationId: {} | Exception: {}",
                request.getRequestURI(), correlationId, ex.getClass().getName(), ex);

        // Return generic message to client (don't expose internal details)
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error",
                "An unexpected error occurred. Please try again later.", request);
    }

    // ========== Helper Methods ==========

    private ResponseEntity<ErrorResponse> buildErrorResponse(HttpStatus status, String error,
                                                             String message, HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(
                status.value(),
                error,
                message,
                formatTimestamp(),
                request.getRequestURI(),
                CorrelationIdFilter.getCurrentCorrelationId()
        );
        return ResponseEntity.status(status).body(errorResponse);
    }

    private String formatTimestamp() {
        return DateTimeFormatter.ISO_INSTANT.format(Instant.now());
    }

    // ========== Response Records ==========

    /**
     * Standard error response structure.
     */
    public record ErrorResponse(
            int status,
            String error,
            String message,
            String timestamp,
            String path,
            String correlationId
    ) {}

    /**
     * Error response with field-level validation errors.
     */
    public record ValidationErrorResponse(
            int status,
            String error,
            String message,
            List<FieldError> fieldErrors,
            String timestamp,
            String path,
            String correlationId
    ) {}

    /**
     * Individual field error.
     */
    public record FieldError(
            String field,
            String message
    ) {}
}
