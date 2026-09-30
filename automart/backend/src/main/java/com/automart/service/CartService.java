package com.automart.service;

import com.automart.dto.request.CartItemRequest;
import com.automart.entity.*;
import com.automart.exception.ResourceNotFoundException;
import com.automart.repository.CartRepository;
import com.automart.repository.ProductRepository;
import com.automart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public Cart getOrCreateCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
    }

    public Cart addToCart(String userEmail, CartItemRequest request) {
        Cart cart = getOrCreateCart(userEmail);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getProductId().equals(product.getProductId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .colour(request.getColour())
                    .compatibility(request.getCompatibility())
                    .build();
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    public Cart removeItem(String userEmail, Long itemId) {
        Cart cart = getOrCreateCart(userEmail);
        cart.getItems().removeIf(item -> item.getItemId().equals(itemId));
        return cartRepository.save(cart);
    }

    public Cart updateQuantity(String userEmail, Long itemId, Integer quantity) {
        Cart cart = getOrCreateCart(userEmail);
        cart.getItems().stream()
                .filter(item -> item.getItemId().equals(itemId))
                .findFirst()
                .ifPresent(item -> {
                    if (quantity <= 0) {
                        cart.getItems().remove(item);
                    } else {
                        item.setQuantity(quantity);
                    }
                });
        return cartRepository.save(cart);
    }

    public void clearCart(String userEmail) {
        Cart cart = getOrCreateCart(userEmail);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
