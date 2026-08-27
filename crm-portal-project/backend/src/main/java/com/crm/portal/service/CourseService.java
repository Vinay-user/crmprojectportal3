package com.crm.portal.service;

import com.crm.portal.dto.CourseDto;
import com.crm.portal.dto.CourseRequest;
import com.crm.portal.dto.PageResponse;
import com.crm.portal.entity.Course;
import com.crm.portal.exception.DuplicateResourceException;
import com.crm.portal.exception.ResourceNotFoundException;
import com.crm.portal.mapper.CourseMapper;
import com.crm.portal.repository.CourseRepository;
import com.crm.portal.specification.CourseSpecification;
import com.crm.portal.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final AuditLogService auditLogService;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public PageResponse<CourseDto> list(String search, String category, Boolean isActive,
                                         Integer page, Integer size, String sort, String direction) {
        Pageable pageable = PageUtils.build(page, size, sort != null ? sort : "name", direction != null ? direction : "asc");
        Page<Course> result = courseRepository.findAll(CourseSpecification.filter(search, category, isActive), pageable);
        return PageResponse.of(result.map(CourseMapper::toDto));
    }

    @Transactional(readOnly = true)
    public CourseDto get(Long id) {
        return CourseMapper.toDto(getCourseOrThrow(id));
    }

    @Transactional
    public CourseDto create(CourseRequest request) {
        if (courseRepository.existsByCodeIgnoreCase(request.getCode())) {
            throw new DuplicateResourceException("A course with this code already exists");
        }

        Course course = Course.builder()
                .name(request.getName())
                .code(request.getCode())
                .category(request.getCategory())
                .description(request.getDescription())
                .durationHours(request.getDurationHours())
                .fee(request.getFee())
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        course = courseRepository.save(course);
        auditLogService.log(currentUserService.getCurrentUser(), "CREATE_COURSE", "Course", course.getId());

        return CourseMapper.toDto(course);
    }

    @Transactional
    public CourseDto update(Long id, CourseRequest request) {
        Course course = getCourseOrThrow(id);

        if (!course.getCode().equalsIgnoreCase(request.getCode())
                && courseRepository.existsByCodeIgnoreCase(request.getCode())) {
            throw new DuplicateResourceException("A course with this code already exists");
        }

        course.setName(request.getName());
        course.setCode(request.getCode());
        course.setCategory(request.getCategory());
        course.setDescription(request.getDescription());
        course.setDurationHours(request.getDurationHours());
        course.setFee(request.getFee());
        if (request.getCurrency() != null) {
            course.setCurrency(request.getCurrency());
        }
        if (request.getIsActive() != null) {
            course.setIsActive(request.getIsActive());
        }

        course = courseRepository.save(course);
        auditLogService.log(currentUserService.getCurrentUser(), "UPDATE_COURSE", "Course", course.getId());

        return CourseMapper.toDto(course);
    }

    @Transactional
    public void delete(Long id) {
        Course course = getCourseOrThrow(id);
        courseRepository.delete(course);
        auditLogService.log(currentUserService.getCurrentUser(), "DELETE_COURSE", "Course", id);
    }

    private Course getCourseOrThrow(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id " + id));
    }
}
