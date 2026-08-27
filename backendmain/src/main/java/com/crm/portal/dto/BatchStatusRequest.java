package com.crm.portal.dto;

import com.crm.portal.enums.BatchStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BatchStatusRequest {

    @NotNull(message = "Status is required")
    private BatchStatus status;
}
