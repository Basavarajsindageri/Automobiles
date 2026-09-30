package com.automart.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubcategoryRequest {
    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotBlank(message = "Subcategory name is required")
    private String name;

    private String description;

    private String imageUrl;
}
