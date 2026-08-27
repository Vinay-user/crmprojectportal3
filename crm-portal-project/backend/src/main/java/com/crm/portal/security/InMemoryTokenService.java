package com.crm.portal.security;

import com.crm.portal.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Temporary, simple token store: a random UUID per login, kept in memory
 * with an expiry. This is intentionally NOT a JWT - there is nothing to
 * cryptographically verify, so a restart of the app invalidates every
 * session, and this only works for a single backend instance. That's
 * fine for local/dev use now; see {@link TokenService} for how this gets
 * swapped out later without touching the rest of the app.
 */
@Service
public class InMemoryTokenService implements TokenService {

    private final Map<String, TokenEntry> tokens = new ConcurrentHashMap<>();
    private final long expirationMs;

    public InMemoryTokenService(@Value("${crm.auth.token-expiration-ms:86400000}") long expirationMs) {
        this.expirationMs = expirationMs;
    }

    @Override
    public String issueToken(User user) {
        String token = UUID.randomUUID().toString();
        Instant expiresAt = Instant.now().plusMillis(expirationMs);
        tokens.put(token, new TokenEntry(user.getId(), expiresAt));
        return token;
    }

    @Override
    public Optional<Long> resolveUserId(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }

        TokenEntry entry = tokens.get(token);
        if (entry == null) {
            return Optional.empty();
        }

        if (Instant.now().isAfter(entry.expiresAt())) {
            tokens.remove(token);
            return Optional.empty();
        }

        return Optional.of(entry.userId());
    }

    @Override
    public void invalidateToken(String token) {
        if (token != null) {
            tokens.remove(token);
        }
    }

    private record TokenEntry(Long userId, Instant expiresAt) {
    }
}
