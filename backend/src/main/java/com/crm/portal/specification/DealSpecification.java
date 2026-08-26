package com.crm.portal.specification;

import com.crm.portal.entity.Deal;
import com.crm.portal.enums.DealStage;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public final class DealSpecification {

    private DealSpecification() {
    }

    public static Specification<Deal> filter(String search, String stage, Long ownerId, Long companyId) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(search)) {
                predicates.add(cb.like(cb.lower(root.get("title")), "%" + search.toLowerCase() + "%"));
            }

            if (StringUtils.hasText(stage)) {
                predicates.add(cb.equal(root.get("stage"), DealStage.valueOf(stage.toUpperCase())));
            }

            if (ownerId != null) {
                predicates.add(cb.equal(root.get("owner").get("id"), ownerId));
            }

            if (companyId != null) {
                predicates.add(cb.equal(root.get("company").get("id"), companyId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
