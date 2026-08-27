package com.crm.portal.controller;

import com.crm.portal.dto.BatchDto;
import com.crm.portal.dto.BatchRequest;
import com.crm.portal.dto.BatchStatusRequest;
import com.crm.portal.dto.PageResponse;
import com.crm.portal.service.BatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/batches")
@RequiredArgsConstructor
public class BatchController {

    private final BatchService batchService;

    @GetMapping
    public ResponseEntity<PageResponse<BatchDto>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) Long trainerId,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String direction
    ) {
        return ResponseEntity.ok(batchService.list(search, status, courseId, trainerId, page, size, sort, direction));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BatchDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(batchService.get(id));
    }

    @PostMapping
    public ResponseEntity<BatchDto> create(@Valid @RequestBody BatchRequest request) {
        return ResponseEntity.status(201).body(batchService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BatchDto> update(@PathVariable Long id, @Valid @RequestBody BatchRequest request) {
        return ResponseEntity.ok(batchService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        batchService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BatchDto> updateStatus(@PathVariable Long id, @Valid @RequestBody BatchStatusRequest request) {
        return ResponseEntity.ok(batchService.updateStatus(id, request.getStatus()));
    }
}
