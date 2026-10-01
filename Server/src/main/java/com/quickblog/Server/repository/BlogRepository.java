package com.quickblog.Server.repository;

import com.quickblog.Server.entity.Blog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlogRepository extends JpaRepository<Blog, Long> {
    List<Blog> findByIsPublishedTrueOrderByCreatedAtDesc();
    List<Blog> findAllByOrderByCreatedAtDesc();
    long countByIsPublishedTrue();
    long countByIsPublishedFalse();
}
