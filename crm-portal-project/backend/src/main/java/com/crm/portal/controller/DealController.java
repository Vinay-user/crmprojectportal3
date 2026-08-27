package com.crm.portal.controller;

import com.crm.portal.dto.DealDto;
import com.crm.portal.dto.DealRequest;
import com.crm.portal.dto.DealStageRequest;
import com.crm.portal.dto.PageResponse;
import com.crm.portal.service.DealService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/deals")
@RequiredArgsConstructor
public class DealController {

    private final DealService dealService;

    @GetMapping
    public ResponseEntity<PageResponse<DealDto>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String stage,
            @RequestParam(required = false) Long owner,
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String direction
    ) {
        return ResponseEntity.ok(dealService.list(search, stage, owner, companyId, page, size, sort, direction));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DealDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(dealService.get(id));
    }

    @PostMapping
    public ResponseEntity<DealDto> create(@Valid @RequestBody DealRequest request) {
        return ResponseEntity.status(201).body(dealService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DealDto> update(@PathVariable Long id, @Valid @RequestBody DealRequest request) {
        return ResponseEntity.ok(dealService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        dealService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/stage")
    public ResponseEntity<DealDto> updateStage(@PathVariable Long id, @Valid @RequestBody DealStageRequest request) {
        return ResponseEntity.ok(dealService.updateStage(id, request.getStage()));
    }
}
