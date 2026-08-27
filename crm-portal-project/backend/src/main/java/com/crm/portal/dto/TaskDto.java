package com.crm.portal.dto;

import com.crm.portal.enums.PriorityLevel;
import com.crm.portal.enums.RelatedEntityType;
import com.crm.portal.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskDto {

    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private PriorityLevel priority;
    private LocalDate dueDate;
    private LocalDateTime completedAt;
    private Long assignedTo;
    private String assignedToName;
    private RelatedEntityType relatedToType;
    private Long relatedToId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
