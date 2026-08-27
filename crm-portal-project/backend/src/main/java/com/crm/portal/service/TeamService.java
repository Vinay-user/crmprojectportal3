package com.crm.portal.service;

import com.crm.portal.dto.PageResponse;
import com.crm.portal.dto.TeamDto;
import com.crm.portal.dto.TeamRequest;
import com.crm.portal.entity.Team;
import com.crm.portal.entity.User;
import com.crm.portal.exception.ResourceNotFoundException;
import com.crm.portal.mapper.TeamMapper;
import com.crm.portal.repository.TeamRepository;
import com.crm.portal.repository.UserRepository;
import com.crm.portal.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public PageResponse<TeamDto> list(String search, Integer page, Integer size, String sort, String direction) {
        Pageable pageable = PageUtils.build(page, size, sort != null ? sort : "name", direction != null ? direction : "asc");

        Page<Team> result = StringUtils.hasText(search)
                ? teamRepository.findByNameContainingIgnoreCase(search, pageable)
                : teamRepository.findAll(pageable);

        return PageResponse.of(result.map(TeamMapper::toDto));
    }

    @Transactional(readOnly = true)
    public TeamDto get(Long id) {
        return TeamMapper.toDto(getTeamOrThrow(id));
    }

    @Transactional
    public TeamDto create(TeamRequest request) {
        Team team = Team.builder()
                .name(request.getName())
                .description(request.getDescription())
                .manager(resolveManager(request.getManagerId()))
                .build();

        team = teamRepository.save(team);
        auditLogService.log(currentUserService.getCurrentUser(), "CREATE_TEAM", "Team", team.getId());

        return TeamMapper.toDto(team);
    }

    @Transactional
    public TeamDto update(Long id, TeamRequest request) {
        Team team = getTeamOrThrow(id);

        team.setName(request.getName());
        team.setDescription(request.getDescription());
        team.setManager(resolveManager(request.getManagerId()));

        team = teamRepository.save(team);
        auditLogService.log(currentUserService.getCurrentUser(), "UPDATE_TEAM", "Team", team.getId());

        return TeamMapper.toDto(team);
    }

    @Transactional
    public void delete(Long id) {
        Team team = getTeamOrThrow(id);
        teamRepository.delete(team);
        auditLogService.log(currentUserService.getCurrentUser(), "DELETE_TEAM", "Team", id);
    }

    private User resolveManager(Long managerId) {
        if (managerId == null) return null;
        return userRepository.findById(managerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + managerId));
    }

    private Team getTeamOrThrow(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id " + id));
    }
}
