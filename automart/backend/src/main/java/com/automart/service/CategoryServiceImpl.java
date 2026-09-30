package com.automart.service;

import com.automart.dto.request.CategoryRequest;
import com.automart.entity.Category;
import com.automart.exception.BadRequestException;
import com.automart.exception.ResourceNotFoundException;
import com.automart.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    @Override
    public Category getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + slug));
    }

    @Override
    public Category createCategory(CategoryRequest request) {
        String slug = generateSlug(request.getName());
        if (categoryRepository.findBySlug(slug).isPresent()) {
            throw new BadRequestException("Category already exists with name: " + request.getName());
        }

        Category category = Category.builder()
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .build();

        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Long id, CategoryRequest request) {
        Category category = getCategoryById(id);
        category.setName(request.getName());
        category.setSlug(generateSlug(request.getName()));
        category.setDescription(request.getDescription());
        if (request.getImageUrl() != null && !request.getImageUrl().trim().isEmpty()) {
            category.setImageUrl(request.getImageUrl());
        }
        return categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }

    private String generateSlug(String name) {
        return name.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
    }
}
