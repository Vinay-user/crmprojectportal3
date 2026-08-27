package com.crm.portal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CourseRequest {

    @NotBlank(message = "Course name is required")
    private String name;

    @NotBlank(message = "Course code is required")
    private String code;

    private String category;
    private String description;
    private Integer durationHours;

    @NotNull(message = "Fee is required")
    private BigDecimal fee;

    private String currency;
    private Boolean isActive;
}
