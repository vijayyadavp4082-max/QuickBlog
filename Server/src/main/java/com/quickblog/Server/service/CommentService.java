package com.quickblog.Server.service;

import com.quickblog.Server.entity.Blog;
import com.quickblog.Server.entity.Comment;
import com.quickblog.Server.repository.BlogRepository;
import com.quickblog.Server.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final BlogRepository blogRepository;

    public Comment addComment(Long blogId, String name, String content) {
        Blog blog = blogRepository.findById(blogId)
                .filter(Blog::isPublished)
                .orElseThrow(() -> new IllegalArgumentException("Published blog not found"));

        Comment comment = new Comment();
        comment.setBlog(blog);
        comment.setName(name.trim());
        comment.setContent(content.trim());
        comment.setApproved(false);
        return commentRepository.save(comment);
    }

    public List<Comment> getApprovedComments(Long blogId) {
        return commentRepository.findByBlogIdAndIsApprovedTrueOrderByCreatedAtDesc(blogId);
    }

    public List<Comment> getAllComments() {
        return commentRepository.findAllByOrderByCreatedAtDesc();
    }

    public void approve(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        comment.setApproved(true);
        commentRepository.save(comment);
    }

    public void delete(Long id) {
        if (!commentRepository.existsById(id)) {
            throw new IllegalArgumentException("Comment not found");
        }
        commentRepository.deleteById(id);
    }
}
