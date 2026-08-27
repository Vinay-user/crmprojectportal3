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
public class SalesReportDto {

    private BigDecimal pipelineValue;
    private BigDecimal weightedPipelineValue;
    private long openDeals;
    private long wonDeals;
    private long lostDeals;
    private BigDecimal wonValue;
    private BigDecimal averageDealSize;
    private double winRate;
    private long totalLeads;
    private long convertedLeads;
    private double leadConversionRate;
    private Map<String, Long> dealsByStage;
    private List<Map<String, Object>> topOwners;
}
