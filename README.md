# French Vocabulary Learning App 🇫🇷🇩🇪

An educational web app to help children (age ~12) learn French vocabulary using scanned French–German word lists. The app supports learning with structured vocabulary, interactive quizzes, and optional images for visual support.

## ✨ Features

- Upload scanned vocabulary pages and convert them into JSON format
- FastAPI backend serving vocabulary via REST API
- React + TailwindCSS frontend with:
  - Tabbed view for each vocabulary page
  - Table view of all French–German words
  - Learning mode with instant feedback and retry
  - Optional image support for visual learners
- Mobile responsive and child-friendly interface

---

## Architecture

### Back End (FastAPI + Uvicorn)
- Provides endpoints:
  - `/list-jsons`: returns a list of available JSON identifiers.
  - `/json/{id}`: returns content of the JSON file.
- Swagger documentation available at `/swagger` (and Redoc at `/redoc`).
- Designed with scalability in mind (support for dozens of pages).

### Front End (React + TailwindCSS)
- Tabbed interface: one tab per JSON file (e.g., “Page 1” corresponds to a JSON identifier).
- Vocabulary table (images shown when available).
- Dedicated “Learning Mode” for practicing translations.

## 🧠 Vocabulary Format

Each scanned page is processed into a JSON file like:

```json
[
  { "french": "chien", "german": "Hund", "image_url": null },
  { "french": "maison", "german": "Haus", "image_url": null }
]
