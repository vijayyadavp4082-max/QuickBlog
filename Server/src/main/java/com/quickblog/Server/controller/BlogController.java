package com.quickblog.Server.controller;

import com.quickblog.Server.dto.CommentRequest;
import com.quickblog.Server.dto.IdRequest;
import com.quickblog.Server.service.BlogService;
import com.quickblog.Server.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;
    private final CommentService commentService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllBlogs() {
        return ResponseEntity.ok(Map.of("success", true, "blogs", blogService.getPublishedBlogs()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBlog(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("success", true, "blog", blogService.getPublishedBlog(id)));
    }

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addBlog(
            @RequestPart("blog") String blogJson,
            @RequestPart("image") MultipartFile image) throws Exception {
        blogService.addBlog(blogJson, image);
        return ResponseEntity.ok(Map.of("success", true, "message", "Blog added successfully"));
    }

    @PostMapping("/delete")
    public ResponseEntity<?> deleteBlog(@Valid @RequestBody IdRequest request) throws Exception {
        blogService.deleteBlog(request.getId());
        return ResponseEntity.ok(Map.of("success", true, "message", "Blog deleted successfully"));
    }

    @PostMapping("/toggle-publish")
    public ResponseEntity<?> togglePublish(@Valid @RequestBody IdRequest request) {
        var blog = blogService.togglePublish(request.getId());
        String message = blog.isPublished() ? "Blog published successfully" : "Blog unpublished successfully";
        return ResponseEntity.ok(Map.of("success", true, "message", message));
    }

    @PostMapping("/add-comment")
    public ResponseEntity<?> addComment(@Valid @RequestBody CommentRequest request) {
        commentService.addComment(request.getBlogId(), request.getName(), request.getContent());
        return ResponseEntity.ok(Map.of("success", true, "message", "Comment submitted for approval"));
    }

    @PostMapping("/comments")
    public ResponseEntity<?> getComments(@RequestBody Map<String, Object> body) {
        Object rawId = body.get("blogId");
        if (rawId == null) {
            throw new IllegalArgumentException("Blog ID is required");
        }
        Long blogId = Long.valueOf(rawId.toString());
        return ResponseEntity.ok(Map.of("success", true, "comments", commentService.getApprovedComments(blogId)));
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generate(@RequestBody Map<String, String> body) {
        String prompt = body.get("prompt");
        return ResponseEntity.ok(Map.of(
                "success", true,
                "content", blogService.generateContent(prompt)
        ));
    }
}
