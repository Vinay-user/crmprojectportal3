package com.crm.portal.mapper;

import com.crm.portal.dto.CommunicationDto;
import com.crm.portal.entity.Communication;

public final class CommunicationMapper {

    private CommunicationMapper() {
    }

    public static CommunicationDto toDto(Communication communication) {
        if (communication == null) return null;

        return CommunicationDto.builder()
                .id(communication.getId())
                .type(communication.getType())
                .direction(communication.getDirection())
                .subject(communication.getSubject())
                .content(communication.getContent())
                .contactId(communication.getContact() != null ? communication.getContact().getId() : null)
                .contactName(communication.getContact() != null
                        ? (communication.getContact().getFirstName() + " " + communication.getContact().getLastName()).trim()
                        : null)
                .leadId(communication.getLead() != null ? communication.getLead().getId() : null)
                .leadName(communication.getLead() != null
                        ? (communication.getLead().getFirstName() + " " + communication.getLead().getLastName()).trim()
                        : null)
                .ownerId(communication.getOwner() != null ? communication.getOwner().getId() : null)
                .ownerName(communication.getOwner() != null ? communication.getOwner().getFullName().trim() : null)
                .occurredAt(communication.getOccurredAt())
                .createdAt(communication.getCreatedAt())
                .build();
    }
}
