package com.crm.portal.controller;

import com.crm.portal.dto.CommunicationDto;
import com.crm.portal.dto.CommunicationRequest;
import com.crm.portal.dto.PageResponse;
import com.crm.portal.service.CommunicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/communications")
@RequiredArgsConstructor
public class CommunicationController {

    private final CommunicationService communicationService;

    @GetMapping
    public ResponseEntity<PageResponse<CommunicationDto>> list(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Long contactId,
            @RequestParam(required = false) Long leadId,
            @RequestParam(required = false) Long ownerId,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String direction
    ) {
        return ResponseEntity.ok(communicationService.list(type, contactId, leadId, ownerId, page, size, sort, direction));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommunicationDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(communicationService.get(id));
    }

    @PostMapping
    public ResponseEntity<CommunicationDto> create(@Valid @RequestBody CommunicationRequest request) {
        return ResponseEntity.status(201).body(communicationService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommunicationDto> update(@PathVariable Long id, @Valid @RequestBody CommunicationRequest request) {
        return ResponseEntity.ok(communicationService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        communicationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
