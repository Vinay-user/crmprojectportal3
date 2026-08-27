package com.crm.portal.controller;

import com.crm.portal.dto.ContactDto;
import com.crm.portal.dto.ContactRequest;
import com.crm.portal.dto.PageResponse;
import com.crm.portal.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @GetMapping
    public ResponseEntity<PageResponse<ContactDto>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) Long owner,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String direction
    ) {
        return ResponseEntity.ok(contactService.list(search, companyId, owner, page, size, sort, direction));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(contactService.get(id));
    }

    @PostMapping
    public ResponseEntity<ContactDto> create(@Valid @RequestBody ContactRequest request) {
        return ResponseEntity.status(201).body(contactService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactDto> update(@PathVariable Long id, @Valid @RequestBody ContactRequest request) {
        return ResponseEntity.ok(contactService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        contactService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
