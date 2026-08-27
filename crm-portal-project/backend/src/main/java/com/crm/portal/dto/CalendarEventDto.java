package com.crm.portal.dto;

import com.crm.portal.enums.RelatedEntityType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalendarEventDto {

    private Long id;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location;
    private Long ownerId;
    private String ownerName;
    private RelatedEntityType relatedToType;
    private Long relatedToId;
    private List<Long> attendeeIds;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
