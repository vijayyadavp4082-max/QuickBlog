# QuickBlog Spring Boot Backend

## Stack
- Java 21 target
- Spring Boot 4.1.1
- Spring Web MVC
- Spring Data JPA / Hibernate
- MySQL
- Spring Security
- JWT / JJWT
- Validation
- Lombok
- Cloudinary
- Google GenAI Java SDK 1.67.0

## Database

Create the database:

```sql
CREATE DATABASE quickblog;
```

Update `src/main/resources/application.properties` if your MySQL username/password is different.

## Required environment variables

```text
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Optional:

```text
GEMINI_MODEL=gemini-3.8-flash
```

## Run

Windows:

```bat
mvnw.cmd clean spring-boot:run
```

Or:

```bash
mvn clean spring-boot:run
```

Backend runs at `http://localhost:8080`.

## Default admin

- Email: `admin@quickblog.com`
- Password: `admin123`

The account is created automatically on first startup.

## Gemini AI

`GeminiService.java` calls Google's official GenAI Java SDK. The current default model is `gemini-3.8-flash`. The React client never receives the Gemini API key.

The endpoint used by the existing Add Blog page is:

```text
POST /api/blogs/generate
```

Request:

```json
{
  "prompt": "Spring Boot Security"
}
```

Response:

```json
{
  "success": true,
  "content": "...Gemini-generated Markdown..."
}
```

## Cloudinary

`CloudinaryService.java` uploads blog thumbnails and stores the secure URL plus Cloudinary public ID in the `blogs` table. Deleting a blog also deletes its Cloudinary image when a public ID is available.

## Main API groups

- `GET /api/blogs/all`
- `GET /api/blogs/{id}`
- `POST /api/blogs/add`
- `POST /api/blogs/delete`
- `POST /api/blogs/toggle-publish`
- `POST /api/blogs/comments`
- `POST /api/blogs/add-comment`
- `POST /api/blogs/generate`
- `POST /api/admin/login`
- `GET /api/admin/dashboard`
- `GET /api/admin/blogs`
- `GET /api/admin/comments`
- `POST /api/admin/approve-comment`
- `POST /api/admin/delete-comment`
