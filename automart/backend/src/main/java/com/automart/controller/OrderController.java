package com.automart.controller;

import com.automart.dto.request.OrderRequest;
import com.automart.entity.Order;
import com.automart.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(Authentication authentication,
                                             @Valid @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.createOrder(authentication.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders(Authentication authentication) {
        return ResponseEntity.ok(orderService.getUserOrders(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(Authentication authentication, @PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(authentication.getName(), id));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Order> cancelOrder(Authentication authentication, @PathVariable Long id) {
        return ResponseEntity.ok(orderService.cancelOrder(authentication.getName(), id));
    }
}
