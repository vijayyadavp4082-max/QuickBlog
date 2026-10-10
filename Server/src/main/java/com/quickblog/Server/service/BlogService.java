//package com.quickblog.Server.service;
//
//import tools.jackson.databind.ObjectMapper;
//import com.quickblog.Server.dto.BlogRequest;
//import com.quickblog.Server.entity.Blog;
//import com.quickblog.Server.repository.BlogRepository;
//import com.quickblog.Server.repository.CommentRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.util.List;
//import java.util.Map;
//
//@Service
//@RequiredArgsConstructor
//public class BlogService {
//
//    private final BlogRepository blogRepository;
//    private final CommentRepository commentRepository;
//    private final ObjectMapper objectMapper;
//    private final CloudinaryService cloudinaryService;
//    private final GeminiService geminiService;
//
//    public List<Blog> getPublishedBlogs() {
//        return blogRepository.findByIsPublishedTrueOrderByCreatedAtDesc();
//    }
//
//    public Blog getPublishedBlog(Long id) {
//        return blogRepository.findById(id)
//                .filter(Blog::isPublished)
//                .orElseThrow(() -> new IllegalArgumentException("Blog not found"));
//    }
//
//    public List<Blog> getAllBlogs() {
//        return blogRepository.findAllByOrderByCreatedAtDesc();
//    }
//
//    public Blog addBlog(String blogJson, MultipartFile image) throws IOException {
//        BlogRequest request = objectMapper.readValue(blogJson, BlogRequest.class);
//
//        if (image == null || image.isEmpty()) {
//            throw new IllegalArgumentException("Blog image is required");
//        }
//
//        Map<String, Object> uploadResult = cloudinaryService.uploadImage(image);
//
//        String imageUrl = (String) uploadResult.get("secure_url");
//        String publicId = (String) uploadResult.get("public_id");
//
//        if (imageUrl == null || publicId == null) {
//            throw new IllegalStateException("Cloudinary upload failed");
//        }
//
//        Blog blog = new Blog();
//        blog.setTitle(request.getTitle());
//        blog.setSubTitle(request.getSubTitle());
//        blog.setDescription(request.getDescription());
//        blog.setCategory(request.getCategory());
//        blog.setAuthor(
//                request.getAuthor() == null || request.getAuthor().isBlank()
//                        ? "Admin"
//                        : request.getAuthor()
//        );
//        blog.setPublished(request.isPublished());
//        blog.setImage(imageUrl);
//        blog.setImagePublicId(publicId);
//
//        return blogRepository.save(blog);
//    }
//
//    public void deleteBlog(Long id) throws IOException {
//        Blog blog = blogRepository.findById(id)
//                .orElseThrow(() -> new IllegalArgumentException("Blog not found"));
//
//        commentRepository.deleteByBlogId(id);
//
//        if (blog.getImagePublicId() != null && !blog.getImagePublicId().isBlank()) {
//            cloudinaryService.deleteImage(blog.getImagePublicId());
//        }
//
//        blogRepository.delete(blog);
//    }
//
//    public Blog togglePublish(Long id) {
//        Blog blog = blogRepository.findById(id)
//                .orElseThrow(() -> new IllegalArgumentException("Blog not found"));
//
//        blog.setPublished(!blog.isPublished());
//        return blogRepository.save(blog);
//    }
//
//    public String generateContent(String prompt) {
//        if (prompt == null || prompt.isBlank()) {
//            throw new IllegalArgumentException("Blog topic is required");
//        }
//
//        return geminiService.generateBlogContent(prompt.trim());
//    }
//}


        package com.quickblog.Server.service;

import tools.jackson.databind.ObjectMapper;
import com.quickblog.Server.dto.BlogRequest;
import com.quickblog.Server.entity.Blog;
import com.quickblog.Server.repository.BlogRepository;
import com.quickblog.Server.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final BlogRepository blogRepository;
    private final CommentRepository commentRepository;
    private final ObjectMapper objectMapper;
    private final CloudinaryService cloudinaryService;
    private final GeminiService geminiService;

    public List<Blog> getPublishedBlogs() {
        return blogRepository.findByIsPublishedTrueOrderByCreatedAtDesc();
    }

    public Blog getPublishedBlog(Long id) {
        return blogRepository.findById(id).filter(Blog::isPublished)
                .orElseThrow(() -> new IllegalArgumentException("Blog not found"));
    }

    public List<Blog> getAllBlogs() {
        return blogRepository.findAllByOrderByCreatedAtDesc();
    }

    public Blog addBlog(String blogJson, MultipartFile image) throws IOException {

        BlogRequest request =
                objectMapper.readValue(blogJson, BlogRequest.class);

        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Blog image is required");
        }

        // Upload image to Cloudinary
        Map<String, Object> uploadResult = cloudinaryService.uploadImage(image);

        String imageUrl = (String) uploadResult.get("secure_url");
        String publicId = (String) uploadResult.get("public_id");

        if (imageUrl == null || imageUrl.isBlank()) {
            throw new IllegalStateException("Cloudinary did not return image URL");
        }

        if (publicId == null || publicId.isBlank()) {
            throw new IllegalStateException("Cloudinary did not return public ID");
        }

        Blog blog = new Blog();

        blog.setTitle(request.getTitle());
        blog.setSubTitle(request.getSubTitle());
        blog.setDescription(request.getDescription());
        blog.setCategory(request.getCategory());

        blog.setAuthor(request.getAuthor() == null ||
                        request.getAuthor().isBlank() ? "Admin" : request.getAuthor()
        );

        blog.setPublished(request.isPublished());
        blog.setImage(imageUrl);
        blog.setImagePublicId(publicId);

        return blogRepository.save(blog);
    }

    public void deleteBlog(Long id) throws IOException {

        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Blog not found with id: " + id));

        System.out.println("========================================");
        System.out.println("DELETE BLOG");
        System.out.println("Blog ID       : " + id);
        System.out.println("Blog Title    : " + blog.getTitle());
        System.out.println("Cloudinary ID : " + blog.getImagePublicId());
        System.out.println("========================================");

        try {
            commentRepository.deleteByBlogId(id);

            System.out.println("Blog comments deleted successfully.");

        } catch (Exception e) {

            System.err.println("Could not delete blog comments: " + e.getMessage());
        }

        if (blog.getImagePublicId() != null
                && !blog.getImagePublicId().isBlank()) {

            try {

                cloudinaryService.deleteImage(blog.getImagePublicId());

                System.out.println("Cloudinary image deleted successfully.");

            } catch (Exception e) {

                System.err.println("Cloudinary image deletion failed.");

                System.err.println("Public ID: " + blog.getImagePublicId());

                System.err.println("Reason: " + e.getMessage());
            }

        } else {

            System.out.println("No Cloudinary public ID found for this blog.");
        }

        blogRepository.delete(blog);

        // Make sure database operation is executed
        blogRepository.flush();

        System.out.println("Blog deleted successfully from database.");

        System.out.println("========================================");
    }

    // TOGGLE PUBLISH

    public Blog togglePublish(Long id) {

        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Blog not found"));

        blog.setPublished(!blog.isPublished());

        return blogRepository.save(blog);
    }


    // GENERATE BLOG CONTENT USING GEMINI
    public String generateContent(String prompt) {

        if (prompt == null || prompt.isBlank()) {
            throw new IllegalArgumentException(
                    "Blog topic is required"
            );
        }

        return geminiService.generateBlogContent(prompt.trim());
    }
}
