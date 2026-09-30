package com.automart.repository;

import com.automart.entity.JwtToken;
import com.automart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JwtTokenRepository extends JpaRepository<JwtToken, Long> {

    Optional<JwtToken> findByToken(String token);

    List<JwtToken> findByUser(User user);

    Optional<JwtToken> findByUserUserId(Long userId);

    @Modifying
    @Query("DELETE FROM JwtToken t WHERE t.user = :user")
    void deleteByUser(@Param("user") User user);

    @Modifying
    @Query("DELETE FROM JwtToken t WHERE t.user.userId = :userId")
    void deleteByUserUserId(@Param("userId") Long userId);

    @Modifying
    @Query("DELETE FROM JwtToken t WHERE t.token = :token")
    void deleteByToken(@Param("token") String token);
}
