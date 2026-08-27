package com.crm.portal.dto;

import com.crm.portal.enums.EnrollmentStatus;
import com.crm.portal.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentDto {

    private Long id;
    private Long batchId;
    private String batchCode;
    private String courseName;
    private Long contactId;
    private String contactName;
    private Long companyId;
    private String companyName;
    private EnrollmentStatus status;
    private PaymentStatus paymentStatus;
    private BigDecimal feeAmount;
    private LocalDateTime enrolledAt;
    private LocalDateTime completedAt;
    private String certificateNumber;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
