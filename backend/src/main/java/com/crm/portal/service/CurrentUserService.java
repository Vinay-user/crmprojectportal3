package com.crm.portal.service;

import com.crm.portal.entity.User;
import com.crm.portal.exception.UnauthorizedException;
import com.crm.portal.repository.UserRepository;
import com.crm.portal.security.CurrentRequestContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Resolves "who is making this request". Every other service depends on
 * this rather than reaching into the security layer directly, so the
 * request-identity mechanism (currently a simple thread-local set by
 * AuthFilter) can be swapped later - e.g. for Spring Security's
 * SecurityContextHolder once JWT is introduced - without touching
 * LeadService, DealService, AuditLogService, etc.
 */
@Service
@RequiredArgsConstructor
public class CurrentUserService {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        Long userId = getCurrentUserIdOrNull();

        if (userId == null) {
            throw new UnauthorizedException("No authenticated user in the current request");
        }

        return userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("Authenticated user no longer exists"));
    }

    public Long getCurrentUserIdOrNull() {
        CurrentRequestContext.Principal principal = CurrentRequestContext.get();
        return principal != null ? principal.userId() : null;
    }
}
