package com.crm.portal.mapper;

import com.crm.portal.dto.LeadDto;
import com.crm.portal.entity.Lead;

public final class LeadMapper {

    private LeadMapper() {
    }

    public static LeadDto toDto(Lead lead) {
        if (lead == null) return null;

        return LeadDto.builder()
                .id(lead.getId())
                .firstName(lead.getFirstName())
                .lastName(lead.getLastName())
                .email(lead.getEmail())
                .phone(lead.getPhone())
                .company(lead.getCompany())
                .source(lead.getSource())
                .status(lead.getStatus())
                .ownerId(lead.getOwner() != null ? lead.getOwner().getId() : null)
                .ownerName(lead.getOwner() != null ? lead.getOwner().getFullName().trim() : null)
                .convertedContactId(lead.getConvertedContact() != null ? lead.getConvertedContact().getId() : null)
                .convertedAt(lead.getConvertedAt())
                .notes(lead.getNotes())
                .createdAt(lead.getCreatedAt())
                .updatedAt(lead.getUpdatedAt())
                .build();
    }
}
