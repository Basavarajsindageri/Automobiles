package com.automart.repository;

import com.automart.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlug(String slug);

    boolean existsByNameIgnoreCase(String name);
    boolean existsByName(String name);

    Page<Product> findByVehicleType(String vehicleType, Pageable pageable);

    List<Product> findByFeaturedTrue();
    List<Product> findByTrendingTrue();
    List<Product> findByNewArrivalTrue();

    @Query("SELECT p FROM Product p WHERE " +
           "(:category IS NULL OR :category = '' OR LOWER(p.category.slug) = LOWER(:category) OR LOWER(p.category.name) = LOWER(:category) OR LOWER(p.vehicleType) = LOWER(:category)) AND " +
           "(:subcategory IS NULL OR :subcategory = '' OR LOWER(p.subcategory.slug) = LOWER(:subcategory) OR LOWER(p.subcategory.name) = LOWER(:subcategory)) AND " +
           "(:query IS NULL OR :query = '' OR " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.category.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.shortDescription) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.compatibility) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Product> filterProducts(@Param("category") String category, 
                                 @Param("subcategory") String subcategory, 
                                 @Param("query") String query, 
                                 Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.brand) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.category.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.shortDescription) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.compatibility) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Product> searchProducts(@Param("query") String query, Pageable pageable);
}
