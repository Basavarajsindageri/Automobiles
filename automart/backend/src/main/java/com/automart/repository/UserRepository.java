package com.automart.repository;

import com.automart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByMobileNumber(String mobileNumber);
    Optional<User> findByEmailOrMobileNumber(String email, String mobileNumber);
    Boolean existsByEmail(String email);
    Boolean existsByMobileNumber(String mobileNumber);
    Boolean existsByEmailAndUserIdNot(String email, Long userId);
    Boolean existsByMobileNumberAndUserIdNot(String mobileNumber, Long userId);
    Optional<User> findByFullName(String fullName);
}
