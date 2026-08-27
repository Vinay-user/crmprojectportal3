package com.crm.portal.dto;

import com.crm.portal.enums.PriorityLevel;
import com.crm.portal.enums.RelatedEntityType;
import com.crm.portal.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TaskRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private TaskStatus status;
    private PriorityLevel priority;
    private LocalDate dueDate;
    private Long assignedTo;
    private RelatedEntityType relatedToType;
    private Long relatedToId;
}
