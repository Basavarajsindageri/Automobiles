package com.automart.dto.response;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyAnalyticsResponse {
    private Integer month;
    private Integer year;
    private BigDecimal monthlyRevenue;
    private Long monthlyOrders;
    private String growthSummary;
}
