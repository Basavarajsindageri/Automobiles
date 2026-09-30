package com.automart.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductRequest {
    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private Long subcategoryId;

    @NotBlank(message = "Product name is required")
    private String name;

    @NotBlank(message = "Brand is required")
    private String brand;

    private String shortDescription;
    private String description;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be positive")
    private BigDecimal price;

    private BigDecimal originalPrice;
    private Integer discountPercentage;
    private Integer stock;
    private String sku;
    private String compatibility;
    private Boolean featured;
    private Boolean trending;
    private Boolean newArrival;

    private String mainImageUrl;
    private List<String> imageUrls;
}
