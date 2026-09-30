package com.automart.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock must be greater than or equal to 0")
    private Integer stockQuantity;

    @NotBlank(message = "Category is required")
    private String category; // Category name, slug, or ID string

    private String imageUrl;

    private String vehicleType; // e.g. "cars", "scooters", "motorcycles"
    private String brand;
    private String shortDescription;
    private String compatibility;
    private Long subcategoryId;
}
