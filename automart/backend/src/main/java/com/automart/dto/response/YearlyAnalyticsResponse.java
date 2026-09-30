package com.automart.dto.response;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class YearlyAnalyticsResponse {
    private Integer year;
    private BigDecimal annualRevenue;
    private Long annualOrders;
    private String growthAnalysis;
}
