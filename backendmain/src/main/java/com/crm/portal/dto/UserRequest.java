package com.crm.portal.dto;

import com.crm.portal.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    // Only required when creating a new user; ignored on update if blank.
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    private UserRole role;

    private String phone;

    private String avatarUrl;

    private Long teamId;

    private Boolean isActive;

    private List<String> permissions;
}
