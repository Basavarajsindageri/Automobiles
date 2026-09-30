package com.automart.service;

import com.automart.dto.request.*;
import com.automart.dto.response.ApiResponse;
import com.automart.dto.response.AuthResponse;
import com.automart.entity.Otp;
import com.automart.entity.Role;
import com.automart.entity.User;
import com.automart.exception.BadRequestException;
import com.automart.exception.ResourceNotFoundException;
import com.automart.repository.JwtTokenRepository;
import com.automart.repository.OtpRepository;
import com.automart.repository.UserRepository;
import com.automart.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private JwtTokenRepository jwtTokenRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address is already in use.");
        }
        if (userRepository.existsByMobileNumber(request.getMobileNumber())) {
            throw new BadRequestException("Mobile number is already registered.");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .mobileNumber(request.getMobileNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .isVerified(true)
                .build();

        User saved = userRepository.save(user);
        String token = tokenProvider.generateTokenFromEmail(saved.getEmail());

        saveUserToken(saved, token);

        return AuthResponse.builder()
                .token(token)
                .user(mapToUserDto(saved))
                .message("User registered successfully")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmailOrMobile(), request.getPassword())
        );

        User user = userRepository.findByEmailOrMobileNumber(request.getEmailOrMobile(), request.getEmailOrMobile())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String token = tokenProvider.generateToken(authentication);

        saveUserToken(user, token);

        return AuthResponse.builder()
                .token(token)
                .user(mapToUserDto(user))
                .message("Login successful")
                .build();
    }

    private void saveUserToken(User user, String token) {
        com.automart.entity.JwtToken jwtToken = com.automart.entity.JwtToken.builder()
                .user(user)
                .token(token)
                .revoked(false)
                .expired(false)
                .createdAt(LocalDateTime.now())
                .build();
        jwtTokenRepository.save(jwtToken);
    }

    public ApiResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmailOrMobileNumber(request.getEmailOrMobile(), request.getEmailOrMobile())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with provided email/mobile"));

        String generatedOtp = String.format("%06d", new Random().nextInt(900000) + 100000);

        Otp otp = Otp.builder()
                .emailOrMobile(request.getEmailOrMobile())
                .otpCode(generatedOtp)
                .expiryTime(LocalDateTime.now().plusMinutes(10))
                .isUsed(false)
                .build();

        otpRepository.save(otp);

        return ApiResponse.builder()
                .success(true)
                .message("OTP generated successfully: " + generatedOtp)
                .build();
    }

    public ApiResponse verifyOtp(VerifyOtpRequest request) {
        Otp otp = otpRepository.findTopByEmailOrMobileAndOtpCodeAndIsUsedFalseOrderByExpiryTimeDesc(
                request.getEmailOrMobile(), request.getOtp())
                .orElseThrow(() -> new BadRequestException("Invalid or expired OTP"));

        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP has expired");
        }

        otp.setIsUsed(true);
        otpRepository.save(otp);

        return ApiResponse.builder().success(true).message("OTP verified successfully").build();
    }

    public ApiResponse resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmailOrMobileNumber(request.getEmailOrMobile(), request.getEmailOrMobile())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ApiResponse.builder().success(true).message("Password reset successfully").build();
    }

    public ApiResponse changePassword(String userEmail, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ApiResponse.builder().success(true).message("Password updated successfully").build();
    }

    private AuthResponse.UserDto mapToUserDto(User user) {
        return AuthResponse.UserDto.builder()
                .userId(user.getUserId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .mobileNumber(user.getMobileNumber())
                .role(user.getRole().name())
                .isVerified(user.getIsVerified())
                .build();
    }
}
