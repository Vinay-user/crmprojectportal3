package com.crm.portal.mapper;

import com.crm.portal.dto.DealDto;
import com.crm.portal.entity.Deal;

public final class DealMapper {

    private DealMapper() {
    }

    public static DealDto toDto(Deal deal) {
        if (deal == null) return null;

        return DealDto.builder()
                .id(deal.getId())
                .title(deal.getTitle())
                .companyId(deal.getCompany() != null ? deal.getCompany().getId() : null)
                .companyName(deal.getCompany() != null ? deal.getCompany().getName() : null)
                .contactId(deal.getContact() != null ? deal.getContact().getId() : null)
                .contactName(deal.getContact() != null ? (deal.getContact().getFirstName() + " " + deal.getContact().getLastName()).trim() : null)
                .amount(deal.getAmount())
                .currency(deal.getCurrency())
                .stage(deal.getStage())
                .probability(deal.getProbability())
                .expectedCloseDate(deal.getExpectedCloseDate())
                .closedAt(deal.getClosedAt())
                .ownerId(deal.getOwner() != null ? deal.getOwner().getId() : null)
                .ownerName(deal.getOwner() != null ? deal.getOwner().getFullName().trim() : null)
                .createdAt(deal.getCreatedAt())
                .updatedAt(deal.getUpdatedAt())
                .build();
    }
}
