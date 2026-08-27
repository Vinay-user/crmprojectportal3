package com.crm.portal.mapper;

import com.crm.portal.dto.CourseDto;
import com.crm.portal.entity.Course;

public final class CourseMapper {

    private CourseMapper() {
    }

    public static CourseDto toDto(Course course) {
        if (course == null) return null;

        return CourseDto.builder()
                .id(course.getId())
                .name(course.getName())
                .code(course.getCode())
                .category(course.getCategory())
                .description(course.getDescription())
                .durationHours(course.getDurationHours())
                .fee(course.getFee())
                .currency(course.getCurrency())
                .isActive(course.getIsActive())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }
}
