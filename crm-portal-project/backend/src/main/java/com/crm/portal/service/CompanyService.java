package com.crm.portal.service;

import com.crm.portal.dto.CompanyDto;
import com.crm.portal.dto.CompanyRequest;
import com.crm.portal.dto.PageResponse;
import com.crm.portal.entity.Company;
import com.crm.portal.entity.User;
import com.crm.portal.exception.ResourceNotFoundException;
import com.crm.portal.mapper.CompanyMapper;
import com.crm.portal.repository.CompanyRepository;
import com.crm.portal.repository.UserRepository;
import com.crm.portal.specification.CompanySpecification;
import com.crm.portal.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public PageResponse<CompanyDto> list(String search, String industry, Long ownerId,
                                          Integer page, Integer size, String sort, String direction) {
        Pageable pageable = PageUtils.build(page, size, sort, direction);
        Page<Company> result = companyRepository.findAll(CompanySpecification.filter(search, industry, ownerId), pageable);
        return PageResponse.of(result.map(CompanyMapper::toDto));
    }

    @Transactional(readOnly = true)
    public CompanyDto get(Long id) {
        return CompanyMapper.toDto(getCompanyOrThrow(id));
    }

    @Transactional
    public CompanyDto create(CompanyRequest request) {
        Company company = Company.builder()
                .name(request.getName())
                .industry(request.getIndustry())
                .website(request.getWebsite())
                .phone(request.getPhone())
                .email(request.getEmail())
                .addressLine(request.getAddressLine())
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .postalCode(request.getPostalCode())
                .annualRevenue(request.getAnnualRevenue())
                .employeeCount(request.getEmployeeCount())
                .owner(resolveOwner(request.getOwnerId()))
                .build();

        company = companyRepository.save(company);
        auditLogService.log(currentUserService.getCurrentUser(), "CREATE_COMPANY", "Company", company.getId());

        return CompanyMapper.toDto(company);
    }

    @Transactional
    public CompanyDto update(Long id, CompanyRequest request) {
        Company company = getCompanyOrThrow(id);

        company.setName(request.getName());
        company.setIndustry(request.getIndustry());
        company.setWebsite(request.getWebsite());
        company.setPhone(request.getPhone());
        company.setEmail(request.getEmail());
        company.setAddressLine(request.getAddressLine());
        company.setCity(request.getCity());
        company.setState(request.getState());
        company.setCountry(request.getCountry());
        company.setPostalCode(request.getPostalCode());
        company.setAnnualRevenue(request.getAnnualRevenue());
        company.setEmployeeCount(request.getEmployeeCount());
        company.setOwner(resolveOwner(request.getOwnerId()));

        company = companyRepository.save(company);
        auditLogService.log(currentUserService.getCurrentUser(), "UPDATE_COMPANY", "Company", company.getId());

        return CompanyMapper.toDto(company);
    }

    @Transactional
    public void delete(Long id) {
        Company company = getCompanyOrThrow(id);
        companyRepository.delete(company);
        auditLogService.log(currentUserService.getCurrentUser(), "DELETE_COMPANY", "Company", id);
    }

    private User resolveOwner(Long ownerId) {
        if (ownerId == null) return null;
        return userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + ownerId));
    }

    private Company getCompanyOrThrow(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id " + id));
    }
}
