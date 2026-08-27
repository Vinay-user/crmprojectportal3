package com.crm.portal.controller;

import com.crm.portal.dto.PageResponse;
import com.crm.portal.dto.TeamDto;
import com.crm.portal.dto.TeamRequest;
import com.crm.portal.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @GetMapping
    public ResponseEntity<PageResponse<TeamDto>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String direction
    ) {
        return ResponseEntity.ok(teamService.list(search, page, size, sort, direction));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.get(id));
    }

    @PostMapping
    public ResponseEntity<TeamDto> create(@Valid @RequestBody TeamRequest request) {
        return ResponseEntity.status(201).body(teamService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeamDto> update(@PathVariable Long id, @Valid @RequestBody TeamRequest request) {
        return ResponseEntity.ok(teamService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        teamService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
