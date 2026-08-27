package com.crm.portal.dto;

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
public class ContactDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String jobTitle;
    private Long companyId;
    private String companyName;
    private Long ownerId;
    private String ownerName;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
