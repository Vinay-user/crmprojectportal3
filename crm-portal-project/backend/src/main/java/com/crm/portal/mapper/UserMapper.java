package com.crm.portal.mapper;

import com.crm.portal.dto.UserDto;
import com.crm.portal.entity.User;

import java.util.List;

public final class UserMapper {

    private UserMapper() {
    }

    public static UserDto toDto(User user, List<String> permissions) {
        if (user == null) return null;

        return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName().trim())
                .email(user.getEmail())
                .role(user.getRole())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .teamId(user.getTeam() != null ? user.getTeam().getId() : null)
                .teamName(user.getTeam() != null ? user.getTeam().getName() : null)
                .isActive(user.getIsActive())
                .lastLoginAt(user.getLastLoginAt())
                .permissions(permissions)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
