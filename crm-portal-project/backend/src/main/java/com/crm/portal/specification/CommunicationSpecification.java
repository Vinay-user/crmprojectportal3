package com.crm.portal.specification;

import com.crm.portal.entity.Communication;
import com.crm.portal.enums.CommunicationType;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public final class CommunicationSpecification {

    private CommunicationSpecification() {
    }

    public static Specification<Communication> filter(String type, Long contactId, Long leadId, Long ownerId) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(type)) {
                predicates.add(cb.equal(root.get("type"), CommunicationType.valueOf(type.toUpperCase())));
            }

            if (contactId != null) {
                predicates.add(cb.equal(root.get("contact").get("id"), contactId));
            }

            if (leadId != null) {
                predicates.add(cb.equal(root.get("lead").get("id"), leadId));
            }

            if (ownerId != null) {
                predicates.add(cb.equal(root.get("owner").get("id"), ownerId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
