package com.crm.portal.mapper;

import com.crm.portal.dto.CalendarEventDto;
import com.crm.portal.entity.CalendarEvent;
import com.crm.portal.entity.User;

import java.util.List;
import java.util.stream.Collectors;

public final class CalendarEventMapper {

    private CalendarEventMapper() {
    }

    public static CalendarEventDto toDto(CalendarEvent event) {
        if (event == null) return null;

        List<Long> attendeeIds = event.getAttendees() == null
                ? List.of()
                : event.getAttendees().stream().map(User::getId).collect(Collectors.toList());

        return CalendarEventDto.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .location(event.getLocation())
                .ownerId(event.getOwner() != null ? event.getOwner().getId() : null)
                .ownerName(event.getOwner() != null ? event.getOwner().getFullName().trim() : null)
                .relatedToType(event.getRelatedToType())
                .relatedToId(event.getRelatedToId())
                .attendeeIds(attendeeIds)
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }
}
