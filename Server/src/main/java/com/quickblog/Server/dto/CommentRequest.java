package com.quickblog.Server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequest {
    @NotNull(message = "Blog ID is required")
    private Long blogId;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Comment is required")
    private String content;
}
