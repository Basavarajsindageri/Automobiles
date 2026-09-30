package com.automart.dto.response;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OverallAnalyticsResponse {
    private BigDecimal lifetimeRevenue;
    private Long lifetimeOrders;
    private Long totalCustomers;
    private String overallBusinessPerformance;
}
