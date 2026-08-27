package com.crm.portal.service;

import com.crm.portal.dto.PageResponse;
import com.crm.portal.dto.TaskDto;
import com.crm.portal.dto.TaskRequest;
import com.crm.portal.entity.Task;
import com.crm.portal.entity.User;
import com.crm.portal.enums.PriorityLevel;
import com.crm.portal.enums.TaskStatus;
import com.crm.portal.exception.ResourceNotFoundException;
import com.crm.portal.mapper.TaskMapper;
import com.crm.portal.repository.TaskRepository;
import com.crm.portal.repository.UserRepository;
import com.crm.portal.specification.TaskSpecification;
import com.crm.portal.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public PageResponse<TaskDto> list(String search, String status, String priority, Long assignedTo,
                                       Integer page, Integer size, String sort, String direction) {
        Pageable pageable = PageUtils.build(page, size, sort, direction);
        Page<Task> result = taskRepository.findAll(
                TaskSpecification.filter(search, status, priority, assignedTo), pageable);
        return PageResponse.of(result.map(TaskMapper::toDto));
    }

    @Transactional(readOnly = true)
    public TaskDto get(Long id) {
        return TaskMapper.toDto(getTaskOrThrow(id));
    }

    @Transactional
    public TaskDto create(TaskRequest request) {
        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .priority(request.getPriority() != null ? request.getPriority() : PriorityLevel.MEDIUM)
                .dueDate(request.getDueDate())
                .assignedTo(resolveUser(request.getAssignedTo()))
                .relatedToType(request.getRelatedToType())
                .relatedToId(request.getRelatedToId())
                .build();

        task = taskRepository.save(task);
        auditLogService.log(currentUserService.getCurrentUser(), "CREATE_TASK", "Task", task.getId());

        return TaskMapper.toDto(task);
    }

    @Transactional
    public TaskDto update(Long id, TaskRequest request) {
        Task task = getTaskOrThrow(id);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            applyStatus(task, request.getStatus());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        task.setDueDate(request.getDueDate());
        task.setAssignedTo(resolveUser(request.getAssignedTo()));
        task.setRelatedToType(request.getRelatedToType());
        task.setRelatedToId(request.getRelatedToId());

        task = taskRepository.save(task);
        auditLogService.log(currentUserService.getCurrentUser(), "UPDATE_TASK", "Task", task.getId());

        return TaskMapper.toDto(task);
    }

    @Transactional
    public TaskDto complete(Long id) {
        Task task = getTaskOrThrow(id);
        applyStatus(task, TaskStatus.COMPLETED);
        task = taskRepository.save(task);

        auditLogService.log(currentUserService.getCurrentUser(), "COMPLETE_TASK", "Task", task.getId());

        return TaskMapper.toDto(task);
    }

    @Transactional
    public void delete(Long id) {
        Task task = getTaskOrThrow(id);
        taskRepository.delete(task);
        auditLogService.log(currentUserService.getCurrentUser(), "DELETE_TASK", "Task", id);
    }

    private void applyStatus(Task task, TaskStatus status) {
        task.setStatus(status);
        task.setCompletedAt(status == TaskStatus.COMPLETED ? LocalDateTime.now() : null);
    }

    private User resolveUser(Long userId) {
        if (userId == null) return null;
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));
    }

    private Task getTaskOrThrow(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id " + id));
    }
}
