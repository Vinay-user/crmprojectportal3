package com.crm.portal.dto;

import com.crm.portal.enums.DealStage;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DealStageRequest {

    @NotNull(message = "Stage is required")
    private DealStage stage;
}
