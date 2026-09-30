package com.automart.service;

import com.automart.dto.request.SubcategoryRequest;
import com.automart.entity.Subcategory;

import java.util.List;

public interface SubcategoryService {
    List<Subcategory> getAllSubcategories(Long categoryId, String categorySlug);
    Subcategory getSubcategoryById(Long id);
    Subcategory getSubcategoryBySlug(String slug);
    Subcategory createSubcategory(SubcategoryRequest request);
    Subcategory updateSubcategory(Long id, SubcategoryRequest request);
    void deleteSubcategory(Long id);
}
