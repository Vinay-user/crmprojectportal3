package com.crm.portal.dto;

import com.crm.portal.enums.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnrollmentPaymentRequest {

    @NotNull(message = "Payment status is required")
    private PaymentStatus paymentStatus;
}
