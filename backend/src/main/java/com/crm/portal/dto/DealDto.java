package com.crm.portal.dto;

import com.crm.portal.enums.DealStage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DealDto {

    private Long id;
    private String title;
    private Long companyId;
    private String companyName;
    private Long contactId;
    private String contactName;
    private BigDecimal amount;
    private String currency;
    private DealStage stage;
    private Short probability;
    private LocalDate expectedCloseDate;
    private LocalDateTime closedAt;
    private Long ownerId;
    private String ownerName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
