package com.crm.portal.controller;

import com.crm.portal.dto.CalendarEventDto;
import com.crm.portal.dto.CalendarEventRequest;
import com.crm.portal.dto.PageResponse;
import com.crm.portal.service.CalendarEventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calendar/events")
@RequiredArgsConstructor
public class CalendarEventController {

    private final CalendarEventService calendarEventService;

    @GetMapping
    public ResponseEntity<PageResponse<CalendarEventDto>> list(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String direction
    ) {
        return ResponseEntity.ok(calendarEventService.list(page, size, sort, direction));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CalendarEventDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(calendarEventService.get(id));
    }

    @PostMapping
    public ResponseEntity<CalendarEventDto> create(@Valid @RequestBody CalendarEventRequest request) {
        return ResponseEntity.status(201).body(calendarEventService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CalendarEventDto> update(@PathVariable Long id, @Valid @RequestBody CalendarEventRequest request) {
        return ResponseEntity.ok(calendarEventService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        calendarEventService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
