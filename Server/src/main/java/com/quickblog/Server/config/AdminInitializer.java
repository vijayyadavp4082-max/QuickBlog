package com.quickblog.Server.config;

import com.quickblog.Server.entity.Admin;
import com.quickblog.Server.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminInitializer {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner createDefaultAdmin() {
        return args -> {
            String email = "admin@quickblog.com";
            if (adminRepository.findByEmail(email).isEmpty()) {
                Admin admin = new Admin();
                admin.setEmail(email);
                admin.setPassword(passwordEncoder.encode("admin123"));
                adminRepository.save(admin);
                System.out.println("QuickBlog admin created: " + email);
            }
        };
    }
}
