package com.crm.portal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevenueReportDto {

    private BigDecimal totalRevenue;
    private List<Map<String, Object>> revenueByMonth;
    private Map<String, BigDecimal> revenueByStage;
}
