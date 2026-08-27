package com.crm.portal.security;

import com.crm.portal.entity.User;

import java.util.Optional;

/**
 * Abstraction over "how does a logged-in request prove who it is".
 *
 * Today's implementation ({@link InMemoryTokenService}) issues a random
 * opaque token and keeps it in memory - no hashing, no JWT, on purpose
 * (see project README). Every other class in the app talks to auth only
 * through this interface, so swapping in a real JWT implementation later
 * (sign/verify, expiry claims, refresh tokens, etc.) means writing a new
 * class that implements these three methods and pointing Spring at it -
 * no changes needed in AuthService, controllers, or CurrentUserService.
 */
public interface TokenService {

    /**
     * Issues a new token for a freshly authenticated user.
     */
    String issueToken(User user);

    /**
     * Resolves a token back to a user id, if the token is present and not
     * expired. Empty means "not authenticated" - callers should not
     * distinguish "invalid" from "expired" from "unknown" for security
     * reasons.
     */
    Optional<Long> resolveUserId(String token);

    /**
     * Invalidates a token (logout).
     */
    void invalidateToken(String token);
}
