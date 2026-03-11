# Implementation Plan

## Phase 0 - Project bootstrap
### Backend
- initialize NestJS project
- install Prisma, mysql2, JWT, validation libs
- configure environment variables
- create Prisma schema
- run initial migration

### Miniapp
- create WeChat mini program project
- set up page routing
- create request wrapper
- create auth utility

---

## Phase 1 - Authentication and core data
### Backend tasks
- implement Prisma service
- implement auth module
- implement JWT strategy and guards
- implement user entity and `/users/me`
- implement category list API
- implement book list and detail APIs

### Miniapp tasks
- implement login page
- implement token storage
- implement role-based navigation
- implement books page
- implement book detail page

Deliverable:
- users can log in and browse books

---

## Phase 2 - Admin book management
### Backend tasks
- create book DTOs
- implement create/update/delete book APIs
- add admin role guard
- add query filters and pagination

### Miniapp tasks
- implement admin books page
- implement admin book form page
- connect CRUD APIs

Deliverable:
- admin can manage books

---

## Phase 3 - Borrow/return workflow
### Backend tasks
- implement borrow record module
- implement borrow transaction
- implement return transaction
- implement my borrow records API
- implement admin borrow list API

### Miniapp tasks
- implement my borrows page
- implement admin borrows page
- add borrow action on detail page
- add return action for admin

Deliverable:
- full core library workflow is usable

---

## Phase 4 - Recommendations and polish
### Backend tasks
- implement homepage recommendation API
- hot books query
- new arrivals query
- category shelf query

### Miniapp tasks
- build user home page
- create reusable homepage sections
- improve empty/loading states

Deliverable:
- user-facing homepage looks polished

---

## Phase 5 - Import/export
### Backend tasks
- implement upload parser for CSV/XLSX
- implement export endpoints
- add import report response

### Miniapp tasks
- admin entry point for import/export
- upload file interaction if feasible within mini program; otherwise note that admin web may be easier later

Deliverable:
- data import/export available

---

## Phase 6 - Optional enhancements
- overdue scheduled job
- dashboard charts
- user management page
- web admin portal
