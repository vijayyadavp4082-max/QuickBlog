package com.quickblog.Server.service;

import com.quickblog.Server.dto.DashboardResponse;
import com.quickblog.Server.dto.LoginResponse;
import com.quickblog.Server.entity.Admin;
import com.quickblog.Server.repository.AdminRepository;
import com.quickblog.Server.repository.BlogRepository;
import com.quickblog.Server.repository.CommentRepository;
import com.quickblog.Server.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AuthenticationManager authenticationManager;
    private final AdminRepository adminRepository;
    private final BlogRepository blogRepository;
    private final CommentRepository commentRepository;
    private final JWTUtil jwtUtil;

    public LoginResponse login(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));

        Admin admin = (Admin) authentication.getPrincipal();
        String token = jwtUtil.generateToken(admin.getUsername());
        return new LoginResponse(true, "Login successful", token);
    }

    public DashboardResponse dashboard() {
        return new DashboardResponse(
                blogRepository.count(),
                commentRepository.count(),
                blogRepository.countByIsPublishedFalse(),
                blogRepository.findAllByOrderByCreatedAtDesc().stream().limit(5).toList()
        );
    }
}
