# CodeClash 1v1 — Real-Time Coding Battle Platform

> Challenge opponents to 1v1 coding duels. Solve algorithmic problems with **C++17** or **Java 17**. First to pass all test cases wins.

![Tech Stack](https://img.shields.io/badge/Stack-React%20%2B%20Node%20%2B%20MongoDB%20%2B%20Socket.IO-7C3AED?style=flat-square)

---

## ✨ Features

- **Real-time 1v1 battles** via Socket.IO
- **Public matchmaking** + **private rooms** with shareable codes
- **30-minute synchronized timer**
- **Monaco Editor** (VS Code-style) with C++17 and Java 17 support
- **Docker-sandboxed judge** — no internet access, 2s time limit, 256MB memory
- **Live typing indicator** (no code reveal)
- **Winner popup** with battle reason
- **Battle history** with pagination
- **Admin panel** for CRUD problem management
- **JWT authentication** with bcrypt password hashing

---

## 🚀 Quick Start

### With Docker (Recommended)

**Prerequisites:** Docker + Docker Compose

```bash
# 1. Clone the project
cd "Code Wars"

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env and set a strong JWT_SECRET
notepad .env

# 4. Build and run everything
docker compose up --build

# 5. Open your browser
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000/api/health
```

> **Note:** On first run, 5 starter problems are automatically seeded into MongoDB.

---

### Local Development (Without Docker)

**Prerequisites:** Node.js 20+, MongoDB 7+

```bash
# Start MongoDB locally first

# Backend
cd backend
npm install
cp ../.env.example .env
# Edit .env — set MONGODB_URI=mongodb://localhost:27017/codeclash
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

---

## 🛡️ Judge / Code Execution

The judge supports two modes:

### Docker Mode (Production — Secure)
- Each submission spawns a fresh Docker container
- `--network none` — zero internet access
- `--memory 256m` — memory capped
- `--cpus 0.5` — CPU limited
- 2-second timeout per test case
- Temp files deleted after execution

**Pull judge images:**
```bash
docker pull gcc:12
docker pull openjdk:17-slim
```

### Local Fallback (Development — Insecure)
If Docker is not running, the judge falls back to local `g++`/`java` execution.
This is **not secure** and should only be used for development.

---

## 🗂️ Project Structure

```
Code Wars/
├── docker-compose.yml
├── .env.example
├── frontend/                 # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/            # Home, Login, Signup, Dashboard, Matchmaking, Room, History, admin/Problems
│   │   ├── components/       # Navbar, Timer, WinnerModal, TypingIndicator, etc.
│   │   ├── contexts/         # AuthContext, SocketContext
│   │   └── api/              # Axios instance
│   └── Dockerfile
└── backend/                  # Node.js + Express + Socket.IO
    ├── server.js
    ├── src/
    │   ├── models/            # User, Problem, Room, Submission, Battle
    │   ├── routes/            # auth, match, problems, submissions, history, admin
    │   ├── controllers/       # Business logic
    │   ├── socket/            # Socket.IO event handlers
    │   ├── judge/             # Docker code executor
    │   └── seed/              # Seed problems
    └── Dockerfile
```

---

## 🔑 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Register user |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | JWT | Get current user |
| POST | `/api/match/find` | JWT | Join matchmaking queue |
| POST | `/api/match/create-private` | JWT | Create private room |
| POST | `/api/match/join-private` | JWT | Join with room code |
| GET | `/api/problems/random` | JWT | Get random problem |
| GET | `/api/problems/:id` | JWT | Get problem by ID |
| POST | `/api/submissions/run` | JWT | Run with custom input |
| POST | `/api/submissions/submit` | JWT | Submit against hidden tests |
| GET | `/api/history` | JWT | Battle history (paginated) |
| GET | `/api/admin/problems` | Admin | List all problems |
| POST | `/api/admin/problems` | Admin | Create problem |
| PUT | `/api/admin/problems/:id` | Admin | Update problem |
| DELETE | `/api/admin/problems/:id` | Admin | Delete problem |

---

## ⚡ Socket Events

### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| `join-room` | `{ roomId }` | Join a battle room |
| `leave-room` | `{ roomId }` | Leave room |
| `typing` | `{ roomId, isTyping }` | Typing status |
| `submit-solution` | `{ roomId, code, language, problemId }` | Submit code |

### Server → Client
| Event | Description |
|-------|-------------|
| `room-state` | Full room state on join |
| `battle-start` | Battle begins — includes problem |
| `player-connected` | Opponent joined |
| `player-disconnected` | Opponent left |
| `opponent-typing` | Typing indicator |
| `player-submitted` | Opponent submitted |
| `submission-result` | Your submission verdict |
| `battle-end` | Winner announced |
| `timer-sync` | Timer synchronization |

---

## 👑 Admin Setup

To make a user admin:

```js
// Using MongoDB shell or Compass
db.users.updateOne({ username: "yourusername" }, { $set: { isAdmin: true } })
```

Then log in and visit `/admin/problems`.

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#0B1020` |
| Primary | `#7C3AED` |
| Secondary | `#06B6D4` |
| Success | `#22C55E` |
| Error | `#EF4444` |

- Glassmorphism cards with `backdrop-blur`
- Gradient borders with CSS masking
- Framer Motion animations on all pages
- JetBrains Mono for code, Inter for UI

---

## 📄 License

MIT — Built for competitive coders. Good luck and may the best coder win! ⚔️
