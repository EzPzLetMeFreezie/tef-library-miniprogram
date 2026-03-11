# Claude Code Execution Prompts

Use these prompts in sequence with Claude Code.

## Prompt 1 - Bootstrap backend
Create a NestJS backend in `/backend` for a WeChat Mini Program library management system.
Use MySQL + Prisma.
Implement the following first:
- project setup
- env config
- Prisma setup
- schema from `03-DATABASE-SCHEMA.md`
- auth module skeleton
- users module skeleton
- books module skeleton
- categories module skeleton
- borrow-records module skeleton
Also generate a `README.md` for local setup.
Follow `07-CODING-RULES.md` strictly.

---

## Prompt 2 - Implement authentication
Implement WeChat login flow for the NestJS backend.
Requirements:
- create `POST /auth/login`
- accept `code`, `nickname`, `avatarUrl`
- abstract WeChat code-to-openid exchange into a service
- for local dev, allow a mock mode if actual WeChat credentials are unavailable
- find or create user by `openid`
- issue JWT token
- create `/users/me`
- add JWT auth guard
- return role and profile
Follow the API contract in `04-BACKEND-API-SPEC.md`.

---

## Prompt 3 - Implement categories and books
Implement categories and books modules.
Requirements:
- category CRUD with admin restriction for write operations
- book CRUD with admin restriction for write operations
- book list query with filters, pagination, sorting
- book detail query
- DTO validation
- Prisma integration
- proper error handling

---

## Prompt 4 - Implement borrow and return logic
Implement borrow record module.
Requirements:
- `GET /borrow-records`
- `GET /borrow-records/my`
- `POST /borrow-records/borrow`
- `POST /borrow-records/return`
- use Prisma transaction for borrow and return
- validate stock and status transitions
- include related user/book info in list responses
- add overdue-compatible status handling

---

## Prompt 5 - Seed and testing helpers
Add seed scripts for:
- categories
- admin user
- books
- sample borrow records
Also add a Postman or REST client collection if possible.

---

## Prompt 6 - Bootstrap mini program
Create a WeChat Mini Program project in `/miniapp`.
Requirements:
- login page
- request utility with token injection
- app startup auth handling
- role-based navigation entry points
- books page
- book detail page
- my borrows page
Use the page structure in `05-MINIAPP-PAGES-AND-FLOWS.md`.

---

## Prompt 7 - Build admin mini program pages
Implement admin pages in the mini program:
- admin dashboard
- admin books list
- admin book form
- admin borrows list
- admin categories page
All admin actions must call protected backend APIs.

---

## Prompt 8 - Build recommendation home page
Implement a visually pleasant user home page.
Requirements:
- search bar
- hot books section
- new arrivals section
- category shelf sections
- reusable book card components
- clean and modern mobile-friendly styling
Backend should expose `/recommendations/home`.

---

## Prompt 9 - Add import/export
Implement backend import/export support.
Requirements:
- import books from CSV/XLSX
- export books as CSV/XLSX
- export borrow records as CSV/XLSX
- validation report for bad rows
Keep the implementation practical and maintainable.

---

## Prompt 10 - Polish and review
Review the whole project and improve:
- file structure
- naming consistency
- validation
- permission boundaries
- loading/error UX
- empty states
- README setup instructions
- sample environment template
