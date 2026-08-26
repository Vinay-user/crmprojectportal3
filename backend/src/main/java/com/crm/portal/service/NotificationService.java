package com.crm.portal.service;

import com.crm.portal.dto.NotificationDto;
import com.crm.portal.dto.PageResponse;
import com.crm.portal.entity.Notification;
import com.crm.portal.exception.ResourceNotFoundException;
import com.crm.portal.mapper.NotificationMapper;
import com.crm.portal.repository.NotificationRepository;
import com.crm.portal.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public PageResponse<NotificationDto> list(Integer page, Integer size) {
        Pageable pageable = PageUtils.build(page, size, "createdAt", "desc");
        Long userId = currentUserService.getCurrentUser().getId();
        Page<Notification> result = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return PageResponse.of(result.map(NotificationMapper::toDto));
    }

    @Transactional
    public NotificationDto markRead(Long id) {
        Notification notification = getOwnedNotificationOrThrow(id);
        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        notification = notificationRepository.save(notification);
        return NotificationMapper.toDto(notification);
    }

    @Transactional
    public void markAllRead() {
        Long userId = currentUserService.getCurrentUser().getId();
        notificationRepository.markAllAsRead(userId, LocalDateTime.now());
    }

    @Transactional
    public void delete(Long id) {
        Notification notification = getOwnedNotificationOrThrow(id);
        notificationRepository.delete(notification);
    }

    private Notification getOwnedNotificationOrThrow(Long id) {
        Long userId = currentUserService.getCurrentUser().getId();
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id " + id));

        if (!notification.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Notification not found with id " + id);
        }

        return notification;
    }
}
