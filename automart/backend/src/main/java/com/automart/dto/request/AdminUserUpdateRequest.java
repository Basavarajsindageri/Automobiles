package com.automart.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserUpdateRequest {

    private String fullName;

    @Email(message = "Invalid email format")
    private String email;

    private String mobileNumber;

    private String password;

    @Pattern(regexp = "^(ROLE_USER|ROLE_ADMIN)$", message = "Role must be ROLE_USER or ROLE_ADMIN")
    private String role;

    private List<String> permissions;
}
