# 🚀 MERN Project Tracker Backend

Backend for the **MERN Project Tracker** built with **Node.js, Express, and TypeScript** following **Clean Architecture** and **Dependency Injection (InversifyJS)**.
Includes **Gemini AI integration** for project summaries and task Q&A.

---

## 🧱 Architecture Overview

| Layer              | Responsibility                                                     |
| :----------------- | :----------------------------------------------------------------- |
| **Presentation**   | Handles HTTP requests via Express Controllers                      |
| **Application**    | Contains business logic (Use Cases & DTOs)                         |
| **Domain**         | Core entities and repository interfaces                            |
| **Infrastructure** | Database, DI container, and external services (MongoDB, Gemini AI) |

**Principles:** Clean Architecture • SOLID • Dependency Injection • Maintainable & Testable

---

## ⚙️ Setup

### 1. Prerequisites

* Node.js v18+
* MongoDB (Local or Cloud)
* Gemini API Key
* *(Optional)* Docker & Docker Compose

### 2. Installation

```bash
git clone <repo-url>
cd mern-backend-project
npm install
```

Create a `.env` file in the root:

```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/taskmng
GEMINI_API_KEY=your_gemini_api_key
CLIENT_ORIGIN=http://localhost:8080
```

### 3. Run the App

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
```

---

## 🐳 Docker Setup

```bash
docker compose up --build -d
# Stop
docker compose down
```

---

## 🔗 API Endpoints

### Projects (`/api/projects`)

| Method | Route         | Action            |
| :----- | :------------ | :---------------- |
| POST   | `/`           | Create Project    |
| GET    | `/`           | Get All Projects  |
| GET    | `/:projectId` | Get Project by ID |
| DELETE | `/:projectId` | Delete Project    |

### Tasks (`/api/projects/:projectId/tasks`)

| Method | Route             | Action               |
| :----- | :---------------- | :------------------- |
| POST   | `/`               | Create Task          |
| GET    | `/`               | Get Tasks by Project |
| PATCH  | `/:taskId/status` | Update Task Status   |

### Gemini AI (`/api/ai`)

| Method | Route                 | Action                     |
| :----- | :-------------------- | :------------------------- |
| GET    | `/summary/:projectId` | Generate Project Summary   |
| POST   | `/qna/:taskId`        | Task-based Q&A with Gemini |

---

## 🧠 Tech Stack

* **Backend:** Node.js, Express, TypeScript
* **Database:** MongoDB (Mongoose)
* **Architecture:** Clean Architecture + InversifyJS
* **AI:** Google Gemini API
* **Containerization:** Docker + Compose

---

## 📜 License

MIT © Muhammed Ameen T

---