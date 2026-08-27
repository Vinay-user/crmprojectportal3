package com.crm.portal.service;

import com.crm.portal.dto.ActivityDto;
import com.crm.portal.dto.ActivityRequest;
import com.crm.portal.dto.PageResponse;
import com.crm.portal.entity.Activity;
import com.crm.portal.entity.User;
import com.crm.portal.enums.ActivityType;
import com.crm.portal.exception.ResourceNotFoundException;
import com.crm.portal.mapper.ActivityMapper;
import com.crm.portal.repository.ActivityRepository;
import com.crm.portal.repository.UserRepository;
import com.crm.portal.specification.ActivitySpecification;
import com.crm.portal.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public PageResponse<ActivityDto> list(String type, String relatedToType, Long relatedToId, Long ownerId,
                                           Integer page, Integer size, String sort, String direction) {
        Pageable pageable = PageUtils.build(page, size, sort, direction);
        Page<Activity> result = activityRepository.findAll(
                ActivitySpecification.filter(type, relatedToType, relatedToId, ownerId), pageable);
        return PageResponse.of(result.map(ActivityMapper::toDto));
    }

    @Transactional(readOnly = true)
    public ActivityDto get(Long id) {
        return ActivityMapper.toDto(getActivityOrThrow(id));
    }

    @Transactional
    public ActivityDto create(ActivityRequest request) {
        Activity activity = Activity.builder()
                .type(request.getType() != null ? request.getType() : ActivityType.NOTE)
                .subject(request.getSubject())
                .description(request.getDescription())
                .relatedToType(request.getRelatedToType())
                .relatedToId(request.getRelatedToId())
                .owner(resolveOwner(request.getOwnerId()))
                .activityDate(request.getActivityDate())
                .build();

        activity = activityRepository.save(activity);
        auditLogService.log(currentUserService.getCurrentUser(), "CREATE_ACTIVITY", "Activity", activity.getId());

        return ActivityMapper.toDto(activity);
    }

    @Transactional
    public ActivityDto update(Long id, ActivityRequest request) {
        Activity activity = getActivityOrThrow(id);

        if (request.getType() != null) {
            activity.setType(request.getType());
        }
        activity.setSubject(request.getSubject());
        activity.setDescription(request.getDescription());
        activity.setRelatedToType(request.getRelatedToType());
        activity.setRelatedToId(request.getRelatedToId());
        activity.setOwner(resolveOwner(request.getOwnerId()));
        if (request.getActivityDate() != null) {
            activity.setActivityDate(request.getActivityDate());
        }

        activity = activityRepository.save(activity);
        auditLogService.log(currentUserService.getCurrentUser(), "UPDATE_ACTIVITY", "Activity", activity.getId());

        return ActivityMapper.toDto(activity);
    }

    @Transactional
    public void delete(Long id) {
        Activity activity = getActivityOrThrow(id);
        activityRepository.delete(activity);
        auditLogService.log(currentUserService.getCurrentUser(), "DELETE_ACTIVITY", "Activity", id);
    }

    private User resolveOwner(Long ownerId) {
        if (ownerId == null) return null;
        return userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + ownerId));
    }

    private Activity getActivityOrThrow(Long id) {
        return activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id " + id));
    }
}
