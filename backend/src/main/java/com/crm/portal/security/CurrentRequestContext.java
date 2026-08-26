package com.crm.portal.security;

import com.crm.portal.enums.UserRole;

/**
 * Holds "who is making this request" for the duration of one HTTP request.
 * Populated by {@link AuthFilter}, read by {@link com.crm.portal.service.CurrentUserService}.
 *
 * A ThreadLocal is a reasonable stand-in for Spring Security's
 * SecurityContextHolder while there's no security starter on the
 * classpath - it plays the same role and controllers/services never talk
 * to it directly, only through CurrentUserService.
 */
public final class CurrentRequestContext {

    private static final ThreadLocal<Principal> CURRENT = new ThreadLocal<>();

    private CurrentRequestContext() {
    }

    public static void set(Long userId, UserRole role) {
        CURRENT.set(new Principal(userId, role));
    }

    public static Principal get() {
        return CURRENT.get();
    }

    public static void clear() {
        CURRENT.remove();
    }

    public record Principal(Long userId, UserRole role) {
    }
}
