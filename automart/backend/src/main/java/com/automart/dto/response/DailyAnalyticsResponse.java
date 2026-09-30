package com.automart.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyAnalyticsResponse {
    private LocalDate date;
    private BigDecimal dailyRevenue;
    private Long totalOrders;
    private Long totalTransactions;
}
