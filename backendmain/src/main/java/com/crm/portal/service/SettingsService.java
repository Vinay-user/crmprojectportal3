package com.crm.portal.service;

import com.crm.portal.entity.SystemSetting;
import com.crm.portal.repository.SystemSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * CRM-wide settings, stored as simple key/value pairs in system_settings
 * (see database/seed.sql for the seeded keys: company_name,
 * default_currency, fiscal_year_start, lead_auto_assignment, etc).
 */
@Service
@RequiredArgsConstructor
public class SettingsService {

    private final SystemSettingRepository systemSettingRepository;
    private final AuditLogService auditLogService;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public Map<String, String> get() {
        Map<String, String> settings = new LinkedHashMap<>();
        systemSettingRepository.findAll().forEach(s -> settings.put(s.getSettingKey(), s.getSettingValue()));
        return settings;
    }

    @Transactional
    public Map<String, String> update(Map<String, String> updates) {
        updates.forEach((key, value) -> {
            SystemSetting setting = systemSettingRepository.findBySettingKey(key)
                    .orElseGet(() -> SystemSetting.builder().settingKey(key).build());
            setting.setSettingValue(value);
            setting.setUpdatedBy(currentUserService.getCurrentUser());
            systemSettingRepository.save(setting);
        });

        auditLogService.log(currentUserService.getCurrentUser(), "SETTINGS_CHANGED", "SystemSetting", null);

        return get();
    }
}
