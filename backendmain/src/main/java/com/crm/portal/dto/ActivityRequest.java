package com.crm.portal.dto;

import com.crm.portal.enums.ActivityType;
import com.crm.portal.enums.RelatedEntityType;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ActivityRequest {

    private ActivityType type;

    @NotBlank(message = "Subject is required")
    private String subject;

    private String description;
    private RelatedEntityType relatedToType;
    private Long relatedToId;
    private Long ownerId;
    private LocalDateTime activityDate;
}
