package com.automart.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private UserDto user;
    private String message;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserDto {
        private Long userId;
        private String fullName;
        private String email;
        private String mobileNumber;
        private String role;
        private Boolean isVerified;
    }
}
