package com.crm.portal.specification;

import com.crm.portal.entity.Batch;
import com.crm.portal.enums.BatchStatus;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public final class BatchSpecification {

    private BatchSpecification() {
    }

    public static Specification<Batch> filter(String search, String status, Long courseId, Long trainerId) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(search)) {
                predicates.add(cb.like(cb.lower(root.get("batchCode")), "%" + search.toLowerCase() + "%"));
            }

            if (StringUtils.hasText(status)) {
                predicates.add(cb.equal(root.get("status"), BatchStatus.valueOf(status.toUpperCase())));
            }

            if (courseId != null) {
                predicates.add(cb.equal(root.get("course").get("id"), courseId));
            }

            if (trainerId != null) {
                predicates.add(cb.equal(root.get("trainer").get("id"), trainerId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
