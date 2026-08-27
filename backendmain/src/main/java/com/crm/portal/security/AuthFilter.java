package com.crm.portal.security;

import com.crm.portal.dto.ApiErrorResponse;
import com.crm.portal.entity.User;
import com.crm.portal.enums.UserRole;
import com.crm.portal.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

/**
 * Single, central place for "is this request allowed":
 *   1. resolve the caller's identity from the Authorization header (via
 *      TokenService), and
 *   2. apply the same handful of access rules the app has always had
 *      (public auth endpoints, ADMIN/MANAGER-only user administration,
 *      ADMIN/MANAGER-only deletes, everything else just needs to be
 *      logged in).
 *
 * This intentionally plays the role Spring Security's SecurityFilterChain
 * + method security used to play, without pulling in the security
 * starter. If/when real auth (JWT, roles/permissions expressions, etc.)
 * is introduced, this class is the one to replace - nothing else in the
 * app reaches into request-level auth directly.
 */
@Component
@RequiredArgsConstructor
public class AuthFilter extends OncePerRequestFilter {

    private static final Set<String> PUBLIC_PREFIXES = Set.of("/api/auth/", "/actuator/health");

    private final TokenService tokenService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // CORS preflight and anything outside /api/** is not this filter's concern.
        if (HttpMethod.OPTIONS.matches(request.getMethod()) || !path.startsWith("/api/")) {
            filterChain.doFilter(request, response);
            return;
        }

        if (isPublic(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        Optional<User> currentUser = TokenExtractor.extract(request)
                .flatMap(tokenService::resolveUserId)
                .flatMap(userRepository::findById)
                .filter(u -> Boolean.TRUE.equals(u.getIsActive()));

        if (currentUser.isEmpty()) {
            writeError(response, HttpServletResponse.SC_UNAUTHORIZED, "UNAUTHORIZED",
                    "Authentication is required to access this resource");
            return;
        }

        User user = currentUser.get();

        if (!isAuthorized(path, request.getMethod(), user.getRole())) {
            writeError(response, HttpServletResponse.SC_FORBIDDEN, "FORBIDDEN",
                    "You do not have permission to perform this action");
            return;
        }

        CurrentRequestContext.set(user.getId(), user.getRole());
        try {
            filterChain.doFilter(request, response);
        } finally {
            CurrentRequestContext.clear();
        }
    }

    private boolean isPublic(String path) {
        return PUBLIC_PREFIXES.stream().anyMatch(path::startsWith);
    }

    private boolean isAuthorized(String path, String method, UserRole role) {
        boolean isElevated = role == UserRole.ADMIN || role == UserRole.MANAGER;

        if (path.startsWith("/api/users")) {
            return isElevated;
        }

        if (HttpMethod.DELETE.matches(method)) {
            return isElevated;
        }

        return true;
    }

    private void writeError(HttpServletResponse response, int status, String code, String message) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ApiErrorResponse body = ApiErrorResponse.builder()
                .success(false)
                .message(message)
                .code(code)
                .timestamp(LocalDateTime.now())
                .build();

        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
