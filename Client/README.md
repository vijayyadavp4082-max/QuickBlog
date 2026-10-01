# QuickBlog React Client

## Stack
- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- Quill
- Marked
- React Hot Toast

## Backend URL

`Client/.env`:

```text
VITE_BACKEND_URL=http://localhost:8080
```

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Gemini AI

The frontend does not call Gemini directly. The existing Add Blog page sends the title to the Spring Boot backend:

```text
POST /api/blogs/generate
```

The backend calls Gemini and returns Markdown. The frontend converts that Markdown into HTML for the Quill editor. This keeps the Gemini API key private on the server.

The Add Blog button is labelled **Generate with Gemini AI**.
