package com.crm.portal.mapper;

import com.crm.portal.dto.EnrollmentDto;
import com.crm.portal.entity.Enrollment;

public final class EnrollmentMapper {

    private EnrollmentMapper() {
    }

    public static EnrollmentDto toDto(Enrollment enrollment) {
        if (enrollment == null) return null;

        return EnrollmentDto.builder()
                .id(enrollment.getId())
                .batchId(enrollment.getBatch() != null ? enrollment.getBatch().getId() : null)
                .batchCode(enrollment.getBatch() != null ? enrollment.getBatch().getBatchCode() : null)
                .courseName(enrollment.getBatch() != null && enrollment.getBatch().getCourse() != null
                        ? enrollment.getBatch().getCourse().getName() : null)
                .contactId(enrollment.getContact() != null ? enrollment.getContact().getId() : null)
                .contactName(enrollment.getContact() != null
                        ? (enrollment.getContact().getFirstName() + " " + enrollment.getContact().getLastName()).trim()
                        : null)
                .companyId(enrollment.getCompany() != null ? enrollment.getCompany().getId() : null)
                .companyName(enrollment.getCompany() != null ? enrollment.getCompany().getName() : null)
                .status(enrollment.getStatus())
                .paymentStatus(enrollment.getPaymentStatus())
                .feeAmount(enrollment.getFeeAmount())
                .enrolledAt(enrollment.getEnrolledAt())
                .completedAt(enrollment.getCompletedAt())
                .certificateNumber(enrollment.getCertificateNumber())
                .notes(enrollment.getNotes())
                .createdAt(enrollment.getCreatedAt())
                .updatedAt(enrollment.getUpdatedAt())
                .build();
    }
}
