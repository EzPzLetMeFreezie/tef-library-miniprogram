# Library Manager WeChat Mini Program - Claude Code Instruction Pack

This folder contains a complete instruction set for Claude Code to build a **WeChat Mini Program + NestJS + MySQL + Prisma** library management system.

## Target stack
- Frontend: WeChat Mini Program (native)
- Backend: NestJS
- Database: MySQL
- ORM: Prisma
- Auth: WeChat login + JWT
- Roles: `ADMIN`, `USER`

## Project goals
Build a library management system with two roles:
1. **Admin**: manage books, categories, users, borrow/return records, import/export data
2. **User**: browse books, view recommendations, search books, view personal borrow history

## Suggested execution order for Claude Code
1. Read `01-PRODUCT-REQUIREMENTS.md`
2. Read `02-ARCHITECTURE.md`
3. Read `03-DATABASE-SCHEMA.md`
4. Read `04-BACKEND-API-SPEC.md`
5. Read `05-MINIAPP-PAGES-AND-FLOWS.md`
6. Read `06-IMPLEMENTATION-PLAN.md`
7. Follow `07-CODING-RULES.md`
8. Start implementation task by task using `08-CLAUDE-CODE-EXECUTION-PROMPTS.md`

## Expected deliverables
- `/backend` NestJS project
- `/miniapp` WeChat mini program project
- SQL/Prisma migration files
- API endpoints documented and implemented
- Role-based UI and permissions
- Seed data for testing

## Development principles
- Build the **MVP first**: auth, books, borrow/return, my records, admin CRUD
- Add recommendation and import/export after core workflow is stable
- Keep backend authorization strict; never rely only on frontend UI hiding
- Use database transactions for borrow and return flows
