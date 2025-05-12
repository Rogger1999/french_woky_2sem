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

## 🧠 Vocabulary Format

Each scanned page is processed into a JSON file like:

```json
[
  { "french": "chien", "german": "Hund", "image_url": null },
  { "french": "maison", "german": "Haus", "image_url": null }
]
