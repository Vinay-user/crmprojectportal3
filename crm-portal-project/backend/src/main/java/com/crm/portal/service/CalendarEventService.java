package com.crm.portal.service;

import com.crm.portal.dto.CalendarEventDto;
import com.crm.portal.dto.CalendarEventRequest;
import com.crm.portal.dto.PageResponse;
import com.crm.portal.entity.CalendarEvent;
import com.crm.portal.entity.User;
import com.crm.portal.exception.BadRequestException;
import com.crm.portal.exception.ResourceNotFoundException;
import com.crm.portal.mapper.CalendarEventMapper;
import com.crm.portal.repository.CalendarEventRepository;
import com.crm.portal.repository.UserRepository;
import com.crm.portal.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalendarEventService {

    private final CalendarEventRepository calendarEventRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public PageResponse<CalendarEventDto> list(Integer page, Integer size, String sort, String direction) {
        Pageable pageable = PageUtils.build(page, size, sort != null ? sort : "startTime", direction != null ? direction : "asc");
        Page<CalendarEvent> result = calendarEventRepository.findAll(pageable);
        return PageResponse.of(result.map(CalendarEventMapper::toDto));
    }

    @Transactional(readOnly = true)
    public CalendarEventDto get(Long id) {
        return CalendarEventMapper.toDto(getEventOrThrow(id));
    }

    @Transactional
    public CalendarEventDto create(CalendarEventRequest request) {
        validateTimes(request);

        CalendarEvent event = CalendarEvent.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .location(request.getLocation())
                .owner(resolveUser(request.getOwnerId()))
                .relatedToType(request.getRelatedToType())
                .relatedToId(request.getRelatedToId())
                .attendees(resolveAttendees(request.getAttendeeIds()))
                .build();

        event = calendarEventRepository.save(event);
        auditLogService.log(currentUserService.getCurrentUser(), "CREATE_CALENDAR_EVENT", "CalendarEvent", event.getId());

        return CalendarEventMapper.toDto(event);
    }

    @Transactional
    public CalendarEventDto update(Long id, CalendarEventRequest request) {
        CalendarEvent event = getEventOrThrow(id);
        validateTimes(request);

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setLocation(request.getLocation());
        event.setOwner(resolveUser(request.getOwnerId()));
        event.setRelatedToType(request.getRelatedToType());
        event.setRelatedToId(request.getRelatedToId());
        event.setAttendees(resolveAttendees(request.getAttendeeIds()));

        event = calendarEventRepository.save(event);
        auditLogService.log(currentUserService.getCurrentUser(), "UPDATE_CALENDAR_EVENT", "CalendarEvent", event.getId());

        return CalendarEventMapper.toDto(event);
    }

    @Transactional
    public void delete(Long id) {
        CalendarEvent event = getEventOrThrow(id);
        calendarEventRepository.delete(event);
        auditLogService.log(currentUserService.getCurrentUser(), "DELETE_CALENDAR_EVENT", "CalendarEvent", id);
    }

    private void validateTimes(CalendarEventRequest request) {
        if (request.getEndTime().isBefore(request.getStartTime())) {
            throw new BadRequestException("End time cannot be before start time");
        }
    }

    private Set<User> resolveAttendees(List<Long> attendeeIds) {
        if (attendeeIds == null || attendeeIds.isEmpty()) return new HashSet<>();
        return attendeeIds.stream()
                .map(this::resolveUser)
                .collect(Collectors.toCollection(HashSet::new));
    }

    private User resolveUser(Long userId) {
        if (userId == null) return null;
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));
    }

    private CalendarEvent getEventOrThrow(Long id) {
        return calendarEventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Calendar event not found with id " + id));
    }
}
