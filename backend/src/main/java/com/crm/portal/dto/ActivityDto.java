package com.crm.portal.dto;

import com.crm.portal.enums.ActivityType;
import com.crm.portal.enums.RelatedEntityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityDto {

    private Long id;
    private ActivityType type;
    private String subject;
    private String description;
    private RelatedEntityType relatedToType;
    private Long relatedToId;
    private Long ownerId;
    private String ownerName;
    private LocalDateTime activityDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
