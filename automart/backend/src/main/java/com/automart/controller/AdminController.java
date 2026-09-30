package com.automart.controller;

import com.automart.dto.request.AdminProductRequest;
import com.automart.dto.request.AdminUserUpdateRequest;
import com.automart.dto.response.*;
import com.automart.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping({"/api/admin", "/api/v1/admin"})
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    // Constructor Dependency Injection
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ==================================================
    // PRODUCT MANAGEMENT
    // ==================================================

    @PostMapping("/products")
    public ResponseEntity<ApiResponse> addProduct(@Valid @RequestBody AdminProductRequest request) {
        ApiResponse response = adminService.addProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable Long id) {
        ApiResponse response = adminService.deleteProduct(id);
        return ResponseEntity.ok(response);
    }

    // ==================================================
    // USER MANAGEMENT
    // ==================================================

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse> updateUser(@PathVariable Long id,
                                                 @Valid @RequestBody AdminUserUpdateRequest request) {
        ApiResponse response = adminService.updateUser(id, request);
        return ResponseEntity.ok(response);
    }

    // ==================================================
    // BUSINESS ANALYTICS
    // ==================================================

    @GetMapping("/analytics/daily")
    public ResponseEntity<DailyAnalyticsResponse> getDailyAnalytics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        DailyAnalyticsResponse analytics = adminService.getDailyAnalytics(date);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/analytics/monthly")
    public ResponseEntity<MonthlyAnalyticsResponse> getMonthlyAnalytics(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        MonthlyAnalyticsResponse analytics = adminService.getMonthlyAnalytics(month, year);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/analytics/yearly")
    public ResponseEntity<YearlyAnalyticsResponse> getYearlyAnalytics(
            @RequestParam(required = false) Integer year) {
        YearlyAnalyticsResponse analytics = adminService.getYearlyAnalytics(year);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/analytics/overall")
    public ResponseEntity<OverallAnalyticsResponse> getOverallAnalytics() {
        OverallAnalyticsResponse analytics = adminService.getOverallAnalytics();
        return ResponseEntity.ok(analytics);
    }
}
