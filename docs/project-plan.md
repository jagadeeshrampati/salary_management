# ACME Salary Management — Implementation Notes

This document describes the implementation currently in the repository. The product requirements and scope boundaries are in [`requirements.md`](requirements.md).

## Architecture

```text
Angular 20.3 standalone app (Angular Material 20.2)
  ├─ Dashboard
  ├─ Employee directory
  ├─ Employee details and compensation history
  └─ New compensation package form
          │ JSON over HTTP
Rails 8.1 API-only backend ─ PostgreSQL
  ├─ Employees
  ├─ Compensation packages and items
  └─ Audited change records
```

The Angular app uses the Rails API at `/api`. The local development configuration points to `http://localhost:3000/api`; the frontend is served on port 4200.

## Backend implementation

### Models

- **Employee:** unique employee code and email; first/last name, two-letter country code, department, job title, and status (`active`, `on_leave`, `terminated`). Employees with compensation packages cannot be deleted because the association restricts deletion.
- **CompensationPackage:** belongs to an employee; has currency, `effective_from`, optional `effective_to`, and change reason. Validates currency format, date order, and non-overlapping effective periods.
- **CompensationItem:** belongs to a package; stores component type, category, and a decimal amount with two fractional digits. Component type is unique within a package.
- **Admin:** seeded audit actor record. It is not an authentication model or login flow.

### API routes

| Method and route | Behavior |
|---|---|
| `GET /api/dashboard` | Returns total and active employee counts, headcount by department and country, and average annual compensation by department and currency. |
| `GET /api/employees` | Returns employees with search, country/department/status filters, sorting, and offset pagination. Default page size is 20; maximum is 100. |
| `GET /api/employees/:id` | Returns an employee record. |
| `GET /api/employees/:employee_id/compensation_packages` | Returns the employee’s packages in descending effective date order, including items. |
| `POST /api/employees/:employee_id/compensation_packages` | Creates a package and its items transactionally. When a current package exists, closes it at the new package’s start date. |

The employee search checks employee code, first and last name, full name, and email. Sort fields are allow-listed and the employee ID is used as a stable tie-breaker.

### Audit behavior

`CompensationPackage` and `CompensationItem` use the `audited` gem. The package creation endpoint wraps the package close/create and item creation in an audited actor context using the seeded `admin@acme.example` admin. As authentication is out of scope, the audit actor is fixed for this flow and does not identify an authenticated person. There are no package/item update or delete routes.

## Frontend implementation

The standalone Angular app provides:

- A dashboard with summary cards/charts for headcount by country and department and average compensation by department/currency.
- An employee table with search, country/department/status filters, sorting, and pagination.
- Employee details with current and historical packages, dates, reasons, and item amounts.
- A form to create a package with currency, effective date, reason, and five compensation components: basic salary, HRA, special allowance, performance bonus, and employer PF.

The package form validates required values and non-negative component values in the UI; Rails performs the authoritative model and effective-period validation.

## Seed data

`backend/db/seeds.rb` creates a seeded admin, 10,000 synthetic employees, and two compensation packages per employee, each with five items. Employee attributes and amounts are generated deterministically from the employee number and fixed reference lists. Package effective dates are relative to `Date.current`, so they move when the seed is run on another date. Re-running the seed preserves existing package history for employees that already have packages.

## Tests and delivery status

- **Frontend:** automated frontend tests are not included in the current project scope.
- **Backend:** no backend test suite is documented in the repository.
- **Deployment/demo:** local setup is documented in the root README. No deployed URL is currently documented. The demo video is available on Google Drive: [Watch the demo](https://drive.google.com/file/d/13NOnlDK4jJ8bogTgF1mi3oUc0cmk4Hn5/view?usp=sharing).

## Explicit scope boundaries and gaps

- Authentication/authorization is out of scope; do not treat the seeded admin as a secured account.
- Salary history is created by adding effective-dated packages. The API has no direct correction/edit, deactivate, or delete operation for packages/items.
- The system is designed for synthetic assessment data; production identity, security controls, deployment, and operational audit-log protections are not covered here.
