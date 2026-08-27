package com.crm.portal.service;

import com.crm.portal.dto.BatchDto;
import com.crm.portal.dto.BatchRequest;
import com.crm.portal.dto.PageResponse;
import com.crm.portal.entity.Batch;
import com.crm.portal.entity.Course;
import com.crm.portal.entity.User;
import com.crm.portal.enums.BatchMode;
import com.crm.portal.enums.BatchStatus;
import com.crm.portal.exception.DuplicateResourceException;
import com.crm.portal.exception.ResourceNotFoundException;
import com.crm.portal.mapper.BatchMapper;
import com.crm.portal.repository.BatchRepository;
import com.crm.portal.repository.CourseRepository;
import com.crm.portal.repository.UserRepository;
import com.crm.portal.specification.BatchSpecification;
import com.crm.portal.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BatchService {

    private final BatchRepository batchRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public PageResponse<BatchDto> list(String search, String status, Long courseId, Long trainerId,
                                        Integer page, Integer size, String sort, String direction) {
        Pageable pageable = PageUtils.build(page, size, sort != null ? sort : "startDate", direction != null ? direction : "desc");
        Page<Batch> result = batchRepository.findAll(
                BatchSpecification.filter(search, status, courseId, trainerId), pageable);
        return PageResponse.of(result.map(BatchMapper::toDto));
    }

    @Transactional(readOnly = true)
    public BatchDto get(Long id) {
        return BatchMapper.toDto(getBatchOrThrow(id));
    }

    @Transactional
    public BatchDto create(BatchRequest request) {
        if (batchRepository.existsByBatchCodeIgnoreCase(request.getBatchCode())) {
            throw new DuplicateResourceException("A batch with this code already exists");
        }

        Batch batch = Batch.builder()
                .course(resolveCourse(request.getCourseId()))
                .batchCode(request.getBatchCode())
                .trainer(resolveTrainer(request.getTrainerId()))
                .mode(request.getMode() != null ? request.getMode() : BatchMode.ONLINE)
                .status(request.getStatus() != null ? request.getStatus() : BatchStatus.UPCOMING)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .capacity(request.getCapacity())
                .location(request.getLocation())
                .build();

        batch = batchRepository.save(batch);
        auditLogService.log(currentUserService.getCurrentUser(), "CREATE_BATCH", "Batch", batch.getId());

        return BatchMapper.toDto(batch);
    }

    @Transactional
    public BatchDto update(Long id, BatchRequest request) {
        Batch batch = getBatchOrThrow(id);

        if (!batch.getBatchCode().equalsIgnoreCase(request.getBatchCode())
                && batchRepository.existsByBatchCodeIgnoreCase(request.getBatchCode())) {
            throw new DuplicateResourceException("A batch with this code already exists");
        }

        batch.setCourse(resolveCourse(request.getCourseId()));
        batch.setBatchCode(request.getBatchCode());
        batch.setTrainer(resolveTrainer(request.getTrainerId()));
        if (request.getMode() != null) {
            batch.setMode(request.getMode());
        }
        if (request.getStatus() != null) {
            batch.setStatus(request.getStatus());
        }
        batch.setStartDate(request.getStartDate());
        batch.setEndDate(request.getEndDate());
        batch.setCapacity(request.getCapacity());
        batch.setLocation(request.getLocation());

        batch = batchRepository.save(batch);
        auditLogService.log(currentUserService.getCurrentUser(), "UPDATE_BATCH", "Batch", batch.getId());

        return BatchMapper.toDto(batch);
    }

    @Transactional
    public BatchDto updateStatus(Long id, BatchStatus status) {
        Batch batch = getBatchOrThrow(id);
        batch.setStatus(status);
        batch = batchRepository.save(batch);

        auditLogService.log(currentUserService.getCurrentUser(), "BATCH_STATUS_CHANGED", "Batch", batch.getId());

        return BatchMapper.toDto(batch);
    }

    @Transactional
    public void delete(Long id) {
        Batch batch = getBatchOrThrow(id);
        batchRepository.delete(batch);
        auditLogService.log(currentUserService.getCurrentUser(), "DELETE_BATCH", "Batch", id);
    }

    private Course resolveCourse(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id " + courseId));
    }

    private User resolveTrainer(Long trainerId) {
        if (trainerId == null) return null;
        return userRepository.findById(trainerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + trainerId));
    }

    private Batch getBatchOrThrow(Long id) {
        return batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found with id " + id));
    }
}
