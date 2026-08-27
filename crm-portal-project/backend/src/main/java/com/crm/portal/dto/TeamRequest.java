package com.crm.portal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TeamRequest {

    @NotBlank(message = "Team name is required")
    private String name;

    private String description;

    private Long managerId;
}
