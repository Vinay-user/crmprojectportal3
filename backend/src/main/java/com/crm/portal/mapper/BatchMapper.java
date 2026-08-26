package com.crm.portal.mapper;

import com.crm.portal.dto.BatchDto;
import com.crm.portal.entity.Batch;

public final class BatchMapper {

    private BatchMapper() {
    }

    public static BatchDto toDto(Batch batch) {
        if (batch == null) return null;

        return BatchDto.builder()
                .id(batch.getId())
                .courseId(batch.getCourse() != null ? batch.getCourse().getId() : null)
                .courseName(batch.getCourse() != null ? batch.getCourse().getName() : null)
                .batchCode(batch.getBatchCode())
                .trainerId(batch.getTrainer() != null ? batch.getTrainer().getId() : null)
                .trainerName(batch.getTrainer() != null ? batch.getTrainer().getFullName().trim() : null)
                .mode(batch.getMode())
                .status(batch.getStatus())
                .startDate(batch.getStartDate())
                .endDate(batch.getEndDate())
                .capacity(batch.getCapacity())
                .location(batch.getLocation())
                .createdAt(batch.getCreatedAt())
                .updatedAt(batch.getUpdatedAt())
                .build();
    }
}
