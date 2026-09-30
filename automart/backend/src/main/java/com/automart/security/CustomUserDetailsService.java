package com.automart.security;

import com.automart.entity.User;
import com.automart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String emailOrMobile) throws UsernameNotFoundException {
        User user = userRepository.findByEmailOrMobileNumber(emailOrMobile, emailOrMobile)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email/mobile: " + emailOrMobile));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name()))
        );
    }
}
