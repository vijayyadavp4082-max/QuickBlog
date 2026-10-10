package com.quickblog.Server.service;

import com.google.genai.Client;
import com.google.genai.errors.ServerException;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final Client client;
    private final String model;

    public GeminiService(
            @Value("${gemini.api-key}") String apiKey,
            @Value("${gemini.model}") String model
    ) {

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("GEMINI_API_KEY is missing. " +
                            "Please configure the GEMINI_API_KEY environment variable.");
        }

        if (model == null || model.isBlank()) {
            throw new IllegalStateException("gemini.model is missing in application.properties.");
        }

        this.model = model;
        this.client = Client.builder().apiKey(apiKey).build();
    }

    public String generateBlogContent(String prompt) {

        if (prompt == null || prompt.isBlank()) {
            throw new IllegalArgumentException("Blog topic/prompt cannot be empty.");
        }

        String finalPrompt = """
                You are an expert blog writer.

                Create a high-quality blog article based on the topic below.

                Requirements:
                - Write a clear introduction.
                - Use useful headings.
                - Explain the topic in simple language.
                - Include practical examples where appropriate.
                - Use bullet points when useful.
                - Finish with a conclusion.
                - Return only the blog content.
                - Use Markdown formatting.

                Topic:
                %s
                """.formatted(prompt);

        int maxAttempts = 3;

        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                System.out.println("Calling Gemini model: " + model);

                GenerateContentResponse response = client.models.generateContent(
                                model, finalPrompt, null);

                String result = response.text();

                if (result == null || result.isBlank()) {
                    throw new IllegalStateException("Gemini returned an empty response.");
                }

                return result;

            } catch (ServerException e) {
                if (attempt == maxAttempts) {
                    throw new IllegalStateException(
                            "Gemini server is temporarily unavailable. " + "Please try again later.", e);
                }try {
                    long delay = 1000L * (1L << (attempt - 1));
                    System.out.println("Gemini server error. " + "Retrying in " + delay + " ms...");

                    Thread.sleep(delay);

                } catch (InterruptedException interruptedException) {
                    Thread.currentThread().interrupt();
                    throw new IllegalStateException("Gemini retry was interrupted.", interruptedException);
                }

            } catch (Exception e) {
                String errorMessage = e.getMessage() != null ? e.getMessage() : e.toString();
                String lowerCaseError = errorMessage.toLowerCase();

                if (lowerCaseError.contains("429") ||
                                lowerCaseError.contains("resource_exhausted") ||
                                lowerCaseError.contains("quota")
                ) {

                    throw new IllegalStateException(
                            "Gemini API quota has been exceeded. " +
                                    "Please wait and try again later, " +
                                    "or use a Gemini API key/model with available quota."
                    );
                }

                if (lowerCaseError.contains("401") ||
                                lowerCaseError.contains("403") ||
                                lowerCaseError.contains("api key") ||
                                lowerCaseError.contains("permission")
                ) {
                    throw new IllegalStateException(
                            "Gemini API authentication failed. " + "Please check your GEMINI_API_KEY.");
                }

                if (lowerCaseError.contains("model") &&
                                (lowerCaseError.contains("not found") || lowerCaseError.contains("invalid"))
                ) {
                    throw new IllegalStateException("Gemini model is invalid or unavailable: " + model);
                }

                throw new IllegalStateException("Gemini content generation failed: " + errorMessage, e);
            }
        }
        throw new IllegalStateException("Gemini content generation failed.");
    }
}