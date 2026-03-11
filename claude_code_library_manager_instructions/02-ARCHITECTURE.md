# Architecture Design

## 1. High-level architecture
The system consists of three major parts:

1. **WeChat Mini Program frontend**
2. **NestJS backend API service**
3. **MySQL database**

Optional supporting parts:
- Object storage for book cover images
- Scheduled tasks for overdue checks
- File processing module for import/export

---

## 2. Recommended repository structure

```text
library-manager/
  backend/
  miniapp/
  docs/
```

---

## 3. Backend architecture
Use NestJS modular design.

### Core modules
- `auth`
- `users`
- `books`
- `categories`
- `borrow-records`
- `recommendations`
- `import-export`
- `common`

### Backend responsibilities
- WeChat login integration
- JWT issuance and validation
- Role-based access control
- Book CRUD
- Category CRUD
- Borrow/return transaction logic
- Recommendation query aggregation
- Import/export data processing

---

## 4. Mini Program architecture

### Suggested page groups
- public/shared pages
- user pages
- admin pages

### Shared utilities
- `utils/request.js`
- `utils/auth.js`
- `utils/format.js`
- `store/user.js` or app-level global state

### Navigation strategy
- Login at app launch
- Store JWT and user role locally
- Conditionally display admin entry points

---

## 5. Security design
- JWT token required for protected endpoints
- Role guard for admin operations
- Backend validates all permission-sensitive actions
- Input DTO validation with class-validator
- Prisma used to avoid unsafe raw SQL when possible

---

## 6. Data consistency design
Borrow and return operations must use transactions:
- Borrow: create record + decrement available count
- Return: update record + increment available count

Prevent inconsistent states:
- no negative inventory
- no duplicate return
- no borrow for disabled books

---

## 7. Import/export architecture
### Import
- Upload file to backend
- Parse CSV/XLSX
- Validate required columns
- Upsert or create book records
- Return import report

### Export
- Query filtered dataset
- Convert to CSV/XLSX
- Return downloadable stream or file URL

---

## 8. Recommendation architecture
Phase 1 recommendation can be query-based:
- hot books = sort by historical borrow count
- new arrivals = sort by `createdAt desc`
- category shelves = top books per category

No ML is needed in MVP.
