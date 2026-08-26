package com.crm.portal.service;

import com.crm.portal.dto.LeadDto;
import com.crm.portal.dto.LeadRequest;
import com.crm.portal.dto.PageResponse;
import com.crm.portal.entity.Contact;
import com.crm.portal.entity.Lead;
import com.crm.portal.entity.User;
import com.crm.portal.enums.LeadStatus;
import com.crm.portal.exception.BadRequestException;
import com.crm.portal.exception.ResourceNotFoundException;
import com.crm.portal.mapper.LeadMapper;
import com.crm.portal.repository.ContactRepository;
import com.crm.portal.repository.LeadRepository;
import com.crm.portal.repository.UserRepository;
import com.crm.portal.specification.LeadSpecification;
import com.crm.portal.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;
    private final ContactRepository contactRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public PageResponse<LeadDto> list(String search, String status, String source, Long ownerId,
                                       Integer page, Integer size, String sort, String direction) {
        Pageable pageable = PageUtils.build(page, size, sort, direction);
        Page<Lead> result = leadRepository.findAll(LeadSpecification.filter(search, status, source, ownerId), pageable);
        return PageResponse.of(result.map(LeadMapper::toDto));
    }

    @Transactional(readOnly = true)
    public LeadDto get(Long id) {
        return LeadMapper.toDto(getLeadOrThrow(id));
    }

    @Transactional
    public LeadDto create(LeadRequest request) {
        Lead lead = Lead.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .company(request.getCompany())
                .source(request.getSource())
                .status(request.getStatus() != null ? request.getStatus() : LeadStatus.NEW)
                .owner(resolveOwner(request.getOwnerId()))
                .notes(request.getNotes())
                .build();

        lead = leadRepository.save(lead);
        auditLogService.log(currentUserService.getCurrentUser(), "CREATE_LEAD", "Lead", lead.getId());

        return LeadMapper.toDto(lead);
    }

    @Transactional
    public LeadDto update(Long id, LeadRequest request) {
        Lead lead = getLeadOrThrow(id);

        lead.setFirstName(request.getFirstName());
        lead.setLastName(request.getLastName());
        lead.setEmail(request.getEmail());
        lead.setPhone(request.getPhone());
        lead.setCompany(request.getCompany());
        lead.setSource(request.getSource());
        if (request.getStatus() != null) {
            lead.setStatus(request.getStatus());
        }
        lead.setOwner(resolveOwner(request.getOwnerId()));
        lead.setNotes(request.getNotes());

        lead = leadRepository.save(lead);
        auditLogService.log(currentUserService.getCurrentUser(), "UPDATE_LEAD", "Lead", lead.getId());

        return LeadMapper.toDto(lead);
    }

    @Transactional
    public void delete(Long id) {
        Lead lead = getLeadOrThrow(id);
        leadRepository.delete(lead);
        auditLogService.log(currentUserService.getCurrentUser(), "DELETE_LEAD", "Lead", id);
    }

    /**
     * Converts a lead into a Contact: creates the Contact record from the
     * lead's details and marks the lead CONVERTED.
     */
    @Transactional
    public LeadDto convert(Long id) {
        Lead lead = getLeadOrThrow(id);

        if (lead.getStatus() == LeadStatus.CONVERTED) {
            throw new BadRequestException("This lead has already been converted");
        }

        Contact contact = Contact.builder()
                .firstName(lead.getFirstName())
                .lastName(lead.getLastName())
                .email(lead.getEmail())
                .phone(lead.getPhone())
                .owner(lead.getOwner())
                .notes(lead.getNotes())
                .build();
        contact = contactRepository.save(contact);

        lead.setStatus(LeadStatus.CONVERTED);
        lead.setConvertedContact(contact);
        lead.setConvertedAt(LocalDateTime.now());
        lead = leadRepository.save(lead);

        auditLogService.log(currentUserService.getCurrentUser(), "CONVERT_LEAD", "Lead", lead.getId());

        return LeadMapper.toDto(lead);
    }

    private User resolveOwner(Long ownerId) {
        if (ownerId == null) return null;
        return userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + ownerId));
    }

    private Lead getLeadOrThrow(Long id) {
        return leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id " + id));
    }
}
