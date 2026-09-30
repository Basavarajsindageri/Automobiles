package com.automart.repository;

import com.automart.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {

    @Query("SELECT o FROM Otp o WHERE o.emailOrMobile = :emailOrMobile AND o.otpCode = :otpCode AND o.isUsed = false ORDER BY o.expiryTime DESC")
    Optional<Otp> findValidOtp(@Param("emailOrMobile") String emailOrMobile, @Param("otpCode") String otpCode);

    default Optional<Otp> findTopByEmailOrMobileAndOtpCodeAndIsUsedFalseOrderByExpiryTimeDesc(String emailOrMobile, String otpCode) {
        return findValidOtp(emailOrMobile, otpCode);
    }
}
