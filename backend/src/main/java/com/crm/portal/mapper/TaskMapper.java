package com.crm.portal.mapper;

import com.crm.portal.dto.TaskDto;
import com.crm.portal.entity.Task;

public final class TaskMapper {

    private TaskMapper() {
    }

    public static TaskDto toDto(Task task) {
        if (task == null) return null;

        return TaskDto.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .completedAt(task.getCompletedAt())
                .assignedTo(task.getAssignedTo() != null ? task.getAssignedTo().getId() : null)
                .assignedToName(task.getAssignedTo() != null ? task.getAssignedTo().getFullName().trim() : null)
                .relatedToType(task.getRelatedToType())
                .relatedToId(task.getRelatedToId())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
