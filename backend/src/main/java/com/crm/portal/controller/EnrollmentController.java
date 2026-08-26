package com.crm.portal.controller;

import com.crm.portal.dto.EnrollmentDto;
import com.crm.portal.dto.EnrollmentPaymentRequest;
import com.crm.portal.dto.EnrollmentRequest;
import com.crm.portal.dto.PageResponse;
import com.crm.portal.service.EnrollmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @GetMapping
    public ResponseEntity<PageResponse<EnrollmentDto>> list(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String paymentStatus,
            @RequestParam(required = false) Long batchId,
            @RequestParam(required = false) Long contactId,
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String direction
    ) {
        return ResponseEntity.ok(enrollmentService.list(status, paymentStatus, batchId, contactId, companyId, page, size, sort, direction));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnrollmentDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(enrollmentService.get(id));
    }

    @PostMapping
    public ResponseEntity<EnrollmentDto> create(@Valid @RequestBody EnrollmentRequest request) {
        return ResponseEntity.status(201).body(enrollmentService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnrollmentDto> update(@PathVariable Long id, @Valid @RequestBody EnrollmentRequest request) {
        return ResponseEntity.ok(enrollmentService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        enrollmentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<EnrollmentDto> complete(@PathVariable Long id) {
        return ResponseEntity.ok(enrollmentService.complete(id));
    }

    @PatchMapping("/{id}/payment-status")
    public ResponseEntity<EnrollmentDto> updatePaymentStatus(@PathVariable Long id, @Valid @RequestBody EnrollmentPaymentRequest request) {
        return ResponseEntity.ok(enrollmentService.updatePaymentStatus(id, request.getPaymentStatus()));
    }
}
