package com.automart.service;

import com.automart.dto.request.AdminProductRequest;
import com.automart.dto.request.AdminUserUpdateRequest;
import com.automart.dto.response.*;
import com.automart.entity.*;
import com.automart.exception.BadRequestException;
import com.automart.exception.ResourceNotFoundException;
import com.automart.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class AdminServiceImpl implements AdminService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SubcategoryRepository subcategoryRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    // Constructor Dependency Injection
    public AdminServiceImpl(ProductRepository productRepository,
                            CategoryRepository categoryRepository,
                            SubcategoryRepository subcategoryRepository,
                            UserRepository userRepository,
                            OrderRepository orderRepository,
                            PasswordEncoder passwordEncoder) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.subcategoryRepository = subcategoryRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public ApiResponse addProduct(AdminProductRequest request) {
        log.info("Adding new product with name: {}", request.getName());

        // Validate business rule: Duplicate product check
        if (productRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("Duplicate product: A product with the name '" + request.getName() + "' already exists.");
        }

        // Validate Category
        Category category = resolveCategory(request.getCategory());

        // Optional Subcategory resolution
        Subcategory subcategory = null;
        if (request.getSubcategoryId() != null) {
            subcategory = subcategoryRepository.findById(request.getSubcategoryId())
                    .orElse(null);
        }

        String slug = generateSlug(request.getName());
        // Handle slug collision if any
        if (productRepository.findBySlug(slug).isPresent()) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        String vehicleType = StringUtils.hasText(request.getVehicleType()) ? request.getVehicleType() : "cars";
        String brand = StringUtils.hasText(request.getBrand()) ? request.getBrand() : "Generic";

        Product product = Product.builder()
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStockQuantity())
                .category(category)
                .subcategory(subcategory)
                .vehicleType(vehicleType)
                .brand(brand)
                .shortDescription(request.getShortDescription())
                .compatibility(request.getCompatibility())
                .featured(false)
                .trending(false)
                .newArrival(true)
                .images(new ArrayList<>())
                .build();

        if (StringUtils.hasText(request.getImageUrl())) {
            ProductImage mainImg = ProductImage.builder()
                    .imageUrl(request.getImageUrl())
                    .product(product)
                    .build();
            product.getImages().add(mainImg);
        }

        productRepository.save(product);
        log.info("Product created successfully with ID: {}", product.getProductId());

        return ApiResponse.builder()
                .success(true)
                .message("Product added successfully")
                .data(product.getProductId())
                .build();
    }

    @Override
    @Transactional
    public ApiResponse deleteProduct(Long id) {
        log.info("Deleting product with ID: {}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        productRepository.delete(product);
        log.info("Product with ID: {} deleted successfully", id);

        return ApiResponse.builder()
                .success(true)
                .message("Product deleted successfully")
                .build();
    }

    @Override
    @Transactional
    public ApiResponse updateUser(Long id, AdminUserUpdateRequest request) {
        log.info("Updating user details for userId: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (StringUtils.hasText(request.getEmail())) {
            if (userRepository.existsByEmailAndUserIdNot(request.getEmail(), id)) {
                throw new BadRequestException("Email address is already in use by another account.");
            }
            user.setEmail(request.getEmail());
        }

        if (StringUtils.hasText(request.getFullName())) {
            user.setFullName(request.getFullName());
        }

        if (StringUtils.hasText(request.getMobileNumber())) {
            if (userRepository.existsByMobileNumberAndUserIdNot(request.getMobileNumber(), id)) {
                throw new BadRequestException("Mobile number is already registered to another account.");
            }
            user.setMobileNumber(request.getMobileNumber());
        }

        if (StringUtils.hasText(request.getPassword())) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (StringUtils.hasText(request.getRole())) {
            try {
                Role newRole = Role.valueOf(request.getRole());
                user.setRole(newRole);
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid role specified: " + request.getRole());
            }
        }

        userRepository.save(user);
        log.info("User with ID: {} updated successfully", id);

        return ApiResponse.builder()
                .success(true)
                .message("User updated successfully")
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public DailyAnalyticsResponse getDailyAnalytics(LocalDate date) {
        LocalDate queryDate = (date != null) ? date : LocalDate.now();
        LocalDateTime startOfDay = queryDate.atStartOfDay();
        LocalDateTime endOfDay = queryDate.atTime(LocalTime.MAX);

        BigDecimal revenue = orderRepository.calculateRevenueBetween(startOfDay, endOfDay);
        Long totalOrders = orderRepository.countOrdersBetween(startOfDay, endOfDay);
        Long totalTransactions = orderRepository.countTransactionsBetween(startOfDay, endOfDay);

        return DailyAnalyticsResponse.builder()
                .date(queryDate)
                .dailyRevenue(revenue != null ? revenue : BigDecimal.ZERO)
                .totalOrders(totalOrders != null ? totalOrders : 0L)
                .totalTransactions(totalTransactions != null ? totalTransactions : 0L)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public MonthlyAnalyticsResponse getMonthlyAnalytics(Integer month, Integer year) {
        int currentYear = (year != null) ? year : LocalDate.now().getYear();
        int currentMonth = (month != null) ? month : LocalDate.now().getMonthValue();

        YearMonth ym = YearMonth.of(currentYear, currentMonth);
        LocalDateTime startOfMonth = ym.atDay(1).atStartOfDay();
        LocalDateTime endOfMonth = ym.atEndOfMonth().atTime(LocalTime.MAX);

        BigDecimal revenue = orderRepository.calculateRevenueBetween(startOfMonth, endOfMonth);
        Long totalOrders = orderRepository.countOrdersBetween(startOfMonth, endOfMonth);

        // Previous month for growth analysis
        YearMonth prevYm = ym.minusMonths(1);
        LocalDateTime startOfPrevMonth = prevYm.atDay(1).atStartOfDay();
        LocalDateTime endOfPrevMonth = prevYm.atEndOfMonth().atTime(LocalTime.MAX);

        BigDecimal prevRevenue = orderRepository.calculateRevenueBetween(startOfPrevMonth, endOfPrevMonth);
        String growthSummary = calculateGrowthPercentage(revenue, prevRevenue);

        return MonthlyAnalyticsResponse.builder()
                .month(currentMonth)
                .year(currentYear)
                .monthlyRevenue(revenue != null ? revenue : BigDecimal.ZERO)
                .monthlyOrders(totalOrders != null ? totalOrders : 0L)
                .growthSummary(growthSummary)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public YearlyAnalyticsResponse getYearlyAnalytics(Integer year) {
        int queryYear = (year != null) ? year : LocalDate.now().getYear();

        LocalDateTime startOfYear = LocalDate.of(queryYear, 1, 1).atStartOfDay();
        LocalDateTime endOfYear = LocalDate.of(queryYear, 12, 31).atTime(LocalTime.MAX);

        BigDecimal revenue = orderRepository.calculateRevenueBetween(startOfYear, endOfYear);
        Long totalOrders = orderRepository.countOrdersBetween(startOfYear, endOfYear);

        // Previous year for growth analysis
        LocalDateTime startOfPrevYear = LocalDate.of(queryYear - 1, 1, 1).atStartOfDay();
        LocalDateTime endOfPrevYear = LocalDate.of(queryYear - 1, 12, 31).atTime(LocalTime.MAX);

        BigDecimal prevRevenue = orderRepository.calculateRevenueBetween(startOfPrevYear, endOfPrevYear);
        String growthAnalysis = calculateGrowthPercentage(revenue, prevRevenue);

        return YearlyAnalyticsResponse.builder()
                .year(queryYear)
                .annualRevenue(revenue != null ? revenue : BigDecimal.ZERO)
                .annualOrders(totalOrders != null ? totalOrders : 0L)
                .growthAnalysis(growthAnalysis)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public OverallAnalyticsResponse getOverallAnalytics() {
        BigDecimal lifetimeRevenue = orderRepository.calculateLifetimeRevenue();
        Long lifetimeOrders = orderRepository.countLifetimeOrders();
        Long totalCustomers = orderRepository.countDistinctCustomers();

        String performance = "Business operating at healthy growth trajectory with " +
                (totalCustomers != null ? totalCustomers : 0) + " total customer accounts.";

        return OverallAnalyticsResponse.builder()
                .lifetimeRevenue(lifetimeRevenue != null ? lifetimeRevenue : BigDecimal.ZERO)
                .lifetimeOrders(lifetimeOrders != null ? lifetimeOrders : 0L)
                .totalCustomers(totalCustomers != null ? totalCustomers : 0L)
                .overallBusinessPerformance(performance)
                .build();
    }

    private Category resolveCategory(String categoryInput) {
        if (!StringUtils.hasText(categoryInput)) {
            throw new BadRequestException("Invalid category: Category field cannot be empty");
        }

        // Try numeric ID lookup
        try {
            Long categoryId = Long.parseLong(categoryInput);
            Optional<Category> byId = categoryRepository.findById(categoryId);
            if (byId.isPresent()) {
                return byId.get();
            }
        } catch (NumberFormatException ignored) {
        }

        // Try slug lookup
        Optional<Category> bySlug = categoryRepository.findBySlug(categoryInput.toLowerCase());
        if (bySlug.isPresent()) {
            return bySlug.get();
        }

        // Try name lookup
        Optional<Category> byName = categoryRepository.findByName(categoryInput);
        if (byName.isPresent()) {
            return byName.get();
        }

        throw new BadRequestException("Invalid category: Category '" + categoryInput + "' does not exist");
    }

    private String generateSlug(String input) {
        if (input == null) return "";
        return input.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
    }

    private String calculateGrowthPercentage(BigDecimal current, BigDecimal previous) {
        if (current == null) current = BigDecimal.ZERO;
        if (previous == null || previous.compareTo(BigDecimal.ZERO) == 0) {
            return current.compareTo(BigDecimal.ZERO) > 0 ? "+100.0% growth (new period)" : "0.0% growth";
        }

        BigDecimal diff = current.subtract(previous);
        BigDecimal growthRate = diff.divide(previous, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100"));
        double val = growthRate.doubleValue();
        return (val >= 0 ? "+" : "") + String.format("%.1f%% growth compared to previous period", val);
    }
}
