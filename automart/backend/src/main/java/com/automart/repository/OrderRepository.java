package com.automart.repository;

import com.automart.entity.Order;
import com.automart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findByUserUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Order> findByOrderNumber(String orderNumber);

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(o.grandTotal), 0) FROM Order o WHERE o.createdAt >= :start AND o.createdAt <= :end")
    java.math.BigDecimal calculateRevenueBetween(@org.springframework.data.repository.query.Param("start") java.time.LocalDateTime start, @org.springframework.data.repository.query.Param("end") java.time.LocalDateTime end);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :start AND o.createdAt <= :end")
    Long countOrdersBetween(@org.springframework.data.repository.query.Param("start") java.time.LocalDateTime start, @org.springframework.data.repository.query.Param("end") java.time.LocalDateTime end);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :start AND o.createdAt <= :end AND (o.paymentStatus = 'PAID' OR o.paymentStatus = 'COMPLETED' OR o.orderStatus = 'Delivered')")
    Long countTransactionsBetween(@org.springframework.data.repository.query.Param("start") java.time.LocalDateTime start, @org.springframework.data.repository.query.Param("end") java.time.LocalDateTime end);

    @org.springframework.data.jpa.repository.Query("SELECT COALESCE(SUM(o.grandTotal), 0) FROM Order o")
    java.math.BigDecimal calculateLifetimeRevenue();

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(o) FROM Order o")
    Long countLifetimeOrders();

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(DISTINCT o.user.userId) FROM Order o")
    Long countDistinctCustomers();
}
