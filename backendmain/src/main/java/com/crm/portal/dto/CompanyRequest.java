package com.crm.portal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CompanyRequest {

    @NotBlank(message = "Company name is required")
    private String name;

    private String industry;
    private String website;
    private String phone;
    private String email;
    private String addressLine;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private BigDecimal annualRevenue;
    private Integer employeeCount;
    private Long ownerId;
}
