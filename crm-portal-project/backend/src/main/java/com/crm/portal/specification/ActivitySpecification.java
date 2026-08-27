package com.crm.portal.specification;

import com.crm.portal.entity.Activity;
import com.crm.portal.enums.ActivityType;
import com.crm.portal.enums.RelatedEntityType;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public final class ActivitySpecification {

    private ActivitySpecification() {
    }

    public static Specification<Activity> filter(String type, String relatedToType, Long relatedToId, Long ownerId) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(type)) {
                predicates.add(cb.equal(root.get("type"), ActivityType.valueOf(type.toUpperCase())));
            }

            if (StringUtils.hasText(relatedToType)) {
                predicates.add(cb.equal(root.get("relatedToType"), RelatedEntityType.valueOf(relatedToType.toUpperCase())));
            }

            if (relatedToId != null) {
                predicates.add(cb.equal(root.get("relatedToId"), relatedToId));
            }

            if (ownerId != null) {
                predicates.add(cb.equal(root.get("owner").get("id"), ownerId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
