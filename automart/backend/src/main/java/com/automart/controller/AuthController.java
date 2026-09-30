package com.automart.controller;

import com.automart.dto.request.*;
import com.automart.dto.response.ApiResponse;
import com.automart.dto.response.AuthResponse;
import com.automart.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.automart.dto.response.LogoutResponse;
import com.automart.service.LogoutService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping({"/api/v1/auth", "/api/auth"})
public class AuthController {

    private final AuthService authService;
    private final LogoutService logoutService;

    // Constructor Dependency Injection
    public AuthController(AuthService authService, LogoutService logoutService) {
        this.authService = authService;
        this.logoutService = logoutService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<LogoutResponse> logout(HttpServletRequest request,
                                                 HttpServletResponse response,
                                                 @RequestHeader(value = "Authorization", required = false) String authHeader) {
        String token = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }
        LogoutResponse logoutResponse = logoutService.performLogout(token, request, response);
        return ResponseEntity.ok(logoutResponse);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(authService.forgotPassword(request));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        return ResponseEntity.ok(authService.verifyOtp(request));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse> changePassword(Authentication authentication,
                                                      @Valid @RequestBody ChangePasswordRequest request) {
        return ResponseEntity.ok(authService.changePassword(authentication.getName(), request));
    }
}
