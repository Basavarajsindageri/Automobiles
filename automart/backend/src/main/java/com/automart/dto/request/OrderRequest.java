package com.automart.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderRequest {

    @NotNull(message = "Shipping Address ID is required")
    private Long addressId;

    @NotNull(message = "Payment method is required")
    private String paymentMethod;
}
