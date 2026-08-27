package com.crm.portal.mapper;

import com.crm.portal.dto.ActivityDto;
import com.crm.portal.entity.Activity;

public final class ActivityMapper {

    private ActivityMapper() {
    }

    public static ActivityDto toDto(Activity activity) {
        if (activity == null) return null;

        return ActivityDto.builder()
                .id(activity.getId())
                .type(activity.getType())
                .subject(activity.getSubject())
                .description(activity.getDescription())
                .relatedToType(activity.getRelatedToType())
                .relatedToId(activity.getRelatedToId())
                .ownerId(activity.getOwner() != null ? activity.getOwner().getId() : null)
                .ownerName(activity.getOwner() != null ? activity.getOwner().getFullName().trim() : null)
                .activityDate(activity.getActivityDate())
                .createdAt(activity.getCreatedAt())
                .updatedAt(activity.getUpdatedAt())
                .build();
    }
}
