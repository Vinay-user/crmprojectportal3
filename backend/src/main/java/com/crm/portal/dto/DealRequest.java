package com.crm.portal.dto;

import com.crm.portal.enums.DealStage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class DealRequest {

    @NotBlank(message = "Deal title is required")
    private String title;

    private Long companyId;
    private Long contactId;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    private String currency;
    private DealStage stage;
    private Short probability;
    private LocalDate expectedCloseDate;
    private Long ownerId;
}
