package com.crm.portal.controller;

import com.crm.portal.dto.AuthResponse;
import com.crm.portal.dto.LoginRequest;
import com.crm.portal.dto.RegisterRequest;
import com.crm.portal.dto.UserDto;
import com.crm.portal.security.TokenExtractor;
import com.crm.portal.security.TokenService;
import com.crm.portal.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me() {
        return ResponseEntity.ok(authService.me());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        // Invalidate the token server-side (see InMemoryTokenService).
        // The frontend also clears its stored token on logout regardless
        // (see AuthContext.jsx), so this is a best-effort cleanup.
        TokenExtractor.extract(request).ifPresent(tokenService::invalidateToken);
        return ResponseEntity.noContent().build();
    }
}
