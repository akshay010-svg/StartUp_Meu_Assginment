# TaskFlow (Todo Application)

A full-stack, responsive task management web application built with a modern React + TypeScript frontend and a secure Node.js + Express + MongoDB backend.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Project Architecture](#project-architecture)
- [Setup and Installation Instructions](#setup-and-installation-instructions)
  - [Prerequisites](#prerequisites)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Instructions to Run the Application](#instructions-to-run-the-application)
  - [Running the Backend](#running-the-backend)
  - [Running the Frontend](#running-the-frontend)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Environment Variables](#environment-variables)

---

## Project Overview

**TaskFlow** is an enterprise-grade task and todo management system designed for productivity and simplicity. It features secure JWT-based user authentication, per-user task isolation, prioritized Kanban-style and list views, status toggling, and robust server-side schema validations using Zod.

---

## Key Features

### 🔐 Authentication & Security
- **User Authentication:** Registration (`/signup`) and Login (`/signin`) with hashed passwords via `bcryptjs`.
- **JWT Authorization:** Stateless authentication using JSON Web Tokens passed via HTTP `Authorization: Bearer <token>` headers.
- **Route Guards:** Client-side protection with `ProtectedRoute` for private pages and `GuestRoute` preventing authenticated users from re-accessing login/signup forms.
- **User Data Isolation:** Database-level user scoping—each user can only view, toggle, update, and delete their own tasks.

### 📋 Task Management
- **Interactive Dashboard:** Filterable, categorized views of tasks split into "In Progress" and "Completed".
- **Task Creation & Metadata:** Assign titles, descriptions, due dates, categories/tags, and priority levels (`low`, `medium`, `high`).
- **One-Click Status Toggle:** Quick status toggling between completed and pending directly from task cards.
- **Task Deletion:** Fast removal of finished or unwanted tasks with immediate state updates.

### 🎨 Design & Experience
- **Responsive UI:** Clean, polished user interface built with CSS design tokens, modern typography, and mobile-friendly layouts.
- **Form Validations:** End-to-end data validation with descriptive error feedback on invalid inputs.

---

## Technologies Used

### Frontend
- **Framework:** React 19 (TypeScript)
- **Bundler & Dev Server:** Vite 8
- **Routing:** React Router DOM 7
- **Styling:** Vanilla CSS with custom properties & design tokens
- **Code Quality:** ESLint 10 (Flat Config), TypeScript 6

### Backend
- **Runtime & Framework:** Node.js (v22+), Express 5
- **Database:** MongoDB with Mongoose 9 ODM (MongoDB Compass / Local / Atlas)
- **Validation:** Zod 4
- **Security & Auth:** JSON Web Tokens (`jsonwebtoken`), Password Hashing (`bcryptjs`), CORS
- **Development Tooling:** `tsx` (TypeScript execution and watch mode), TypeScript 7 (ESM / NodeNext)

---

## Project Architecture

```text
StartUp_Meu_Assginment/
├── backend/
│   ├── config/             # Environment configuration
│   ├── middleware/         # Auth, validation, and error-handling middleware
│   ├── models/             # Mongoose schemas (User, Todo)
│   ├── routes/             # Express API routes and controllers
│   ├── schemas/            # Zod validation schemas
│   ├── tests/              # Validation test suite
│   ├── index.ts            # Backend application entry point
│   ├── db.ts               # MongoDB connection logic
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # UI and layout components (AppShell, TodoCard, etc.)
│   │   ├── context/        # React context providers (AuthContext)
│   │   ├── pages/          # Route views (Dashboard, CreateTodo, SignIn, SignUp)
│   │   ├── services/       # API client & HTTP fetch wrappers
│   │   ├── types/          # TypeScript definitions
│   │   ├── App.tsx         # Route definitions and navigation guards
│   │   ├── main.tsx        # React root bootstrapping
│   │   └── index.css       # Design tokens and global CSS
│   └── package.json
└── README.md
```

---

## Setup and Installation Instructions

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v20.x` or higher (recommended: `v22.x`)
- **npm**: `v10.x` or higher
- **MongoDB**: A running local MongoDB instance (e.g., via MongoDB Community Server or MongoDB Compass) or a MongoDB Atlas connection string.

### 1. Clone the Repository

```bash
git clone https://github.com/akshay010-svg/StartUp_Meu_Assginment.git
cd StartUp_Meu_Assginment
```

### 2. Backend Setup

1. Open your terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install all dependencies:
   ```bash
   npm install
   ```
3. *(Optional)* Create a `.env` file in the `backend/` directory to customize configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/todo_app
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=*
   ```
   > **Note:** Defaults will point to `mongodb://127.0.0.1:27017/todo_app` and port `5000` if no `.env` file is present.

### 3. Frontend Setup

1. In a separate terminal window, navigate to the `frontend` directory from the root:
   ```bash
   cd frontend
   ```
2. Install all dependencies:
   ```bash
   npm install
   ```
3. *(Optional)* Create a `.env` file in the `frontend/` directory if connecting to a non-default backend port:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

---

## Instructions to Run the Application

### Running the Backend

From the `backend/` folder:

```bash
npm run dev
```

The API server will start in development watch mode at:
`http://localhost:5000` (Connected to MongoDB).

### Running the Frontend

From the `frontend/` folder:

```bash
npm run dev
```

The Vite dev server will start at:
`http://localhost:5173` (or the port specified in terminal output).

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Available Scripts

### Backend (`cd backend`)

| Command | Description |
|---|---|
| `npm run dev` | Runs the API server in watch mode using `tsx` |
| `npm run build` | Compiles TypeScript source to `dist/` |
| `npm start` | Runs the compiled production server from `dist/index.js` |
| `npm run typecheck` | Checks TypeScript types without emitting files |
| `npm test` | Runs the Zod validation test suite |

### Frontend (`cd frontend`)

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite local development server |
| `npm run build` | Compiles TypeScript and builds production bundles |
| `npm run lint` | Runs ESLint checks across the codebase |
| `npm run preview` | Previews the production build locally |

---

## API Overview

### Authentication (`/api/user`)
- `POST /api/user/signup` — Register a new account (`name`, `email`, `password`)
- `POST /api/user/signin` — Authenticate and receive a JWT token (`email`, `password`)
- `GET /api/user/me` — Retrieve currently authenticated user profile

### Todos (`/api/todos`) *(Requires Bearer Token)*
- `GET /api/todos` — Get all todos belonging to authenticated user
- `POST /api/todos` — Create a new todo (`title`, `description`, `priority`, `dueDate`, `category`)
- `PUT /api/todos/:id` — Update existing todo details
- `PATCH /api/todos/:id/toggle` — Toggle completed status between `pending` and `completed`
- `DELETE /api/todos/:id` — Delete a todo by ID

---

## Environment Variables

| Variable | Description | Default | Location |
|---|---|---|---|
| `PORT` | Backend server port | `5000` | Backend |
| `MONGODB_URI` | MongoDB connection URI | `mongodb://127.0.0.1:27017/todo_app` | Backend |
| `JWT_SECRET` | Secret key used to sign JWTs | `dev-todo-app-secret-key-...` | Backend |
| `JWT_EXPIRES_IN` | Token validity duration | `7d` | Backend |
| `CORS_ORIGIN` | Allowed CORS origins | `*` | Backend |
| `VITE_API_BASE_URL` | Base URL for the frontend API client | `http://localhost:5000/api` | Frontend |
