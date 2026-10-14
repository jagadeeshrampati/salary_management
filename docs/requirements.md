# ACME Salary Management — Requirements and Current Scope

## Goal and user

Help ACME’s HR manager replace spreadsheet-based compensation tracking for 10,000 employees across countries with a searchable web application. The manager should be able to find employees, review compensation history, record a new compensation package, and understand basic workforce and compensation summaries.

## Implemented features

- Synthetic seed data for 10,000 employees across five countries, departments, job titles, and employment statuses. Each employee receives historical and current compensation packages with itemized annual amounts.
- Employee directory with server-side search, country, department, and status filters, allow-listed sorting, and bounded pagination.
- Employee details with compensation package history, effective dates, currency, change reason, and component breakdown.
- New effective-dated compensation package flow. Creating a package closes the previous current package at the new package’s effective date. Package changes are audited with the Rails `audited` gem and associated with the seeded admin record.
- Dashboard showing employee totals, active headcount, headcount by country and department, and average annual compensation by department and currency.
- Rails API-only backend, PostgreSQL, Angular standalone components, and Angular Material UI.

## Data and behavior

Employees have a unique employee code and email, two-letter country code, department, job title, and status (`active`, `on_leave`, or `terminated`). Compensation packages belong to an employee and contain a three-letter currency code, effective start/end dates, and a change reason. Compensation items store decimal amounts and a component category. Compensation periods for the same employee must not overlap. Dashboard compensation averages stay grouped by currency; no exchange-rate conversion is performed.

The current API creates a new package and closes the prior package when applicable. It does not expose direct package/item editing, package deactivation, or deletion. Audit actor attribution uses the seeded `admin@acme.example` record in the package creation flow; there is no authentication or signed-in admin identity.

## Deliberately out of scope

- Authentication and authorization are out of scope for this assessment implementation. The seeded admin is an audit attribution record, not a login account.
- Payroll calculations, payslips, tax or benefits rules, salary payments, and integrations with HRIS/payroll systems.
- Currency conversion and cross-currency totals.
- Employee self-service, approvals, bulk spreadsheet import/export, notifications, and advanced analytics.
- Frontend automated tests. No frontend test suite is included in the current implementation.

## Known gaps against the broader assessment brief

There is no authentication boundary or deployed environment documented in the repository. The demo video is available on Google Drive: [Watch the demo](https://drive.google.com/file/d/13NOnlDK4jJ8bogTgF1mi3oUc0cmk4Hn5/view?usp=sharing). Salary correction is represented by creating a new effective-dated package rather than editing or deactivating an existing package. The current seed is synthetic and uses dates relative to the seed run.
