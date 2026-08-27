package com.crm.portal.service;

import com.crm.portal.dto.RevenueReportDto;
import com.crm.portal.dto.SalesReportDto;
import com.crm.portal.entity.Deal;
import com.crm.portal.entity.Lead;
import com.crm.portal.enums.DealStage;
import com.crm.portal.enums.LeadStatus;
import com.crm.portal.repository.DealRepository;
import com.crm.portal.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Report totals are computed on the backend (not in React) so the numbers
 * shown across the dashboard/reports pages always match what's in MySQL.
 * Formulas follow the ones described in the project README:
 *   Pipeline Value      = sum of open deal amounts
 *   Weighted Pipeline    = sum(amount * probability / 100) for open deals
 *   Conversion Rate      = convertedLeads / totalLeads * 100
 */
@Service
@RequiredArgsConstructor
public class ReportService {

    private final DealRepository dealRepository;
    private final LeadRepository leadRepository;

    @Transactional(readOnly = true)
    public SalesReportDto getSalesReport() {
        List<Deal> deals = dealRepository.findAll();
        List<Lead> leads = leadRepository.findAll();

        List<Deal> openDeals = deals.stream()
                .filter(d -> d.getStage() != DealStage.WON && d.getStage() != DealStage.LOST)
                .collect(Collectors.toList());

        List<Deal> wonDeals = deals.stream().filter(d -> d.getStage() == DealStage.WON).collect(Collectors.toList());
        List<Deal> lostDeals = deals.stream().filter(d -> d.getStage() == DealStage.LOST).collect(Collectors.toList());

        BigDecimal pipelineValue = sum(openDeals.stream().map(Deal::getAmount));

        BigDecimal weightedPipelineValue = openDeals.stream()
                .map(d -> {
                    BigDecimal amount = d.getAmount() != null ? d.getAmount() : BigDecimal.ZERO;
                    int probability = d.getProbability() != null ? d.getProbability() : 0;
                    return amount.multiply(BigDecimal.valueOf(probability)).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal wonValue = sum(wonDeals.stream().map(Deal::getAmount));

        BigDecimal averageDealSize = deals.isEmpty()
                ? BigDecimal.ZERO
                : sum(deals.stream().map(Deal::getAmount)).divide(BigDecimal.valueOf(deals.size()), 2, RoundingMode.HALF_UP);

        long closedDeals = wonDeals.size() + lostDeals.size();
        double winRate = closedDeals == 0 ? 0.0 : round((double) wonDeals.size() / closedDeals * 100);

        long convertedLeads = leads.stream().filter(l -> l.getStatus() == LeadStatus.CONVERTED).count();
        double leadConversionRate = leads.isEmpty() ? 0.0 : round((double) convertedLeads / leads.size() * 100);

        Map<String, Long> dealsByStage = deals.stream()
                .collect(Collectors.groupingBy(d -> d.getStage().name(), LinkedHashMap::new, Collectors.counting()));

        Map<String, List<Deal>> byOwner = wonDeals.stream()
                .filter(d -> d.getOwner() != null)
                .collect(Collectors.groupingBy(d -> d.getOwner().getFullName().trim()));

        List<Map<String, Object>> topOwners = byOwner.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("owner", entry.getKey());
                    row.put("wonDeals", entry.getValue().size());
                    row.put("wonValue", sum(entry.getValue().stream().map(Deal::getAmount)));
                    return row;
                })
                .sorted((a, b) -> ((BigDecimal) b.get("wonValue")).compareTo((BigDecimal) a.get("wonValue")))
                .limit(5)
                .collect(Collectors.toList());

        return SalesReportDto.builder()
                .pipelineValue(pipelineValue)
                .weightedPipelineValue(weightedPipelineValue)
                .openDeals(openDeals.size())
                .wonDeals(wonDeals.size())
                .lostDeals(lostDeals.size())
                .wonValue(wonValue)
                .averageDealSize(averageDealSize)
                .winRate(winRate)
                .totalLeads(leads.size())
                .convertedLeads(convertedLeads)
                .leadConversionRate(leadConversionRate)
                .dealsByStage(dealsByStage)
                .topOwners(topOwners)
                .build();
    }

    @Transactional(readOnly = true)
    public RevenueReportDto getRevenueReport() {
        List<Deal> wonDeals = dealRepository.findAll().stream()
                .filter(d -> d.getStage() == DealStage.WON)
                .collect(Collectors.toList());

        BigDecimal totalRevenue = sum(wonDeals.stream().map(Deal::getAmount));

        DateTimeFormatter monthKeyFormat = DateTimeFormatter.ofPattern("yyyy-MM");
        LocalDateTime twelveMonthsAgo = LocalDateTime.now().minusMonths(11).withDayOfMonth(1);

        Map<String, BigDecimal> byMonth = new LinkedHashMap<>();
        for (int i = 0; i < 12; i++) {
            byMonth.put(twelveMonthsAgo.plusMonths(i).format(monthKeyFormat), BigDecimal.ZERO);
        }

        for (Deal deal : wonDeals) {
            LocalDateTime closedAt = deal.getClosedAt() != null ? deal.getClosedAt() : deal.getUpdatedAt();
            if (closedAt == null || closedAt.isBefore(twelveMonthsAgo)) continue;

            String key = closedAt.format(monthKeyFormat);
            byMonth.merge(key, deal.getAmount() != null ? deal.getAmount() : BigDecimal.ZERO, BigDecimal::add);
        }

        List<Map<String, Object>> revenueByMonth = new ArrayList<>();
        byMonth.forEach((month, revenue) -> {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("month", month);
            row.put("revenue", revenue);
            revenueByMonth.add(row);
        });

        Map<String, BigDecimal> revenueByStage = dealRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        d -> d.getStage().name(),
                        LinkedHashMap::new,
                        Collectors.reducing(BigDecimal.ZERO, d -> d.getAmount() != null ? d.getAmount() : BigDecimal.ZERO, BigDecimal::add)
                ));

        return RevenueReportDto.builder()
                .totalRevenue(totalRevenue)
                .revenueByMonth(revenueByMonth)
                .revenueByStage(revenueByStage)
                .build();
    }

    private BigDecimal sum(java.util.stream.Stream<BigDecimal> values) {
        return values.filter(java.util.Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
