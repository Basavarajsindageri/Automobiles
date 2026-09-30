package com.automart.service;

import com.automart.dto.request.OrderRequest;
import com.automart.entity.*;
import com.automart.exception.BadRequestException;
import com.automart.exception.ResourceNotFoundException;
import com.automart.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private CartRepository cartRepository;

    public Order createOrder(String userEmail, OrderRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cannot place order with an empty cart");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        Order order = Order.builder()
                .orderNumber("AM-" + (100000 + new Random().nextInt(900000)))
                .user(user)
                .shippingAddress(address)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus("Cash on Delivery".equalsIgnoreCase(request.getPaymentMethod()) ? "Pending (COD)" : "Paid")
                .orderStatus("Placed")
                .estimatedDelivery(LocalDateTime.now().plusDays(4))
                .build();

        for (CartItem cartItem : cart.getItems()) {
            BigDecimal itemTotal = cartItem.getProduct().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            subtotal = subtotal.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(cartItem.getProduct())
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getProduct().getPrice())
                    .colour(cartItem.getColour())
                    .compatibility(cartItem.getCompatibility())
                    .build();

            orderItems.add(orderItem);
        }

        BigDecimal deliveryCharge = subtotal.compareTo(BigDecimal.valueOf(999)) > 0 ? BigDecimal.ZERO : BigDecimal.valueOf(99);
        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.05)); // 5% GST
        BigDecimal grandTotal = subtotal.add(deliveryCharge).add(tax);

        order.setSubtotal(subtotal);
        order.setDiscount(BigDecimal.ZERO);
        order.setDeliveryCharge(deliveryCharge);
        order.setTax(tax);
        order.setGrandTotal(grandTotal);
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // Clear cart after order creation
        cart.getItems().clear();
        cartRepository.save(cart);

        return savedOrder;
    }

    public List<Order> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Order getOrderById(String userEmail, Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
    }

    public Order cancelOrder(String userEmail, Long orderId) {
        Order order = getOrderById(userEmail, orderId);
        if ("Delivered".equalsIgnoreCase(order.getOrderStatus())) {
            throw new BadRequestException("Delivered orders cannot be cancelled");
        }
        order.setOrderStatus("Cancelled");
        return orderRepository.save(order);
    }
}
