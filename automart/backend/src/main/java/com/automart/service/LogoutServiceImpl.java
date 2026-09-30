package com.automart.service;

import com.automart.dto.response.LogoutResponse;
import com.automart.entity.JwtToken;
import com.automart.entity.User;
import com.automart.repository.JwtTokenRepository;
import com.automart.repository.UserRepository;
import com.automart.util.CookieUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Slf4j
@Service
public class LogoutServiceImpl implements LogoutService {

    private final JwtTokenRepository jwtTokenRepository;
    private final UserRepository userRepository;
    private final CookieUtils cookieUtils;

    // Constructor Dependency Injection
    public LogoutServiceImpl(JwtTokenRepository jwtTokenRepository,
                             UserRepository userRepository,
                             CookieUtils cookieUtils) {
        this.jwtTokenRepository = jwtTokenRepository;
        this.userRepository = userRepository;
        this.cookieUtils = cookieUtils;
    }

    @Override
    @Transactional
    public LogoutResponse performLogout(String token, HttpServletRequest request, HttpServletResponse response) {
        try {
            if (StringUtils.hasText(token)) {
                cleanTokenFromDatabase(token);
            }

            // Clear authentication cookies
            cookieUtils.clearCookie(response, CookieUtils.AUTH_COOKIE_NAME, request != null && request.isSecure());
            cookieUtils.clearCookie(response, "token", request != null && request.isSecure());

            return LogoutResponse.builder()
                    .message("Logout successful")
                    .build();
        } catch (Exception ex) {
            log.error("Unexpected error during logout operation", ex);
            throw new RuntimeException("Logout failed");
        }
    }

    @Override
    @Transactional
    public LogoutResponse performLogoutForUser(Long userId, String token, HttpServletRequest request, HttpServletResponse response) {
        try {
            if (userId != null) {
                log.info("Performing logout for userId: {}", userId);
                jwtTokenRepository.deleteByUserUserId(userId);
            } else if (StringUtils.hasText(token)) {
                cleanTokenFromDatabase(token);
            }

            // Clear authentication cookies
            cookieUtils.clearCookie(response, CookieUtils.AUTH_COOKIE_NAME, request != null && request.isSecure());
            cookieUtils.clearCookie(response, "token", request != null && request.isSecure());

            return LogoutResponse.builder()
                    .message("Logout successful")
                    .build();
        } catch (Exception ex) {
            log.error("Unexpected error during user logout operation", ex);
            throw new RuntimeException("Logout failed");
        }
    }

    private void cleanTokenFromDatabase(String token) {
        if (!StringUtils.hasText(token)) {
            return;
        }
        Optional<JwtToken> jwtTokenOpt = jwtTokenRepository.findByToken(token);
        if (jwtTokenOpt.isPresent()) {
            jwtTokenRepository.deleteByToken(token);
            log.info("Successfully deleted JWT token from database");
        } else {
            log.info("JWT token not found in database; completing logout idempotently");
        }
    }
}
