package com.crm.portal.service;

import com.crm.portal.dto.DealDto;
import com.crm.portal.dto.DealRequest;
import com.crm.portal.dto.PageResponse;
import com.crm.portal.entity.Company;
import com.crm.portal.entity.Contact;
import com.crm.portal.entity.Deal;
import com.crm.portal.entity.Notification;
import com.crm.portal.entity.User;
import com.crm.portal.enums.DealStage;
import com.crm.portal.enums.NotificationType;
import com.crm.portal.exception.ResourceNotFoundException;
import com.crm.portal.mapper.DealMapper;
import com.crm.portal.repository.CompanyRepository;
import com.crm.portal.repository.ContactRepository;
import com.crm.portal.repository.DealRepository;
import com.crm.portal.repository.NotificationRepository;
import com.crm.portal.repository.UserRepository;
import com.crm.portal.specification.DealSpecification;
import com.crm.portal.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DealService {

    private final DealRepository dealRepository;
    private final CompanyRepository companyRepository;
    private final ContactRepository contactRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final AuditLogService auditLogService;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public PageResponse<DealDto> list(String search, String stage, Long ownerId, Long companyId,
                                       Integer page, Integer size, String sort, String direction) {
        Pageable pageable = PageUtils.build(page, size, sort, direction);
        Page<Deal> result = dealRepository.findAll(DealSpecification.filter(search, stage, ownerId, companyId), pageable);
        return PageResponse.of(result.map(DealMapper::toDto));
    }

    @Transactional(readOnly = true)
    public DealDto get(Long id) {
        return DealMapper.toDto(getDealOrThrow(id));
    }

    @Transactional
    public DealDto create(DealRequest request) {
        Deal deal = Deal.builder()
                .title(request.getTitle())
                .company(resolveCompany(request.getCompanyId()))
                .contact(resolveContact(request.getContactId()))
                .amount(request.getAmount())
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .stage(request.getStage() != null ? request.getStage() : DealStage.NEW)
                .probability(request.getProbability())
                .expectedCloseDate(request.getExpectedCloseDate())
                .owner(resolveOwner(request.getOwnerId()))
                .build();

        deal = dealRepository.save(deal);
        auditLogService.log(currentUserService.getCurrentUser(), "CREATE_DEAL", "Deal", deal.getId());

        return DealMapper.toDto(deal);
    }

    @Transactional
    public DealDto update(Long id, DealRequest request) {
        Deal deal = getDealOrThrow(id);

        deal.setTitle(request.getTitle());
        deal.setCompany(resolveCompany(request.getCompanyId()));
        deal.setContact(resolveContact(request.getContactId()));
        deal.setAmount(request.getAmount());
        if (request.getCurrency() != null) {
            deal.setCurrency(request.getCurrency());
        }
        if (request.getStage() != null) {
            applyStage(deal, request.getStage());
        }
        deal.setProbability(request.getProbability());
        deal.setExpectedCloseDate(request.getExpectedCloseDate());
        deal.setOwner(resolveOwner(request.getOwnerId()));

        deal = dealRepository.save(deal);
        auditLogService.log(currentUserService.getCurrentUser(), "UPDATE_DEAL", "Deal", deal.getId());

        return DealMapper.toDto(deal);
    }

    @Transactional
    public DealDto updateStage(Long id, DealStage stage) {
        Deal deal = getDealOrThrow(id);
        applyStage(deal, stage);
        deal = dealRepository.save(deal);

        auditLogService.log(currentUserService.getCurrentUser(), "DEAL_STAGE_CHANGED", "Deal", deal.getId());

        if (deal.getOwner() != null && (stage == DealStage.WON || stage == DealStage.LOST)) {
            Notification notification = Notification.builder()
                    .user(deal.getOwner())
                    .title("Deal " + (stage == DealStage.WON ? "won" : "lost"))
                    .message("\"" + deal.getTitle() + "\" moved to " + stage.name() + ".")
                    .type(stage == DealStage.WON ? NotificationType.SUCCESS : NotificationType.WARNING)
                    .build();
            notificationRepository.save(notification);
        }

        return DealMapper.toDto(deal);
    }

    @Transactional
    public void delete(Long id) {
        Deal deal = getDealOrThrow(id);
        dealRepository.delete(deal);
        auditLogService.log(currentUserService.getCurrentUser(), "DELETE_DEAL", "Deal", id);
    }

    private void applyStage(Deal deal, DealStage stage) {
        deal.setStage(stage);
        if (stage == DealStage.WON || stage == DealStage.LOST) {
            deal.setClosedAt(LocalDateTime.now());
        } else {
            deal.setClosedAt(null);
        }
    }

    private Company resolveCompany(Long companyId) {
        if (companyId == null) return null;
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id " + companyId));
    }

    private Contact resolveContact(Long contactId) {
        if (contactId == null) return null;
        return contactRepository.findById(contactId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id " + contactId));
    }

    private User resolveOwner(Long ownerId) {
        if (ownerId == null) return null;
        return userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + ownerId));
    }

    private Deal getDealOrThrow(Long id) {
        return dealRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deal not found with id " + id));
    }
}
