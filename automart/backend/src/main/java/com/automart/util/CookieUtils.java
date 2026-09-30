package com.automart.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class CookieUtils {

    public static final String AUTH_COOKIE_NAME = "jwt_token";

    public Optional<Cookie> getCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(name)) {
                    return Optional.of(cookie);
                }
            }
        }
        return Optional.empty();
    }

    public void addCookie(HttpServletResponse response, String name, String value, int maxAge, boolean secure) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .path("/")
                .maxAge(maxAge)
                .httpOnly(true)
                .secure(secure)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public void clearCookie(HttpServletResponse response, String name, boolean secure) {
        ResponseCookie cookie = ResponseCookie.from(name, "")
                .path("/")
                .maxAge(0)
                .httpOnly(true)
                .secure(secure)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
