# QuickBlog — React + Spring Boot + MySQL + Cloudinary + Gemini AI

QuickBlog is a full-stack blogging platform built with the existing React frontend and a Spring Boot backend. The project keeps the original frontend/backend folder structure and adds:

- JWT-based admin authentication
- Blog CRUD and publish/unpublish workflow
- Comment submission, approval, and deletion
- Cloudinary image upload and deletion
- Real Gemini AI blog-content generation
- MySQL persistence with Spring Data JPA

## Project structure

```text
QuickBlog-updated-Cloudinary/
├── Client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── admin/
│   │   ├── context/
│   │   ├── pages/
│   │   │   └── admin/
│   │   └── Routes/
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
├── Server/
│   ├── src/
│   │   ├── main/java/com/quickblog/Server/
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── entity/
│   │   │   ├── exception/
│   │   │   ├── filter/
│   │   │   ├── repository/
│   │   │   ├── service/
│   │   │   └── util/
│   │   └── main/resources/application.properties
│   ├── pom.xml
│   └── mvnw / mvnw.cmd
└── README.md
```

The existing folders and files are preserved; `GeminiService.java` is added under the existing `Server/src/main/java/com/quickblog/Server/service/` package.

## Technology stack

### Frontend
- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- Quill editor
- React Hot Toast
- Marked

### Backend
- Java 21 target
- Spring Boot 4.1.1
- Spring Web MVC
- Spring Data JPA
- Spring Security 7
- JWT (JJWT)
- MySQL
- Cloudinary
- Google GenAI Java SDK

### AI
The project uses Google's official **Google GenAI Java SDK 1.67.0** and the stable **Gemini 3.8 Flash** model for the existing `POST /api/blogs/generate` feature. Google documents `com.google.genai:google-genai` as the current Java SDK and `gemini-3.8-flash` as a stable model.

## 1. Database setup

Start MySQL and create the database:

```sql
CREATE DATABASE quickblog;
```

Update these values in `Server/src/main/resources/application.properties` if necessary:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/quickblog
spring.datasource.username=root
spring.datasource.password=root
```

Hibernate uses `ddl-auto=update`, so the tables are created/updated from the JPA entities.

## 2. Cloudinary setup

Create a Cloudinary account and obtain:

- Cloud name
- API key
- API secret

Set these environment variables before starting the backend:

```text
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

The backend stores the Cloudinary secure image URL and public ID in the blog record. When a blog is deleted, the backend also attempts to delete its Cloudinary image.

## 3. Gemini AI setup

Create a Gemini API key in Google AI Studio. Then set:

```text
GEMINI_API_KEY=your_gemini_api_key
```

Optional model override:

```text
GEMINI_MODEL=gemini-3.8-flash
```

Do **not** put a real Gemini, Cloudinary, or production JWT secret into Git. The React application never receives the Gemini API key.

### Windows PowerShell

For the current terminal session:

```powershell
$env:GEMINI_API_KEY="your_gemini_api_key"
$env:CLOUDINARY_CLOUD_NAME="your_cloud_name"
$env:CLOUDINARY_API_KEY="your_cloudinary_api_key"
$env:CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
```

Then start Spring Boot in the same terminal.

## 4. Start the backend

Windows:

```bat
cd Server
mvnw.cmd clean spring-boot:run
```

Or, if Maven is installed:

```bash
cd Server
mvn clean spring-boot:run
```

Backend:

```text
http://localhost:8080
```

## 5. Start the frontend

Open a second terminal:

```bash
cd Client
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

`Client/.env` contains:

```text
VITE_BACKEND_URL=http://localhost:8080
```

## 6. Default admin

On first backend startup, the application creates:

```text
Email:    admin@quickblog.com
Password: admin123
```

Change the credentials/initializer before production deployment.

## 7. Gemini AI flow

The existing Add Blog page has a **Generate with Gemini AI** button. The flow is:

```text
Admin enters Blog Title
        ↓
Generate with Gemini AI
        ↓
React POST /api/blogs/generate
        ↓
Spring Boot BlogController
        ↓
BlogService
        ↓
GeminiService
        ↓
Google Gemini API
        ↓
Markdown article returned
        ↓
React converts Markdown to editor HTML
        ↓
Admin reviews/edits article
        ↓
Admin uploads thumbnail
        ↓
Cloudinary stores image
        ↓
POST /api/blogs/add
        ↓
MySQL stores blog metadata/content
```

The Gemini API key remains on the backend.

## 8. Main API endpoints

### Public blog APIs

```text
GET  /api/blogs/all
GET  /api/blogs/{id}
POST /api/blogs/comments
POST /api/blogs/add-comment
```

### Admin blog APIs

```text
POST /api/blogs/add
POST /api/blogs/delete
POST /api/blogs/toggle-publish
POST /api/blogs/generate
```

### Admin APIs

```text
POST /api/admin/login
GET  /api/admin/dashboard
GET  /api/admin/blogs
GET  /api/admin/comments
POST /api/admin/approve-comment
POST /api/admin/delete-comment
```

## 9. Important security notes

- Never expose `GEMINI_API_KEY` in React/Vite code.
- Never commit Cloudinary API secrets.
- Replace the sample JWT secret before production.
- Change the default admin password before production.
- Use HTTPS and production CORS origins when deploying.

## 10. Common issues

### Gemini says API key is missing

Check that `GEMINI_API_KEY` is set in the same terminal from which Spring Boot is started. Restart the backend after changing environment variables.

### Cloudinary upload fails

Check all three Cloudinary variables and make sure the API secret is correct.

### CORS error

The current backend allows `http://localhost:5173`. If Vite is running on another origin, update `SecurityConfig.java`.

### Port 8080 already in use

Stop the other Spring Boot process or change `server.port` in `application.properties`.

### MySQL connection error

Confirm that MySQL is running, the `quickblog` database exists, and the username/password are correct.

## 11. Verification checklist

After starting both applications:

1. Open `http://localhost:5173`.
2. Open `/admin`.
3. Login with the default admin credentials.
4. Open Add Blog.
5. Enter a blog title.
6. Click **Generate with Gemini AI**.
7. Confirm that Gemini-generated Markdown appears in the Quill editor.
8. Select a thumbnail and add the blog.
9. Confirm the image is stored in Cloudinary.
10. Publish the blog.
11. Open the public blog page.
12. Add a comment and approve it from the admin Comments page.

## Official references

Google's current GenAI Java SDK documentation recommends the `com.google.genai:google-genai` SDK and documents the `Client` + `models.generateContent(...)` Java API.
