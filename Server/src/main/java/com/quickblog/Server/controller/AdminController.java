package com.quickblog.Server.controller;

import com.quickblog.Server.dto.AdminLoginRequest;
import com.quickblog.Server.dto.DashboardResponse;
import com.quickblog.Server.dto.IdRequest;
import com.quickblog.Server.dto.LoginResponse;
import com.quickblog.Server.service.AdminService;
import com.quickblog.Server.service.CommentService;
import com.quickblog.Server.service.BlogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final CommentService commentService;
    private final BlogService blogService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody AdminLoginRequest request) {
        return ResponseEntity.ok(adminService.login(request.getEmail(), request.getPassword()));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard() {
        DashboardResponse dashboard = adminService.dashboard();
        return ResponseEntity.ok(Map.of("success", true, "dashboardData", dashboard));
    }

    @GetMapping("/blogs")
    public ResponseEntity<?> getBlogs() {
        return ResponseEntity.ok(Map.of("success", true, "blogs", blogService.getAllBlogs()));
    }

    @GetMapping("/comments")
    public ResponseEntity<?> getComments() {
        return ResponseEntity.ok(Map.of("success", true, "comments", commentService.getAllComments()));
    }

    @PostMapping("/approve-comment")
    public ResponseEntity<?> approveComment(@Valid @RequestBody IdRequest request) {
        commentService.approve(request.getId());
        return ResponseEntity.ok(Map.of("success", true, "message", "Comment approved successfully"));
    }

    @PostMapping("/delete-comment")
    public ResponseEntity<?> deleteComment(@Valid @RequestBody IdRequest request) {
        commentService.delete(request.getId());
        return ResponseEntity.ok(Map.of("success", true, "message", "Comment deleted successfully"));
    }
}
