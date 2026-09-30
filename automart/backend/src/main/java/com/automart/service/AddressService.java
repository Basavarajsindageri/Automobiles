package com.automart.service;

import com.automart.dto.request.AddressRequest;
import com.automart.entity.Address;
import com.automart.entity.User;
import com.automart.exception.ResourceNotFoundException;
import com.automart.repository.AddressRepository;
import com.automart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Address> getUserAddresses(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return addressRepository.findByUser(user);
    }

    public Address createAddress(String userEmail, AddressRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            List<Address> existing = addressRepository.findByUser(user);
            existing.forEach(a -> {
                a.setIsDefault(false);
                addressRepository.save(a);
            });
        }

        Address address = Address.builder()
                .user(user)
                .name(request.getName())
                .mobileNumber(request.getMobileNumber())
                .addressLine(request.getAddressLine())
                .landmark(request.getLandmark())
                .city(request.getCity())
                .state(request.getState())
                .pinCode(request.getPinCode())
                .country(request.getCountry() != null ? request.getCountry() : "India")
                .addressType(request.getAddressType() != null ? request.getAddressType() : "Home")
                .isDefault(request.getIsDefault() != null ? request.getIsDefault() : false)
                .build();

        return addressRepository.save(address);
    }

    public Address updateAddress(String userEmail, Long addressId, AddressRequest request) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        address.setName(request.getName());
        address.setMobileNumber(request.getMobileNumber());
        address.setAddressLine(request.getAddressLine());
        address.setLandmark(request.getLandmark());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPinCode(request.getPinCode());
        address.setAddressType(request.getAddressType());
        address.setIsDefault(request.getIsDefault());

        return addressRepository.save(address);
    }

    public void deleteAddress(String userEmail, Long addressId) {
        addressRepository.deleteById(addressId);
    }
}
