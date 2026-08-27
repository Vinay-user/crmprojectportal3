package com.crm.portal.dto;

import com.crm.portal.enums.CommunicationDirection;
import com.crm.portal.enums.CommunicationType;
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
public class CommunicationDto {

    private Long id;
    private CommunicationType type;
    private CommunicationDirection direction;
    private String subject;
    private String content;
    private Long contactId;
    private String contactName;
    private Long leadId;
    private String leadName;
    private Long ownerId;
    private String ownerName;
    private LocalDateTime occurredAt;
    private LocalDateTime createdAt;
}
