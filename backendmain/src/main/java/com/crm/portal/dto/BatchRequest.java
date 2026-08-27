package com.crm.portal.dto;

import com.crm.portal.enums.BatchMode;
import com.crm.portal.enums.BatchStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class BatchRequest {

    @NotNull(message = "Course is required")
    private Long courseId;

    @NotBlank(message = "Batch code is required")
    private String batchCode;

    private Long trainerId;
    private BatchMode mode;
    private BatchStatus status;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate endDate;
    private Integer capacity;
    private String location;
}
