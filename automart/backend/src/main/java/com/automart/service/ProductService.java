package com.automart.service;

import com.automart.dto.request.ProductRequest;
import com.automart.entity.Category;
import com.automart.entity.Product;
import com.automart.entity.ProductImage;
import com.automart.entity.Subcategory;
import com.automart.exception.BadRequestException;
import com.automart.exception.ResourceNotFoundException;
import com.automart.repository.CategoryRepository;
import com.automart.repository.ProductRepository;
import com.automart.repository.SubcategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    public Page<Product> getAllProducts(int page, int size, String sortBy, String sortDir, String category, String subcategory, String query) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return productRepository.filterProducts(category, subcategory, query, pageable);
    }

    public Product getProductBySlug(String slug) {
        return productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findByFeaturedTrue();
    }

    public List<Product> getTrendingProducts() {
        return productRepository.findByTrendingTrue();
    }

    public List<Product> getNewArrivals() {
        return productRepository.findByNewArrivalTrue();
    }

    public Product createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Subcategory subcategory = null;
        if (request.getSubcategoryId() != null) {
            subcategory = subcategoryRepository.findById(request.getSubcategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subcategory not found with id: " + request.getSubcategoryId()));
        }

        String slug = generateSlug(request.getName());
        if (productRepository.findBySlug(slug).isPresent()) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        Product product = Product.builder()
                .category(category)
                .subcategory(subcategory)
                .name(request.getName())
                .slug(slug)
                .vehicleType(category.getSlug())
                .brand(request.getBrand())
                .shortDescription(request.getShortDescription())
                .description(request.getDescription())
                .price(request.getPrice())
                .originalPrice(request.getOriginalPrice())
                .discountPercentage(request.getDiscountPercentage())
                .stock(request.getStock() != null ? request.getStock() : 50)
                .rating(4.5)
                .reviewCount(12)
                .sku(request.getSku() != null ? request.getSku() : "SKU-" + System.currentTimeMillis())
                .compatibility(request.getCompatibility())
                .featured(request.getFeatured() != null ? request.getFeatured() : false)
                .trending(request.getTrending() != null ? request.getTrending() : false)
                .newArrival(request.getNewArrival() != null ? request.getNewArrival() : false)
                .images(new ArrayList<>())
                .build();

        if (request.getMainImageUrl() != null && !request.getMainImageUrl().trim().isEmpty()) {
            product.getImages().add(ProductImage.builder().product(product).imageUrl(request.getMainImageUrl()).build());
        }

        if (request.getImageUrls() != null) {
            for (String url : request.getImageUrls()) {
                if (url != null && !url.trim().isEmpty()) {
                    product.getImages().add(ProductImage.builder().product(product).imageUrl(url).build());
                }
            }
        }

        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductRequest request) {
        Product product = getProductById(id);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
            product.setCategory(category);
            product.setVehicleType(category.getSlug());
        }

        if (request.getSubcategoryId() != null) {
            Subcategory subcategory = subcategoryRepository.findById(request.getSubcategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subcategory not found with id: " + request.getSubcategoryId()));
            product.setSubcategory(subcategory);
        } else {
            product.setSubcategory(null);
        }

        product.setName(request.getName());
        product.setBrand(request.getBrand());
        product.setShortDescription(request.getShortDescription());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        if (request.getOriginalPrice() != null) product.setOriginalPrice(request.getOriginalPrice());
        if (request.getDiscountPercentage() != null) product.setDiscountPercentage(request.getDiscountPercentage());
        if (request.getStock() != null) product.setStock(request.getStock());
        if (request.getCompatibility() != null) product.setCompatibility(request.getCompatibility());
        if (request.getFeatured() != null) product.setFeatured(request.getFeatured());
        if (request.getTrending() != null) product.setTrending(request.getTrending());
        if (request.getNewArrival() != null) product.setNewArrival(request.getNewArrival());

        if (request.getMainImageUrl() != null && !request.getMainImageUrl().trim().isEmpty()) {
            product.getImages().clear();
            product.getImages().add(ProductImage.builder().product(product).imageUrl(request.getMainImageUrl()).build());
            if (request.getImageUrls() != null) {
                for (String url : request.getImageUrls()) {
                    if (url != null && !url.trim().isEmpty() && !url.equals(request.getMainImageUrl())) {
                        product.getImages().add(ProductImage.builder().product(product).imageUrl(url).build());
                    }
                }
            }
        }

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    private String generateSlug(String name) {
        return name.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
    }
}
