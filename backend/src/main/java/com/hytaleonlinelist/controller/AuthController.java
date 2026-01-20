package com.hytaleonlinelist.controller;

import com.hytaleonlinelist.config.AppProperties;
import com.hytaleonlinelist.dto.request.ForgotPasswordRequest;
import com.hytaleonlinelist.dto.request.LoginRequest;
import com.hytaleonlinelist.dto.request.RegisterRequest;
import com.hytaleonlinelist.dto.request.ResetPasswordRequest;
import com.hytaleonlinelist.dto.response.AuthResponse;
import com.hytaleonlinelist.dto.response.MessageResponse;
import com.hytaleonlinelist.dto.response.RegistrationStatusResponse;
import com.hytaleonlinelist.exception.BadRequestException;
import com.hytaleonlinelist.security.UserPrincipal;
import com.hytaleonlinelist.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final AppProperties appProperties;

    public AuthController(AuthService authService, AppProperties appProperties) {
        this.authService = authService;
        this.appProperties = appProperties;
    }

    @GetMapping("/registration-status")
    public ResponseEntity<RegistrationStatusResponse> getRegistrationStatus() {
        return ResponseEntity.ok(new RegistrationStatusResponse(
                appProperties.isRegistrationEnabled(),
                appProperties.isDiscordLoginEnabled(),
                appProperties.isGoogleLoginEnabled()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {
        if (!appProperties.isRegistrationEnabled()) {
            throw new BadRequestException("Registration is currently disabled");
        }
        AuthResponse authResponse = authService.register(request, response);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        AuthResponse authResponse = authService.login(request, response);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(
            @AuthenticationPrincipal UserPrincipal principal,
            HttpServletResponse response) {
        if (principal != null) {
            authService.logout(principal.id(), response);
        } else {
            // Still clear cookies even if not authenticated
            response.addCookie(createExpiredCookie("access_token", "/"));
            response.addCookie(createExpiredCookie("refresh_token", "/api/auth/refresh"));
        }
        return ResponseEntity.ok(new MessageResponse("Logged out successfully"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            HttpServletRequest request,
            HttpServletResponse response) {
        String refreshToken = extractRefreshToken(request);
        AuthResponse authResponse = authService.refresh(refreshToken, response);
        return ResponseEntity.ok(authResponse);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        AuthResponse authResponse = authService.getCurrentUser(principal.id());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/verify-email")
    public ResponseEntity<MessageResponse> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok(new MessageResponse("Email verified successfully"));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<MessageResponse> resendVerification(
            @AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        authService.resendVerificationEmail(principal.id());
        return ResponseEntity.ok(new MessageResponse("Verification email sent"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.email());
        // Always return success to prevent email enumeration
        return ResponseEntity.ok(new MessageResponse("If an account exists with that email, a password reset link has been sent"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.token(), request.password());
        return ResponseEntity.ok(new MessageResponse("Password reset successfully"));
    }

    private String extractRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }

        return Arrays.stream(cookies)
                .filter(c -> "refresh_token".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    private Cookie createExpiredCookie(String name, String path) {
        Cookie cookie = new Cookie(name, "");
        cookie.setHttpOnly(true);
        cookie.setPath(path);
        cookie.setMaxAge(0);
        return cookie;
    }
}
