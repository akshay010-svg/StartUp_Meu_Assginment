# Agent Context

Compact project memory for future coding agents. Verify all details against source before editing.

## Repository Snapshot

- Root contains `frontend/` and `backend/`; there is no root package manager config.
- Package manager: npm, with separate `package-lock.json` files in `frontend/` and `backend/`.
- Git status during initial inspection showed `backend/` as untracked. Treat it as user work and preserve it.

## Frontend

- Path: `frontend/`.
- Stack: React 19, React DOM 19, React Router DOM 7, TypeScript 6, Vite 8, ESLint 10 flat config.
- Entry point: `frontend/src/main.tsx`.
- Client routing and route config: `frontend/src/App.tsx` (`/signin`, `/signup`, `/dashboard`, `/create`, with redirects).
- Authentication context and state: `frontend/src/context/AuthContext.tsx`.
- Route guards: `frontend/src/components/ProtectedRoute.tsx`, `frontend/src/components/GuestRoute.tsx`.
- Global styles and design tokens: `frontend/src/index.css`.
- App/page/component styles: `frontend/src/App.css`.
- Reusable UI components: `frontend/src/components/`.
- Page-level screens: `frontend/src/pages/`.
- API client and token storage: `frontend/src/services/api.ts`.
- Todo types: `frontend/src/types/todo.ts`.
- Starter todo data for reference: `frontend/src/data/initialTodos.ts`.
- Static assets: `frontend/public/` and `frontend/src/assets/`.

Commands from `frontend/`:

- `npm run dev` - start the Vite dev server.
- `npm run build` - run TypeScript project build and Vite production build.
- `npm run lint` - run ESLint flat config.
- `npm run preview` - preview the production build.

## Backend

- Path: `backend/`.
- Stack: Node.js (v22), Express 5, Mongoose 9 (MongoDB Compass / local MongoDB), Zod 4, bcryptjs, jsonwebtoken, tsx, TypeScript 7 with NodeNext ESM.
- Entry point: `backend/index.ts`.
- Database connection: `backend/db.ts` (connects via `MONGODB_URI`, defaults to `mongodb://127.0.0.1:27017/todo_app` which can be inspected in MongoDB Compass).
- Configuration: `backend/config/index.ts`.
- Mongoose Models:
  - `backend/models/User.ts` - User document schema with hashed passwords and sanitized JSON.
  - `backend/models/Todo.ts` - Todo document schema with user scoping index and priority/status enums.
- Zod Validation Schemas:
  - `backend/schemas/user.schema.ts` - `signUpSchema`, `signInSchema`.
  - `backend/schemas/todo.schema.ts` - `createTodoSchema`, `updateTodoSchema`, `todoIdParamSchema`.
- Middleware:
  - `backend/middleware/validate.middleware.ts` - Zod request body and parameter validation.
  - `backend/middleware/auth.middleware.ts` - JWT authentication attaching user payload.
  - `backend/middleware/error.middleware.ts` - Centralized error handling.
- Routes & Controllers:
  - `backend/routes/user/user.routes.ts` & `user.controller.ts` (`POST /api/user/signup`, `POST /api/user/signin`, `GET /api/user/me`).
  - `backend/routes/todos/todo.routes.ts` & `todo.controller.ts` (`GET /api/todos`, `POST /api/todos`, `PUT /api/todos/:id`, `PATCH /api/todos/:id/toggle`, `DELETE /api/todos/:id`).

Commands from `backend/`:

- `npm run dev` - starts the API server in watch mode using `tsx`.
- `npm run build` - compiles TypeScript to `backend/dist/`.
- `npm start` - runs the compiled production build from `backend/dist/index.js`.
- `npm run typecheck` - checks types using `tsc --noEmit`.
- `npm test` - runs the Zod validation test suite (`backend/tests/validation.test.ts`).

## Conventions Observed

- Frontend and backend source use extension imports matching NodeNext/Vite resolution (e.g. `./App.tsx`, `./db.js`).
- Strict linting and typing enabled on both packages.
- CSS uses custom properties in `frontend/src/index.css` for design tokens.
- All database mutation endpoints enforce Zod validation before any persistence occurs.
- User data isolation is enforced server-side using authenticated `userId` on all todo operations.

## Maintenance Notes

- Update this file only when meaningful project knowledge changes.
- Keep notes concise and path-oriented.
- Do not store secrets, log output, generated files, or long task histories here.
