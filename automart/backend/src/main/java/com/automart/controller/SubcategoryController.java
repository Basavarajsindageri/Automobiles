package com.automart.controller;

import com.automart.dto.request.SubcategoryRequest;
import com.automart.entity.Subcategory;
import com.automart.service.SubcategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/subcategories")
public class SubcategoryController {

    @Autowired
    private SubcategoryService subcategoryService;

    @GetMapping
    public ResponseEntity<List<Subcategory>> getAllSubcategories(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String categorySlug) {
        return ResponseEntity.ok(subcategoryService.getAllSubcategories(categoryId, categorySlug));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subcategory> getSubcategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(subcategoryService.getSubcategoryById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<Subcategory> getSubcategoryBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(subcategoryService.getSubcategoryBySlug(slug));
    }

    @PostMapping
    public ResponseEntity<Subcategory> createSubcategory(@Valid @RequestBody SubcategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subcategoryService.createSubcategory(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subcategory> updateSubcategory(@PathVariable Long id, @Valid @RequestBody SubcategoryRequest request) {
        return ResponseEntity.ok(subcategoryService.updateSubcategory(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubcategory(@PathVariable Long id) {
        subcategoryService.deleteSubcategory(id);
        return ResponseEntity.noContent().build();
    }
}
