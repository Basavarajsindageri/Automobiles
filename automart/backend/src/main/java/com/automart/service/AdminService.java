package com.automart.service;

import com.automart.dto.request.AdminProductRequest;
import com.automart.dto.request.AdminUserUpdateRequest;
import com.automart.dto.response.*;
import java.time.LocalDate;

public interface AdminService {

    ApiResponse addProduct(AdminProductRequest request);

    ApiResponse deleteProduct(Long id);

    ApiResponse updateUser(Long id, AdminUserUpdateRequest request);

    DailyAnalyticsResponse getDailyAnalytics(LocalDate date);

    MonthlyAnalyticsResponse getMonthlyAnalytics(Integer month, Integer year);

    YearlyAnalyticsResponse getYearlyAnalytics(Integer year);

    OverallAnalyticsResponse getOverallAnalytics();
}
