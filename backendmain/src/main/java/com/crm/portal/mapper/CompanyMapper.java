package com.crm.portal.mapper;

import com.crm.portal.dto.CompanyDto;
import com.crm.portal.entity.Company;

public final class CompanyMapper {

    private CompanyMapper() {
    }

    public static CompanyDto toDto(Company company) {
        if (company == null) return null;

        return CompanyDto.builder()
                .id(company.getId())
                .name(company.getName())
                .industry(company.getIndustry())
                .website(company.getWebsite())
                .phone(company.getPhone())
                .email(company.getEmail())
                .addressLine(company.getAddressLine())
                .city(company.getCity())
                .state(company.getState())
                .country(company.getCountry())
                .postalCode(company.getPostalCode())
                .annualRevenue(company.getAnnualRevenue())
                .employeeCount(company.getEmployeeCount())
                .ownerId(company.getOwner() != null ? company.getOwner().getId() : null)
                .ownerName(company.getOwner() != null ? company.getOwner().getFullName().trim() : null)
                .createdAt(company.getCreatedAt())
                .updatedAt(company.getUpdatedAt())
                .build();
    }
}
