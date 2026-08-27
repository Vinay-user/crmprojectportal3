package com.crm.portal.specification;

import com.crm.portal.entity.Lead;
import com.crm.portal.enums.LeadStatus;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public final class LeadSpecification {

    private LeadSpecification() {
    }

    public static Specification<Lead> filter(String search, String status, String source, Long ownerId) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(search)) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("firstName")), pattern),
                        cb.like(cb.lower(root.get("lastName")), pattern),
                        cb.like(cb.lower(root.get("email")), pattern),
                        cb.like(cb.lower(root.get("company")), pattern)
                ));
            }

            if (StringUtils.hasText(status)) {
                predicates.add(cb.equal(root.get("status"), LeadStatus.valueOf(status.toUpperCase())));
            }

            if (StringUtils.hasText(source)) {
                predicates.add(cb.equal(cb.lower(root.get("source")), source.toLowerCase()));
            }

            if (ownerId != null) {
                predicates.add(cb.equal(root.get("owner").get("id"), ownerId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
