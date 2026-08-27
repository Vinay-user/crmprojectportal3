package com.crm.portal.service;

import com.crm.portal.entity.AuditLog;
import com.crm.portal.entity.User;
import com.crm.portal.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Lightweight audit trail for security-sensitive operations
 * (login, user/role changes, deletions, deal stage changes, etc).
 */
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void log(User actor, String action, String entityType, Long entityId) {
        AuditLog entry = AuditLog.builder()
                .user(actor)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .build();

        auditLogRepository.save(entry);
    }
}
