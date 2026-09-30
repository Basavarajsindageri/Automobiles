package com.automart.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AddressRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^\\d{10}$", message = "Mobile number must be 10 digits")
    private String mobileNumber;

    @NotBlank(message = "Address line is required")
    private String addressLine;

    private String landmark;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "PIN Code is required")
    @Pattern(regexp = "^\\d{6}$", message = "PIN Code must be 6 digits")
    private String pinCode;

    private String country = "India";
    private String addressType = "Home";
    private Boolean isDefault = false;
}
