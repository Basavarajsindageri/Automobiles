package com.automart.controller;

import com.automart.dto.request.CartItemRequest;
import com.automart.entity.Cart;
import com.automart.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<Cart> getCart(Authentication authentication) {
        return ResponseEntity.ok(cartService.getOrCreateCart(authentication.getName()));
    }

    @PostMapping("/items")
    public ResponseEntity<Cart> addToCart(Authentication authentication,
                                         @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addToCart(authentication.getName(), request));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<Cart> updateQuantity(Authentication authentication,
                                               @PathVariable Long id,
                                               @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.updateQuantity(authentication.getName(), id, quantity));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Cart> removeItem(Authentication authentication, @PathVariable Long id) {
        return ResponseEntity.ok(cartService.removeItem(authentication.getName(), id));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return ResponseEntity.ok().build();
    }
}
