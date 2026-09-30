package com.automart.controller;

import com.automart.dto.request.AddressRequest;
import com.automart.entity.Address;
import com.automart.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users/addresses")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @GetMapping
    public ResponseEntity<List<Address>> getAddresses(Authentication authentication) {
        return ResponseEntity.ok(addressService.getUserAddresses(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<Address> createAddress(Authentication authentication,
                                                 @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(addressService.createAddress(authentication.getName(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(Authentication authentication,
                                                 @PathVariable Long id,
                                                 @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.ok(addressService.updateAddress(authentication.getName(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(Authentication authentication, @PathVariable Long id) {
        addressService.deleteAddress(authentication.getName(), id);
        return ResponseEntity.ok().build();
    }
}
