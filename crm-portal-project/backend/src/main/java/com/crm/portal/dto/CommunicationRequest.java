package com.crm.portal.dto;

import com.crm.portal.enums.CommunicationDirection;
import com.crm.portal.enums.CommunicationType;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CommunicationRequest {

    @NotNull(message = "Type is required")
    private CommunicationType type;

    @NotNull(message = "Direction is required")
    private CommunicationDirection direction;

    private String subject;
    private String content;
    private Long contactId;
    private Long leadId;
    private Long ownerId;
    private LocalDateTime occurredAt;
}
