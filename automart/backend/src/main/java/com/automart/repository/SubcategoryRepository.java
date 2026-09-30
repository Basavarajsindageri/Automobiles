package com.automart.repository;

import com.automart.entity.Subcategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubcategoryRepository extends JpaRepository<Subcategory, Long> {
    Optional<Subcategory> findBySlug(String slug);
    Optional<Subcategory> findByName(String name);
    List<Subcategory> findByCategoryCategoryId(Long categoryId);
    List<Subcategory> findByCategorySlug(String categorySlug);
}
