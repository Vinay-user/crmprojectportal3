package com.crm.portal.service;

import com.crm.portal.dto.ContactDto;
import com.crm.portal.dto.ContactRequest;
import com.crm.portal.dto.PageResponse;
import com.crm.portal.entity.Company;
import com.crm.portal.entity.Contact;
import com.crm.portal.entity.User;
import com.crm.portal.exception.ResourceNotFoundException;
import com.crm.portal.mapper.ContactMapper;
import com.crm.portal.repository.CompanyRepository;
import com.crm.portal.repository.ContactRepository;
import com.crm.portal.repository.UserRepository;
import com.crm.portal.specification.ContactSpecification;
import com.crm.portal.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public PageResponse<ContactDto> list(String search, Long companyId, Long ownerId,
                                          Integer page, Integer size, String sort, String direction) {
        Pageable pageable = PageUtils.build(page, size, sort, direction);
        Page<Contact> result = contactRepository.findAll(ContactSpecification.filter(search, companyId, ownerId), pageable);
        return PageResponse.of(result.map(ContactMapper::toDto));
    }

    @Transactional(readOnly = true)
    public ContactDto get(Long id) {
        return ContactMapper.toDto(getContactOrThrow(id));
    }

    @Transactional
    public ContactDto create(ContactRequest request) {
        Contact contact = Contact.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .jobTitle(request.getJobTitle())
                .company(resolveCompany(request.getCompanyId()))
                .owner(resolveOwner(request.getOwnerId()))
                .notes(request.getNotes())
                .build();

        contact = contactRepository.save(contact);
        auditLogService.log(currentUserService.getCurrentUser(), "CREATE_CONTACT", "Contact", contact.getId());

        return ContactMapper.toDto(contact);
    }

    @Transactional
    public ContactDto update(Long id, ContactRequest request) {
        Contact contact = getContactOrThrow(id);

        contact.setFirstName(request.getFirstName());
        contact.setLastName(request.getLastName());
        contact.setEmail(request.getEmail());
        contact.setPhone(request.getPhone());
        contact.setJobTitle(request.getJobTitle());
        contact.setCompany(resolveCompany(request.getCompanyId()));
        contact.setOwner(resolveOwner(request.getOwnerId()));
        contact.setNotes(request.getNotes());

        contact = contactRepository.save(contact);
        auditLogService.log(currentUserService.getCurrentUser(), "UPDATE_CONTACT", "Contact", contact.getId());

        return ContactMapper.toDto(contact);
    }

    @Transactional
    public void delete(Long id) {
        Contact contact = getContactOrThrow(id);
        contactRepository.delete(contact);
        auditLogService.log(currentUserService.getCurrentUser(), "DELETE_CONTACT", "Contact", id);
    }

    private Company resolveCompany(Long companyId) {
        if (companyId == null) return null;
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id " + companyId));
    }

    private User resolveOwner(Long ownerId) {
        if (ownerId == null) return null;
        return userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + ownerId));
    }

    private Contact getContactOrThrow(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id " + id));
    }
}
