package com.crm.portal.specification;

import com.crm.portal.entity.Company;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public final class CompanySpecification {

    private CompanySpecification() {
    }

    public static Specification<Company> filter(String search, String industry, Long ownerId) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(search)) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), pattern),
                        cb.like(cb.lower(root.get("website")), pattern),
                        cb.like(cb.lower(root.get("email")), pattern)
                ));
            }

            if (StringUtils.hasText(industry)) {
                predicates.add(cb.equal(cb.lower(root.get("industry")), industry.toLowerCase()));
            }

            if (ownerId != null) {
                predicates.add(cb.equal(root.get("owner").get("id"), ownerId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
