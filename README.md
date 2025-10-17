### 🧩 **README.md**

# 🚀 MERN Project Tracker (Client + Server)

A full-stack **MERN Project Tracker** featuring a **Vite + React** client and a **Node.js + TypeScript** backend following **Clean Architecture** and **Dependency Injection (InversifyJS)**.
Integrated with **Google Gemini AI** for project summaries and task-based Q&A.

---

## 📁 Project Structure

```
mern-project-tracker/
├── client/        # Frontend (Vite + React)
└── server/        # Backend (Node.js + TypeScript, Clean Architecture)
```

---

## ⚙️ Setup

### 1. Prerequisites

* Node.js v18+
* MongoDB (Local or Cloud)
* Gemini API Key
* *(Optional)* Docker & Docker Compose

---

## 🖥️ Client Setup (Vite + React)

```bash
cd client
npm install
npm run dev
```

> Runs the frontend at: **[http://localhost:8080](http://localhost:8080)**

---

## ⚙️ Server Setup (Node.js + TypeScript)

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:

```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/taskmng
GEMINI_API_KEY=your_gemini_api_key
CLIENT_ORIGIN=http://localhost:8080
```

Run the backend:

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
```

> API Base URL: **[http://localhost:3000/api](http://localhost:3000/api)**

---

## 🧠 AI Features (Gemini API)

* `/api/ai/summary/:projectId` → Generates project progress summary
* `/api/ai/qna/:taskId` → Answers task-related questions using task context

---

## 🔗 API Highlights

| Feature  | Endpoint                         | Method               |
| :------- | :------------------------------- | :------------------- |
| Projects | `/api/projects`                  | CRUD                 |
| Tasks    | `/api/projects/:projectId/tasks` | CRUD + Status Update |
| AI       | `/api/ai`                        | Summary & QnA        |

---

## 🐳 Docker Setup

```bash
docker compose up --build -d
# Stop
docker compose down
```

---

## 🧱 Tech Stack

**Frontend:** React, Vite, Axios, TypeScript
**Backend:** Node.js, Express, TypeScript, InversifyJS
**Database:** MongoDB (Mongoose)
**AI:** Google Gemini API
**Architecture:** Clean Architecture
**DevOps:** Docker & Docker Compose

---

## 📜 License

MIT © Muhammed Ameen T

---

Would you like me to include **frontend environment variables** (like VITE_API_URL) and **build commands** for production too? That would make the README deployment-ready.