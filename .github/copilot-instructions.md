# Copilot instructions for Anythink-Market

This repository contains a Node/Express + React application with Docker/Helm artifacts and end-to-end tests. The goal of these instructions is to give an AI coding agent the minimum, precise knowledge needed to be productive immediately in this codebase.

Key locations
- backend/: Express API, Mongoose models, auth (Passport)
  - `backend/app.js` — server bootstrap, loads models and routes; expects MONGODB_URI in env
  - `backend/models/` — Mongoose model definitions (e.g. `User.js`, `Item.js`, `Comment.js`). Models are registered via `mongoose.model("Name")` and then used via `mongoose.model("Name")` in routes.
  - `backend/routes/api/` — REST endpoints. Example: `backend/routes/api/comments.js` and `backend/routes/api/items.js`.
  - `backend/config/` — configuration and Passport wiring (`config/passport.js`).
  - `backend/scripts/seeds.js` and `backend/seeds.sh` — DB seeding helpers.

- frontend/: React app (Create React App)
  - `frontend/src/agent.js` — single API client used across the app; central place to add new API endpoints and token handling. In development the client reads `process.env.REACT_APP_BACKEND_URL`.
  - `frontend/src/*` — components, reducers and store wiring. Look at `reducers/` to follow state shape conventions.

- tests/: Postman/Newman collections and e2e tests
  - `backend` test command uses Newman with `tests/api-tests.postman.json` and `tests/env-api-tests.postman.json` (see `backend/package.json`).
  - `tests/e2e/` contains Jest-based HTTP/Playwright-style tests. These assume the services are running locally.

- infrastructure
  - `docker-compose.yml` — local container orchestration for full-stack runs
  - `charts/` — Helm chart templates for Kubernetes deployment (backend/frontend/database manifests present under `charts/templates`).

Run / dev commands (exact)
- Backend (from repo root):
  - cd backend && npm run dev       # nodemon dev server (recommended during development)
  - cd backend && npm start         # production-like start (node ./app.js)
  - cd backend && npm run seeds     # run DB seed script
  - cd backend && npm test          # runs Newman Postman collection
  - cd backend && npm run stop     # kills process listening on :3000 (helper script)

- Frontend (from repo root):
  - cd frontend && npm start       # starts CRA dev server; start script expects REACT_APP_WILCO_ID via ../.wilco or WILCO_ID env
  - cd frontend && npm run build   # create production build
  - cd frontend && npm test        # run react tests

Environment notes
- Backend requires MONGODB_URI in the environment (or add it to a `.env` file) — `backend/app.js` logs a warning if missing.
- Frontend dev: `frontend/src/agent.js` uses `REACT_APP_BACKEND_URL` when `NODE_ENV !== 'production'`. When running locally export `REACT_APP_BACKEND_URL=http://localhost:3000` (or start CRA from repo root as provided).
- `frontend/package.json` start script injects a `WILCO_ID` by reading `../.wilco` when available — be aware when starting the frontend in containers or CI; adjust as necessary.

Project-specific patterns and conventions
- Global Mongoose model registration: models are required in `backend/app.js` (e.g. `require('./models/Comment')`) which registers them globally. Route handlers typically access models via `const Comment = mongoose.model('Comment')`.
- Error handling: API routes typically use try/catch and return JSON errors with `400` for validation/bad request and `500` for server errors (see `backend/routes/api/*.js`). Follow the same patterns when adding handlers.
- Single client layer in frontend: Add new endpoints in `frontend/src/agent.js` and then call them from components/containers. Token is managed via `agent.setToken()` which sets an internal token used by requests.
- Route structure: API routes are grouped under `backend/routes/api/` and exposed under `/api` by `backend/routes/index.js` (require the `routes` entry in `app.js`).

Integration points to watch
- Auth: Passport is wired via `backend/config/passport.js` and `express-session` is used. Changing auth will likely affect many routes and frontend token handling.
- DB migrations: there is no migration tool—seeds are in `backend/scripts/seeds.js`. Tests and CI depend on seeding or a running test DB.
- API contract: frontend expects JSON shapes returned by endpoints — check `frontend/src/agent.js` and `frontend` reducers/components when changing shapes.

Where to add common changes
- New API endpoint: create file under `backend/routes/api/`, follow existing try/catch and status code patterns, then call it from the frontend by adding an entry in `frontend/src/agent.js` and corresponding reducers/actions.
- New model: add file in `backend/models/`, export via `mongoose.model('Name', schema)`, and require it from `backend/app.js` so it's available to routes.

Quick "    ,  " checklist for the next PR
- Add tests: add a Newman collection entry or a Jest test under `tests/e2e/` as appropriate.
- Keep `agent.js` in sync with backend route paths.

If anything is unclear or you want more examples (e.g., a walk-through for adding an endpoint + frontend wiring + test), tell me which area and I'll expand this file with a short recipe and a minimal working example.
