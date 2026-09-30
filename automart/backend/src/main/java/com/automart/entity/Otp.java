package com.automart.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "otps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Otp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long otpId;

    @Column(nullable = false)
    private String emailOrMobile;

    @Column(nullable = false, length = 6)
    private String otpCode;

    private LocalDateTime expiryTime;

    @Builder.Default
    private Boolean isUsed = false;
}
