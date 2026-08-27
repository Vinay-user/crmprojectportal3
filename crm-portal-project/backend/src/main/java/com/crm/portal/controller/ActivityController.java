package com.crm.portal.controller;

import com.crm.portal.dto.ActivityDto;
import com.crm.portal.dto.ActivityRequest;
import com.crm.portal.dto.PageResponse;
import com.crm.portal.service.ActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @GetMapping
    public ResponseEntity<PageResponse<ActivityDto>> list(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String relatedToType,
            @RequestParam(required = false) Long relatedToId,
            @RequestParam(required = false) Long owner,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String direction
    ) {
        return ResponseEntity.ok(activityService.list(type, relatedToType, relatedToId, owner, page, size, sort, direction));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActivityDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(activityService.get(id));
    }

    @PostMapping
    public ResponseEntity<ActivityDto> create(@Valid @RequestBody ActivityRequest request) {
        return ResponseEntity.status(201).body(activityService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActivityDto> update(@PathVariable Long id, @Valid @RequestBody ActivityRequest request) {
        return ResponseEntity.ok(activityService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        activityService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
