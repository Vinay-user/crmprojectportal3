package com.crm.portal.mapper;

import com.crm.portal.dto.ContactDto;
import com.crm.portal.entity.Contact;

public final class ContactMapper {

    private ContactMapper() {
    }

    public static ContactDto toDto(Contact contact) {
        if (contact == null) return null;

        return ContactDto.builder()
                .id(contact.getId())
                .firstName(contact.getFirstName())
                .lastName(contact.getLastName())
                .email(contact.getEmail())
                .phone(contact.getPhone())
                .jobTitle(contact.getJobTitle())
                .companyId(contact.getCompany() != null ? contact.getCompany().getId() : null)
                .companyName(contact.getCompany() != null ? contact.getCompany().getName() : null)
                .ownerId(contact.getOwner() != null ? contact.getOwner().getId() : null)
                .ownerName(contact.getOwner() != null ? contact.getOwner().getFullName().trim() : null)
                .notes(contact.getNotes())
                .createdAt(contact.getCreatedAt())
                .updatedAt(contact.getUpdatedAt())
                .build();
    }
}
