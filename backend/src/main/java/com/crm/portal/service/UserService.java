package com.crm.portal.service;

import com.crm.portal.dto.PageResponse;
import com.crm.portal.dto.UserDto;
import com.crm.portal.dto.UserRequest;
import com.crm.portal.entity.Team;
import com.crm.portal.entity.User;
import com.crm.portal.entity.UserPermission;
import com.crm.portal.exception.DuplicateResourceException;
import com.crm.portal.exception.ResourceNotFoundException;
import com.crm.portal.mapper.UserMapper;
import com.crm.portal.repository.TeamRepository;
import com.crm.portal.repository.UserPermissionRepository;
import com.crm.portal.repository.UserRepository;
import com.crm.portal.specification.UserSpecification;
import com.crm.portal.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserPermissionRepository userPermissionRepository;
    private final TeamRepository teamRepository;
    private final AuditLogService auditLogService;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public PageResponse<UserDto> list(String search, String role, Long teamId, Boolean isActive,
                                       Integer page, Integer size, String sort, String direction) {
        Pageable pageable = PageUtils.build(page, size, sort, direction);
        Page<User> result = userRepository.findAll(UserSpecification.filter(search, role, teamId, isActive), pageable);
        return PageResponse.of(result.map(this::toDto));
    }

    @Transactional(readOnly = true)
    public UserDto get(Long id) {
        return toDto(getUserOrThrow(id));
    }

    @Transactional
    public UserDto create(UserRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new DuplicateResourceException("A user with this email already exists");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required when creating a user");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(request.getRole() != null ? request.getRole() : com.crm.portal.enums.UserRole.USER)
                .phone(request.getPhone())
                .avatarUrl(request.getAvatarUrl())
                .team(resolveTeam(request.getTeamId()))
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        user = userRepository.save(user);
        savePermissions(user, request.getPermissions());

        auditLogService.log(currentUserService.getCurrentUser(), "CREATE_USER", "User", user.getId());

        return toDto(user);
    }

    @Transactional
    public UserDto update(Long id, UserRequest request) {
        User user = getUserOrThrow(id);

        if (!user.getEmail().equalsIgnoreCase(request.getEmail())
                && userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new DuplicateResourceException("A user with this email already exists");
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(request.getPassword());
        }
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        user.setPhone(request.getPhone());
        user.setAvatarUrl(request.getAvatarUrl());
        user.setTeam(resolveTeam(request.getTeamId()));
        if (request.getIsActive() != null) {
            user.setIsActive(request.getIsActive());
        }

        user = userRepository.save(user);

        if (request.getPermissions() != null) {
            userPermissionRepository.deleteByUserId(user.getId());
            savePermissions(user, request.getPermissions());
        }

        auditLogService.log(currentUserService.getCurrentUser(), "UPDATE_USER", "User", user.getId());

        return toDto(user);
    }

    @Transactional
    public void delete(Long id) {
        User user = getUserOrThrow(id);
        userPermissionRepository.deleteByUserId(id);
        userRepository.delete(user);
        auditLogService.log(currentUserService.getCurrentUser(), "DELETE_USER", "User", id);
    }

    private void savePermissions(User user, List<String> permissions) {
        if (permissions == null || permissions.isEmpty()) return;

        List<UserPermission> entries = permissions.stream()
                .map(p -> UserPermission.builder().user(user).permission(p).build())
                .collect(Collectors.toList());

        userPermissionRepository.saveAll(entries);
    }

    private Team resolveTeam(Long teamId) {
        if (teamId == null) return null;
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id " + teamId));
    }

    private User getUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
    }

    private UserDto toDto(User user) {
        List<String> permissions = userPermissionRepository.findByUserId(user.getId())
                .stream()
                .map(UserPermission::getPermission)
                .collect(Collectors.toList());
        return UserMapper.toDto(user, permissions);
    }
}
