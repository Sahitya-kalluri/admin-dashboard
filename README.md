# TaskFlow — Full-Stack Admin Dashboard

A single full-stack project: a React admin dashboard backed by a real
Python (FastAPI) REST API — JWT authentication, server-side search/filter/
pagination, and a real analytics aggregation endpoint. No mock data, no
Firebase — every screen is backed by an actual database.

## Stack

- **Frontend:** React 18, React Router, Axios, AG-Grid
- **Backend:** FastAPI, SQLAlchemy, SQLite (swap to Postgres via `DATABASE_URL`)
- **Auth:** JWT (OAuth2 password flow)
- **Tests:** pytest (backend)

## Run locally

### 1. Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate   # optional but recommended
pip install -r requirements.txt
python -m app.seed        # creates demo data + login: admin@demo.com / admin123
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

Run tests:
```bash
pytest tests/ -v
```

### 2. Frontend

```bash
cp .env.example .env      # points the app at http://localhost:8000
npm install
npm start
```

Open http://localhost:3000 and log in with `admin@demo.com` / `admin123`.

## What each page demonstrates

| Page | What it proves |
|---|---|
| Login | JWT auth flow, protected routes |
| Users | Full CRUD against a REST API, AG-Grid client-side sort/filter/export |
| Orders | **Server-side** search, status filter, and pagination — the backend does the query logic, not the browser |
| Dashboard / Analytics | Real aggregation queries (revenue, conversion rate, week-over-week change) computed in SQL, not hardcoded |

## Deployment

- **Backend + DB:** Render (Web Service + attach a Postgres instance, set `DATABASE_URL`)
- **Frontend:** Vercel
  1. Add environment variable `REACT_APP_API_URL` with your deployed backend URL.
  2. Redeploy the Vercel site.
  3. If the deployed app still calls `http://localhost:8000`, the env var is missing.

## Project structure

```
admin-dashboard/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app, CORS, router registration
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic request/response schemas
│   │   ├── auth.py          # JWT + password hashing
│   │   ├── seed.py          # demo data seeder
│   │   └── routers/
│   │       ├── auth.py
│   │       ├── users.py
│   │       ├── orders.py
│   │       └── analytics.py
│   └── tests/test_api.py
└── src/
    ├── api/client.js        # Axios instance + JWT interceptor
    ├── context/AuthContext.js
    ├── hooks/useUsers.js, useOrders.js, useAnalytics.js
    └── pages/...
```
