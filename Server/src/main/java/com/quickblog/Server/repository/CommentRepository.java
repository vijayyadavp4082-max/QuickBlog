package com.quickblog.Server.repository;

import com.quickblog.Server.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByBlogIdAndIsApprovedTrueOrderByCreatedAtDesc(Long blogId);
    List<Comment> findAllByOrderByCreatedAtDesc();
    List<Comment> findByIsApprovedFalseOrderByCreatedAtDesc();
    List<Comment> findByIsApprovedTrueOrderByCreatedAtDesc();
    long countByIsApprovedTrue();
    long countByIsApprovedFalse();
    void deleteByBlogId(Long blogId);
}
