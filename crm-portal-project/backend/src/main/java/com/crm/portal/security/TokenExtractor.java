package com.crm.portal.security;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Optional;

/**
 * Single place that knows how the client sends its token
 * ("Authorization: Bearer <token>"). Used by both the request filter and
 * the logout endpoint, so the header format is only defined once.
 */
public final class TokenExtractor {

    private static final String HEADER = "Authorization";
    private static final String PREFIX = "Bearer ";

    private TokenExtractor() {
    }

    public static Optional<String> extract(HttpServletRequest request) {
        String header = request.getHeader(HEADER);

        if (header == null || !header.startsWith(PREFIX)) {
            return Optional.empty();
        }

        return Optional.of(header.substring(PREFIX.length()));
    }
}
