package com.automart.service;

import com.automart.dto.request.CategoryRequest;
import com.automart.entity.Category;

import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories();
    Category getCategoryById(Long id);
    Category getCategoryBySlug(String slug);
    Category createCategory(CategoryRequest request);
    Category updateCategory(Long id, CategoryRequest request);
    void deleteCategory(Long id);
}
