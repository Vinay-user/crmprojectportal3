package com.crm.portal.specification;

import com.crm.portal.entity.Enrollment;
import com.crm.portal.enums.EnrollmentStatus;
import com.crm.portal.enums.PaymentStatus;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public final class EnrollmentSpecification {

    private EnrollmentSpecification() {
    }

    public static Specification<Enrollment> filter(String status, String paymentStatus, Long batchId,
                                                     Long contactId, Long companyId) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(status)) {
                predicates.add(cb.equal(root.get("status"), EnrollmentStatus.valueOf(status.toUpperCase())));
            }

            if (StringUtils.hasText(paymentStatus)) {
                predicates.add(cb.equal(root.get("paymentStatus"), PaymentStatus.valueOf(paymentStatus.toUpperCase())));
            }

            if (batchId != null) {
                predicates.add(cb.equal(root.get("batch").get("id"), batchId));
            }

            if (contactId != null) {
                predicates.add(cb.equal(root.get("contact").get("id"), contactId));
            }

            if (companyId != null) {
                predicates.add(cb.equal(root.get("company").get("id"), companyId));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
