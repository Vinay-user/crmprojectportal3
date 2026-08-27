package com.crm.portal.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.util.StringUtils;

/**
 * Builds a Spring Data Pageable from the raw query params the frontend
 * sends (page, size, sort, direction) - see usePagination.js / list(params)
 * in the React services.
 */
public final class PageUtils {

    private static final int DEFAULT_PAGE = 0;
    private static final int DEFAULT_SIZE = 10;
    private static final int MAX_SIZE = 200;

    private PageUtils() {
    }

    public static Pageable build(Integer page, Integer size, String sort, String direction) {
        int resolvedPage = (page == null || page < 0) ? DEFAULT_PAGE : page;
        int resolvedSize = (size == null || size <= 0) ? DEFAULT_SIZE : Math.min(size, MAX_SIZE);

        String sortField = StringUtils.hasText(sort) ? sort : "createdAt";
        Sort.Direction sortDirection = "asc".equalsIgnoreCase(direction) ? Sort.Direction.ASC : Sort.Direction.DESC;

        return PageRequest.of(resolvedPage, resolvedSize, Sort.by(sortDirection, sortField));
    }
}
