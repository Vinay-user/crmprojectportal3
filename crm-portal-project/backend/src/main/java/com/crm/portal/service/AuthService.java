package com.crm.portal.service;

import com.crm.portal.dto.AuthResponse;
import com.crm.portal.dto.LoginRequest;
import com.crm.portal.dto.RegisterRequest;
import com.crm.portal.dto.UserDto;
import com.crm.portal.entity.User;
import com.crm.portal.enums.UserRole;
import com.crm.portal.exception.DuplicateResourceException;
import com.crm.portal.exception.UnauthorizedException;
import com.crm.portal.mapper.UserMapper;
import com.crm.portal.repository.UserPermissionRepository;
import com.crm.portal.repository.UserRepository;
import com.crm.portal.security.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * NOTE ON PASSWORDS (temporary, by design):
 * Passwords are compared as plain text against User#password. There is no
 * hashing yet - that's intentional for the current stage of the project.
 * When hashing is introduced, the only line that needs to change is the
 * comparison in login() and the assignment in register(); everything else
 * here (token issuance, DTO mapping, audit logging) stays the same.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserPermissionRepository userPermissionRepository;
    private final TokenService tokenService;
    private final AuditLogService auditLogService;
    private final CurrentUserService currentUserService;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new UnauthorizedException("This account has been disabled. Contact an administrator.");
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String token = tokenService.issueToken(user);

        auditLogService.log(user, "LOGIN", "User", user.getId());

        return new AuthResponse(token, "Bearer", toDto(user));
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new DuplicateResourceException("An account with this email already exists");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(request.getPassword())
                .phone(request.getPhone())
                .role(UserRole.USER)
                .isActive(true)
                .build();

        user = userRepository.save(user);

        auditLogService.log(user, "REGISTER", "User", user.getId());

        String token = tokenService.issueToken(user);

        return new AuthResponse(token, "Bearer", toDto(user));
    }

    @Transactional(readOnly = true)
    public UserDto me() {
        return toDto(currentUserService.getCurrentUser());
    }

    private UserDto toDto(User user) {
        List<String> permissions = userPermissionRepository.findByUserId(user.getId())
                .stream()
                .map(p -> p.getPermission())
                .collect(Collectors.toList());

        return UserMapper.toDto(user, permissions);
    }
}
