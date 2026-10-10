# AGENTS.md

Permanent engineering guidance for coding agents working in this repository.

## Project Shape

- This repository currently has two top-level packages, not a configured monorepo workspace:
  - `frontend/`: React + TypeScript + Vite app.
  - `backend/`: early Node/TypeScript backend scaffold.
- Use npm in each package directory. There is no root `package.json`.
- Treat `docs/agent-context.md` as the compact project memory index. Read it at the start of each nontrivial task, then verify details against source before editing.
- The backend directory is currently not tracked by Git in the inspected checkout. Preserve it and do not assume untracked means disposable.

## Required Workflow

For every implementation task:

1. Understand the requested outcome and acceptance criteria.
2. Read this file and the relevant parts of `docs/agent-context.md`.
3. Inspect only the files needed for the affected execution path.
4. Check `git status --short` before editing.
5. Plan the smallest safe change that fits the existing structure.
6. Implement focused edits without unrelated cleanup.
7. Run the narrowest relevant verification first, then broader checks when practical.
8. Review the final diff for accidental changes, security issues, dead code, and unnecessary complexity.
9. Update `docs/agent-context.md` only for meaningful architectural, workflow, API, or state changes.
10. Report changed files, verification results, and remaining risks concisely.

For trivial documentation or typo fixes, combine these steps mentally but still preserve user work.

## Efficient Repository Exploration

- Prefer targeted commands: `rg --files`, `rg "term" path`, and small file sections.
- Avoid reading generated output, dependencies, build artifacts, lockfiles, and unrelated modules unless the task requires them.
- Do not dump whole directories or huge files into context.
- Start from documentation and package configuration, then trace the relevant source path.
- Before reimplementing anything, search for existing utilities, components, API helpers, styles, or conventions.
- Trust current source and configuration over memory notes when they conflict.

## Current Commands

Run commands from the package directory shown.

Frontend (`frontend/`):

- `npm run dev` - start the Vite dev server.
- `npm run build` - run TypeScript project build and Vite production build.
- `npm run lint` - run ESLint flat config.
- `npm run preview` - preview the production build.

Backend (`backend/`):

- `npm test` is only the default placeholder and currently fails by design.
- No backend dev, start, build, lint, or test script is currently defined. Add package scripts before relying on a backend workflow.
- If backend TypeScript changes are made before scripts exist, a targeted `npx tsc --noEmit` from `backend/` may be useful, but document that it is not an established script.

## Frontend Guidelines

- Follow the existing React + Vite + TypeScript setup. Do not introduce another framework or state library without a clear need.
- Keep components small and focused. Extract reusable components only when there is real reuse or a clear readability win.
- Keep app bootstrapping in `frontend/src/main.tsx`; keep route or page composition near `frontend/src/App.tsx` until the app grows enough to justify structure.
- Reuse CSS custom properties in `frontend/src/index.css` for design tokens. Keep component/page-specific styles close to the component stylesheet pattern already used by `frontend/src/App.css`.
- Preserve accessibility: semantic HTML, labels for controls, keyboard support, visible focus states, sufficient contrast, and meaningful alt text for informative images.
- Prefer minimal, polished UI with clear hierarchy. Avoid unnecessary gradients, heavy shadows, decorative clutter, and broad redesigns when making functional changes.
- Keep responsive behavior intentional. Verify mobile and desktop layouts for visual changes.
- Do not add client-side dependencies for simple UI behavior that React, CSS, or the existing stack can handle.
- Frontend environment variables are public when exposed through Vite. Only use `VITE_` variables for non-secret browser-safe configuration.

## Backend Guidelines

- The backend is currently an early TypeScript scaffold with `backend/index.ts`, `backend/db.ts`, and empty route folders under `backend/routes/`.
- Preserve separation of concerns as the backend grows:
  - entry/server setup in `index.ts`;
  - persistence and database setup behind `db.ts` or a dedicated data layer;
  - route handlers under `routes/`;
  - validation and business logic outside thin HTTP handlers when complexity grows.
- Validate all untrusted input at API boundaries.
- Use safe database APIs or parameterized queries when persistence is added.
- Return consistent API response and error shapes. Avoid leaking stack traces, configuration, SQL details, or internal errors to clients.
- Add pagination, filtering, and limits for any endpoint that can return unbounded collections.
- Use transactions when multiple persistence operations must succeed or fail together.
- Do not introduce a backend framework, ORM, database, auth provider, or migration system casually. Check existing direction, document the decision, and update context.

## Security Rules

- Never commit secrets, tokens, private URLs, credentials, or personal data.
- Do not read or print secret values just to verify that variables exist.
- Keep server-only secrets out of frontend bundles, public config, logs, and responses.
- Enforce authorization server-side for protected operations. Frontend checks are only UX.
- Verify ownership and tenant boundaries before reading or mutating user-scoped resources.
- Prevent injection, XSS, insecure direct object references, path traversal, unsafe deserialization, and unsafe shell construction.
- Use secure cookie, CORS, CSRF, and session practices appropriate to the chosen backend architecture.
- Avoid disabling validation, linting, type checks, or security checks to make a task pass.
- Do not run destructive database, filesystem, or deployment operations without explicit user authorization.

## Code Quality

- Prefer clear, direct solutions over clever abstractions.
- Keep functions, modules, and components single-purpose and reasonably small.
- Use descriptive names and consistent file organization.
- Avoid duplicated logic, deep nesting, magic values, and broad refactors unrelated to the task.
- Add abstractions only when they remove meaningful complexity or match an established pattern.
- Remove dead code and unused imports introduced by your changes.
- Keep business logic separate from presentation and infrastructure where appropriate.
- Handle errors explicitly and provide useful user-facing messages without exposing internal details.

## Testing and Verification

- Inspect available scripts before choosing verification.
- For frontend behavior changes, run at least the narrowest relevant check, usually `npm run lint` or `npm run build` from `frontend/`.
- For backend changes, add or establish meaningful scripts/tests when the task introduces behavior worth verifying.
- Add tests for meaningful bug fixes, edge cases, and business logic once a test framework exists or when adding one is justified.
- Never claim a command passed unless it actually ran successfully.
- If a check cannot run, report why and describe the remaining risk.

## Dependencies and Configuration

- Inspect existing dependencies before adding new ones.
- Prefer current platform capabilities and installed packages.
- Follow npm and the existing `package-lock.json` files. Do not switch package managers unless explicitly requested.
- Avoid modifying lockfiles unless dependencies actually change.
- Keep environment-specific configuration out of application logic.
- Document new environment variables by name and purpose, never secret values.

## Git and Change Management

- Check `git status --short` before edits and before the final report.
- Preserve all user changes and untracked work.
- Never use destructive Git commands such as `git reset --hard` or `git checkout --` unless explicitly requested.
- Do not commit, push, deploy, or publish unless the user asks.
- Keep diffs focused. Do not reformat or refactor unrelated files.
- Update documentation when architecture, commands, configuration, public behavior, or setup changes.

## Project Memory

Use `docs/agent-context.md` as an index, not a source of truth.

- Add concise notes for significant architecture decisions, important file locations, command changes, API contracts, integration details, known issues, and completed work that future agents should know.
- Remove stale or obsolete notes when facts change.
- Record paths and summaries, not copied source code.
- Do not record secrets, credentials, temporary debugging output, or verbose task logs.
- Never claim continuity from undocumented or unverifiable work.
