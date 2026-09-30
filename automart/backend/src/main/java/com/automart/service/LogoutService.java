package com.automart.service;

import com.automart.dto.response.LogoutResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface LogoutService {

    LogoutResponse performLogout(String token, HttpServletRequest request, HttpServletResponse response);

    LogoutResponse performLogoutForUser(Long userId, String token, HttpServletRequest request, HttpServletResponse response);
}
