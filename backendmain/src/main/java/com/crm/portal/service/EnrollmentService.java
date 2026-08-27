package com.crm.portal.service;

import com.crm.portal.dto.EnrollmentDto;
import com.crm.portal.dto.EnrollmentRequest;
import com.crm.portal.dto.PageResponse;
import com.crm.portal.entity.Batch;
import com.crm.portal.entity.Company;
import com.crm.portal.entity.Contact;
import com.crm.portal.entity.Enrollment;
import com.crm.portal.enums.EnrollmentStatus;
import com.crm.portal.enums.PaymentStatus;
import com.crm.portal.exception.BadRequestException;
import com.crm.portal.exception.DuplicateResourceException;
import com.crm.portal.exception.ResourceNotFoundException;
import com.crm.portal.mapper.EnrollmentMapper;
import com.crm.portal.repository.BatchRepository;
import com.crm.portal.repository.CompanyRepository;
import com.crm.portal.repository.ContactRepository;
import com.crm.portal.repository.EnrollmentRepository;
import com.crm.portal.specification.EnrollmentSpecification;
import com.crm.portal.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Year;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final BatchRepository batchRepository;
    private final ContactRepository contactRepository;
    private final CompanyRepository companyRepository;
    private final AuditLogService auditLogService;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public PageResponse<EnrollmentDto> list(String status, String paymentStatus, Long batchId, Long contactId,
                                             Long companyId, Integer page, Integer size, String sort, String direction) {
        Pageable pageable = PageUtils.build(page, size, sort != null ? sort : "enrolledAt", direction != null ? direction : "desc");
        Page<Enrollment> result = enrollmentRepository.findAll(
                EnrollmentSpecification.filter(status, paymentStatus, batchId, contactId, companyId), pageable);
        return PageResponse.of(result.map(EnrollmentMapper::toDto));
    }

    @Transactional(readOnly = true)
    public EnrollmentDto get(Long id) {
        return EnrollmentMapper.toDto(getEnrollmentOrThrow(id));
    }

    @Transactional
    public EnrollmentDto create(EnrollmentRequest request) {
        if (enrollmentRepository.existsByBatchIdAndContactId(request.getBatchId(), request.getContactId())) {
            throw new DuplicateResourceException("This contact is already enrolled in this batch");
        }

        Enrollment enrollment = Enrollment.builder()
                .batch(resolveBatch(request.getBatchId()))
                .contact(resolveContact(request.getContactId()))
                .company(resolveCompany(request.getCompanyId()))
                .status(request.getStatus() != null ? request.getStatus() : EnrollmentStatus.ENROLLED)
                .paymentStatus(request.getPaymentStatus() != null ? request.getPaymentStatus() : PaymentStatus.PENDING)
                .feeAmount(request.getFeeAmount())
                .notes(request.getNotes())
                .build();

        enrollment = enrollmentRepository.save(enrollment);
        auditLogService.log(currentUserService.getCurrentUser(), "CREATE_ENROLLMENT", "Enrollment", enrollment.getId());

        return EnrollmentMapper.toDto(enrollment);
    }

    @Transactional
    public EnrollmentDto update(Long id, EnrollmentRequest request) {
        Enrollment enrollment = getEnrollmentOrThrow(id);

        boolean batchOrContactChanged = !enrollment.getBatch().getId().equals(request.getBatchId())
                || !enrollment.getContact().getId().equals(request.getContactId());

        if (batchOrContactChanged
                && enrollmentRepository.existsByBatchIdAndContactId(request.getBatchId(), request.getContactId())) {
            throw new DuplicateResourceException("This contact is already enrolled in this batch");
        }

        enrollment.setBatch(resolveBatch(request.getBatchId()));
        enrollment.setContact(resolveContact(request.getContactId()));
        enrollment.setCompany(resolveCompany(request.getCompanyId()));
        if (request.getStatus() != null) {
            applyStatus(enrollment, request.getStatus());
        }
        if (request.getPaymentStatus() != null) {
            enrollment.setPaymentStatus(request.getPaymentStatus());
        }
        enrollment.setFeeAmount(request.getFeeAmount());
        enrollment.setNotes(request.getNotes());

        enrollment = enrollmentRepository.save(enrollment);
        auditLogService.log(currentUserService.getCurrentUser(), "UPDATE_ENROLLMENT", "Enrollment", enrollment.getId());

        return EnrollmentMapper.toDto(enrollment);
    }

    /**
     * Marks an enrollment COMPLETED and issues a certificate number.
     */
    @Transactional
    public EnrollmentDto complete(Long id) {
        Enrollment enrollment = getEnrollmentOrThrow(id);

        if (enrollment.getStatus() == EnrollmentStatus.COMPLETED) {
            throw new BadRequestException("This enrollment is already marked completed");
        }

        applyStatus(enrollment, EnrollmentStatus.COMPLETED);
        enrollment.setCertificateNumber(generateCertificateNumber(enrollment));
        enrollment = enrollmentRepository.save(enrollment);

        auditLogService.log(currentUserService.getCurrentUser(), "COMPLETE_ENROLLMENT", "Enrollment", enrollment.getId());

        return EnrollmentMapper.toDto(enrollment);
    }

    @Transactional
    public EnrollmentDto updatePaymentStatus(Long id, PaymentStatus paymentStatus) {
        Enrollment enrollment = getEnrollmentOrThrow(id);
        enrollment.setPaymentStatus(paymentStatus);
        enrollment = enrollmentRepository.save(enrollment);

        auditLogService.log(currentUserService.getCurrentUser(), "ENROLLMENT_PAYMENT_CHANGED", "Enrollment", enrollment.getId());

        return EnrollmentMapper.toDto(enrollment);
    }

    @Transactional
    public void delete(Long id) {
        Enrollment enrollment = getEnrollmentOrThrow(id);
        enrollmentRepository.delete(enrollment);
        auditLogService.log(currentUserService.getCurrentUser(), "DELETE_ENROLLMENT", "Enrollment", id);
    }

    private void applyStatus(Enrollment enrollment, EnrollmentStatus status) {
        enrollment.setStatus(status);
        enrollment.setCompletedAt(status == EnrollmentStatus.COMPLETED ? LocalDateTime.now() : null);
    }

    private String generateCertificateNumber(Enrollment enrollment) {
        String batchCode = enrollment.getBatch() != null ? enrollment.getBatch().getBatchCode() : "CERT";
        return "CERT-" + batchCode + "-" + enrollment.getId() + "-" + Year.now();
    }

    private Batch resolveBatch(Long batchId) {
        return batchRepository.findById(batchId)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found with id " + batchId));
    }

    private Contact resolveContact(Long contactId) {
        return contactRepository.findById(contactId)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id " + contactId));
    }

    private Company resolveCompany(Long companyId) {
        if (companyId == null) return null;
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id " + companyId));
    }

    private Enrollment getEnrollmentOrThrow(Long id) {
        return enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id " + id));
    }
}
