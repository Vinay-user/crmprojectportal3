package com.crm.portal.dto;

import com.crm.portal.enums.EnrollmentStatus;
import com.crm.portal.enums.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class EnrollmentRequest {

    @NotNull(message = "Batch is required")
    private Long batchId;

    @NotNull(message = "Contact (trainee) is required")
    private Long contactId;

    private Long companyId;
    private EnrollmentStatus status;
    private PaymentStatus paymentStatus;
    private BigDecimal feeAmount;
    private String notes;
}
