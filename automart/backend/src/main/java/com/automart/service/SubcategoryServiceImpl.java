package com.automart.service;

import com.automart.dto.request.SubcategoryRequest;
import com.automart.entity.Category;
import com.automart.entity.Subcategory;
import com.automart.exception.BadRequestException;
import com.automart.exception.ResourceNotFoundException;
import com.automart.repository.CategoryRepository;
import com.automart.repository.SubcategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubcategoryServiceImpl implements SubcategoryService {

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Subcategory> getAllSubcategories(Long categoryId, String categorySlug) {
        if (categoryId != null) {
            return subcategoryRepository.findByCategoryCategoryId(categoryId);
        }
        if (categorySlug != null && !categorySlug.trim().isEmpty()) {
            return subcategoryRepository.findByCategorySlug(categorySlug.trim());
        }
        return subcategoryRepository.findAll();
    }

    @Override
    public Subcategory getSubcategoryById(Long id) {
        return subcategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subcategory not found with id: " + id));
    }

    @Override
    public Subcategory getSubcategoryBySlug(String slug) {
        return subcategoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Subcategory not found with slug: " + slug));
    }

    @Override
    public Subcategory createSubcategory(SubcategoryRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        String slug = generateSlug(request.getName());
        if (subcategoryRepository.findBySlug(slug).isPresent()) {
            throw new BadRequestException("Subcategory already exists with name: " + request.getName());
        }

        Subcategory subcategory = Subcategory.builder()
                .category(category)
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .build();

        return subcategoryRepository.save(subcategory);
    }

    @Override
    public Subcategory updateSubcategory(Long id, SubcategoryRequest request) {
        Subcategory subcategory = getSubcategoryById(id);
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
            subcategory.setCategory(category);
        }

        subcategory.setName(request.getName());
        subcategory.setSlug(generateSlug(request.getName()));
        subcategory.setDescription(request.getDescription());
        if (request.getImageUrl() != null && !request.getImageUrl().trim().isEmpty()) {
            subcategory.setImageUrl(request.getImageUrl());
        }
        return subcategoryRepository.save(subcategory);
    }

    @Override
    public void deleteSubcategory(Long id) {
        Subcategory subcategory = getSubcategoryById(id);
        subcategoryRepository.delete(subcategory);
    }

    private String generateSlug(String name) {
        return name.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
    }
}
