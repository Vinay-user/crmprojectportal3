package com.crm.portal.controller;

import com.crm.portal.dto.LeadDto;
import com.crm.portal.dto.LeadRequest;
import com.crm.portal.dto.PageResponse;
import com.crm.portal.service.LeadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @GetMapping
    public ResponseEntity<PageResponse<LeadDto>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) Long owner,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String direction
    ) {
        return ResponseEntity.ok(leadService.list(search, status, source, owner, page, size, sort, direction));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(leadService.get(id));
    }

    @PostMapping
    public ResponseEntity<LeadDto> create(@Valid @RequestBody LeadRequest request) {
        return ResponseEntity.status(201).body(leadService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadDto> update(@PathVariable Long id, @Valid @RequestBody LeadRequest request) {
        return ResponseEntity.ok(leadService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        leadService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/convert")
    public ResponseEntity<LeadDto> convert(@PathVariable Long id) {
        return ResponseEntity.ok(leadService.convert(id));
    }
}
