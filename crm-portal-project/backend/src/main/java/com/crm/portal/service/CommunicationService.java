package com.crm.portal.service;

import com.crm.portal.dto.CommunicationDto;
import com.crm.portal.dto.CommunicationRequest;
import com.crm.portal.dto.PageResponse;
import com.crm.portal.entity.Communication;
import com.crm.portal.entity.Contact;
import com.crm.portal.entity.Lead;
import com.crm.portal.entity.User;
import com.crm.portal.exception.BadRequestException;
import com.crm.portal.exception.ResourceNotFoundException;
import com.crm.portal.mapper.CommunicationMapper;
import com.crm.portal.repository.CommunicationRepository;
import com.crm.portal.repository.ContactRepository;
import com.crm.portal.repository.LeadRepository;
import com.crm.portal.repository.UserRepository;
import com.crm.portal.specification.CommunicationSpecification;
import com.crm.portal.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommunicationService {

    private final CommunicationRepository communicationRepository;
    private final ContactRepository contactRepository;
    private final LeadRepository leadRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public PageResponse<CommunicationDto> list(String type, Long contactId, Long leadId, Long ownerId,
                                                Integer page, Integer size, String sort, String direction) {
        Pageable pageable = PageUtils.build(page, size, sort != null ? sort : "occurredAt", direction != null ? direction : "desc");
        Page<Communication> result = communicationRepository.findAll(
                CommunicationSpecification.filter(type, contactId, leadId, ownerId), pageable);
        return PageResponse.of(result.map(CommunicationMapper::toDto));
    }

    @Transactional(readOnly = true)
    public CommunicationDto get(Long id) {
        return CommunicationMapper.toDto(getCommunicationOrThrow(id));
    }

    @Transactional
    public CommunicationDto create(CommunicationRequest request) {
        validateTarget(request);

        Communication communication = Communication.builder()
                .type(request.getType())
                .direction(request.getDirection())
                .subject(request.getSubject())
                .content(request.getContent())
                .contact(resolveContact(request.getContactId()))
                .lead(resolveLead(request.getLeadId()))
                .owner(resolveOwner(request.getOwnerId()))
                .occurredAt(request.getOccurredAt())
                .build();

        communication = communicationRepository.save(communication);
        auditLogService.log(currentUserService.getCurrentUser(), "CREATE_COMMUNICATION", "Communication", communication.getId());

        return CommunicationMapper.toDto(communication);
    }

    @Transactional
    public CommunicationDto update(Long id, CommunicationRequest request) {
        Communication communication = getCommunicationOrThrow(id);
        validateTarget(request);

        communication.setType(request.getType());
        communication.setDirection(request.getDirection());
        communication.setSubject(request.getSubject());
        communication.setContent(request.getContent());
        communication.setContact(resolveContact(request.getContactId()));
        communication.setLead(resolveLead(request.getLeadId()));
        communication.setOwner(resolveOwner(request.getOwnerId()));
        if (request.getOccurredAt() != null) {
            communication.setOccurredAt(request.getOccurredAt());
        }

        communication = communicationRepository.save(communication);
        auditLogService.log(currentUserService.getCurrentUser(), "UPDATE_COMMUNICATION", "Communication", communication.getId());

        return CommunicationMapper.toDto(communication);
    }

    @Transactional
    public void delete(Long id) {
        Communication communication = getCommunicationOrThrow(id);
        communicationRepository.delete(communication);
        auditLogService.log(currentUserService.getCurrentUser(), "DELETE_COMMUNICATION", "Communication", id);
    }

    private void validateTarget(CommunicationRequest request) {
        if (request.getContactId() == null && request.getLeadId() == null) {
            throw new BadRequestException("A communication must be linked to a contact or a lead");
        }
    }

    private Contact resolveContact(Long contactId) {
        if (contactId == null) return null;
        return contactRepository.findById(contactId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id " + contactId));
    }

    private Lead resolveLead(Long leadId) {
        if (leadId == null) return null;
        return leadRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id " + leadId));
    }

    private User resolveOwner(Long ownerId) {
        if (ownerId == null) return null;
        return userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + ownerId));
    }

    private Communication getCommunicationOrThrow(Long id) {
        return communicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Communication not found with id " + id));
    }
}
