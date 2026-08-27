package com.crm.portal.dto;

import com.crm.portal.enums.BatchMode;
import com.crm.portal.enums.BatchStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BatchDto {

    private Long id;
    private Long courseId;
    private String courseName;
    private String batchCode;
    private Long trainerId;
    private String trainerName;
    private BatchMode mode;
    private BatchStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer capacity;
    private String location;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
