package com.automart.service;

import com.automart.entity.*;
import com.automart.exception.ResourceNotFoundException;
import com.automart.repository.ProductRepository;
import com.automart.repository.UserRepository;
import com.automart.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public Wishlist getOrCreateWishlist(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return wishlistRepository.findByUser(user)
                .orElseGet(() -> wishlistRepository.save(Wishlist.builder().user(user).build()));
    }

    public Wishlist toggleWishlistItem(String userEmail, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(userEmail);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Optional<WishlistItem> existing = wishlist.getItems().stream()
                .filter(item -> item.getProduct().getProductId().equals(productId))
                .findFirst();

        if (existing.isPresent()) {
            wishlist.getItems().remove(existing.get());
        } else {
            WishlistItem newItem = WishlistItem.builder()
                    .wishlist(wishlist)
                    .product(product)
                    .build();
            wishlist.getItems().add(newItem);
        }

        return wishlistRepository.save(wishlist);
    }

    public Wishlist removeItem(String userEmail, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(userEmail);
        wishlist.getItems().removeIf(item -> item.getProduct().getProductId().equals(productId));
        return wishlistRepository.save(wishlist);
    }
}
