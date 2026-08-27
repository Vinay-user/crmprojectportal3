package com.crm.portal.specification;

import com.crm.portal.entity.Task;
import com.crm.portal.enums.PriorityLevel;
import com.crm.portal.enums.TaskStatus;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public final class TaskSpecification {

    private TaskSpecification() {
    }

    public static Specification<Task> filter(String search, String status, String priority, Long assignedTo) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(search)) {
                predicates.add(cb.like(cb.lower(root.get("title")), "%" + search.toLowerCase() + "%"));
            }

            if (StringUtils.hasText(status)) {
                predicates.add(cb.equal(root.get("status"), TaskStatus.valueOf(status.toUpperCase())));
            }

            if (StringUtils.hasText(priority)) {
                predicates.add(cb.equal(root.get("priority"), PriorityLevel.valueOf(priority.toUpperCase())));
            }

            if (assignedTo != null) {
                predicates.add(cb.equal(root.get("assignedTo").get("id"), assignedTo));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
