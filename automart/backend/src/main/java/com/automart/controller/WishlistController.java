package com.automart.controller;

import com.automart.entity.Wishlist;
import com.automart.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<Wishlist> getWishlist(Authentication authentication) {
        return ResponseEntity.ok(wishlistService.getOrCreateWishlist(authentication.getName()));
    }

    @PostMapping("/items")
    public ResponseEntity<Wishlist> toggleItem(Authentication authentication,
                                               @RequestBody Map<String, Long> payload) {
        Long productId = payload.get("productId");
        return ResponseEntity.ok(wishlistService.toggleWishlistItem(authentication.getName(), productId));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Wishlist> removeItem(Authentication authentication, @PathVariable Long id) {
        return ResponseEntity.ok(wishlistService.removeItem(authentication.getName(), id));
    }
}
