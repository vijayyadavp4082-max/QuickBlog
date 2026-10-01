package com.quickblog.Server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private long blogs;
    private long comments;
    private long drafts;
    private List<?> recentBlogs;
}
