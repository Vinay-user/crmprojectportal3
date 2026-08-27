package com.crm.portal.controller;

import com.crm.portal.dto.RevenueReportDto;
import com.crm.portal.dto.SalesReportDto;
import com.crm.portal.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/sales")
    public ResponseEntity<SalesReportDto> salesReport() {
        return ResponseEntity.ok(reportService.getSalesReport());
    }

    @GetMapping("/revenue")
    public ResponseEntity<RevenueReportDto> revenueReport() {
        return ResponseEntity.ok(reportService.getRevenueReport());
    }
}
