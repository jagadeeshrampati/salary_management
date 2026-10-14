# ACME Salary Management

ACME Salary Management is a web application for HR teams to manage employee compensation across countries. It provides a searchable employee directory, effective-dated compensation packages with itemized salary components, and a dashboard for reviewing compensation summaries. Compensation package and item changes are audited, and the app uses synthetic data for its 10,000-employee demo dataset.

## Technology

- **Backend:** Ruby on Rails API-only
- **Frontend:** Angular 20.3 standalone components, Angular Material 20.2, and Angular CLI 20.3
- **Database:** PostgreSQL
- **Audit history:** `audited` Rails gem

## Prerequisites

- Ruby and Rails (use the Ruby version listed in `backend/.ruby-version`, currently Ruby 4.0.7)
- PostgreSQL, running locally
- Node.js and npm compatible with Angular 20

## Local setup

### 1. Configure PostgreSQL and the backend

From the repository root, configure the backend environment:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with the PostgreSQL host, port, username, and password for your local database. The example uses `localhost:5432`.

Install Ruby dependencies, create and migrate the database, and load the sample data:

```bash
bundle install
bundle exec rails db:create
bundle exec rails db:migrate
bundle exec rails db:seed
```

The seed creates an admin audit actor, 10,000 synthetic employees, and historical/current compensation package data. It is designed to be safe to run again; existing compensation history is retained.

Start the API server:

```bash
bundle exec rails server
```

The API runs at `http://localhost:3000/api`.

### 2. Start the Angular frontend

Open a second terminal at the repository root and start the frontend:

```bash
cd frontend
npm ci
ng serve
```

Open `http://localhost:4200`. The development frontend is configured to call the API at `http://localhost:3000/api`; the Rails CORS configuration permits the frontend origin on port 4200.

## Main API routes

- `GET /api/dashboard` — dashboard metrics and compensation summaries
- `GET /api/employees` — searchable and paginated employee directory
- `GET /api/employees/:id` — employee details
- `GET /api/employees/:employee_id/compensation_packages` — compensation history
- `POST /api/employees/:employee_id/compensation_packages` — add an effective-dated package with compensation items

## Tests

Run backend tests from `backend/`:

```bash
bundle exec rails test
```

Frontend tests are not currently included in this project.

## Project artifacts

Product scope and implementation decisions are documented in [`docs/requirements.md`](docs/requirements.md) and [`docs/project-plan.md`](docs/project-plan.md).
