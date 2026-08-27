package com.crm.portal.mapper;

import com.crm.portal.dto.TeamDto;
import com.crm.portal.entity.Team;

public final class TeamMapper {

    private TeamMapper() {
    }

    public static TeamDto toDto(Team team) {
        if (team == null) return null;

        return TeamDto.builder()
                .id(team.getId())
                .name(team.getName())
                .description(team.getDescription())
                .managerId(team.getManager() != null ? team.getManager().getId() : null)
                .managerName(team.getManager() != null ? team.getManager().getFullName().trim() : null)
                .createdAt(team.getCreatedAt())
                .updatedAt(team.getUpdatedAt())
                .build();
    }
}
