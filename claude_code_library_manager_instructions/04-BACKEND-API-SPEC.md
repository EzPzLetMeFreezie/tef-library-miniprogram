# Backend API Specification

Base URL example:
`http://localhost:3000/api`

All protected endpoints require:
`Authorization: Bearer <token>`

---

## 1. Auth APIs

### POST /auth/login
Exchange WeChat code for JWT and user profile.

#### Request
```json
{
  "code": "wechat-login-code",
  "nickname": "Andrew",
  "avatarUrl": "https://..."
}
```

#### Response
```json
{
  "token": "jwt-token",
  "user": {
    "id": 1,
    "name": "Andrew",
    "role": "ADMIN"
  }
}
```

---

## 2. User APIs

### GET /users/me
Return current user profile.

### GET /users
Admin only. Return user list.

---

## 3. Category APIs

### GET /categories
Return all categories.

### POST /categories
Admin only. Create category.

### PATCH /categories/:id
Admin only. Update category.

### DELETE /categories/:id
Admin only. Delete category if no book depends on it.

---

## 4. Book APIs

### GET /books
Query books with optional filters.

#### Query params
- `keyword`
- `categoryId`
- `status`
- `page`
- `pageSize`
- `sortBy`
- `sortOrder`

#### Response
```json
{
  "items": [],
  "total": 100,
  "page": 1,
  "pageSize": 10
}
```

### GET /books/:id
Return single book detail.

### POST /books
Admin only. Create book.

#### Request example
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "publisher": "Prentice Hall",
  "isbn": "9780132350884",
  "description": "A book about writing maintainable code",
  "coverUrl": "https://...",
  "totalCount": 5,
  "availableCount": 5,
  "location": "A-02-03",
  "categoryId": 1
}
```

### PATCH /books/:id
Admin only. Update book.

### DELETE /books/:id
Admin only. Soft delete or hard delete depending on project decision.
Preferred MVP: hard delete only when no active borrow records exist.

---

## 5. Borrow record APIs

### GET /borrow-records
Admin only. Query all borrow records.
Filters:
- userId
- bookId
- status
- keyword
- page
- pageSize

### GET /borrow-records/my
Current user borrow records.

### POST /borrow-records/borrow
Borrow a book.

#### Request
```json
{
  "bookId": 1,
  "userId": 2,
  "dueDate": "2026-03-20T00:00:00.000Z"
}
```

Notes:
- `userId` may be omitted if borrowing as current authenticated user
- for admin-managed borrowing, userId can be specified explicitly

### POST /borrow-records/return
Return a borrowed book.

#### Request
```json
{
  "recordId": 10
}
```

### Business logic rules
Borrow:
- book exists
- book status is AVAILABLE
- availableCount > 0
- optionally enforce max active borrow count per user
- create borrow record + decrement inventory in one transaction

Return:
- record exists
- record status is BORROWED or OVERDUE
- set returnDate
- set status = RETURNED
- increment inventory in one transaction

---

## 6. Recommendation APIs

### GET /recommendations/home
Return homepage recommendation payload.

#### Response example
```json
{
  "hotBooks": [],
  "newArrivals": [],
  "categoryShelves": [
    {
      "category": { "id": 1, "name": "Computer Science" },
      "books": []
    }
  ]
}
```

---

## 7. Import/export APIs

### POST /import/books
Admin only. Upload CSV/XLSX and import books.

### GET /export/books
Admin only. Export books.

### GET /export/borrow-records
Admin only. Export borrow records.

---

## 8. Error handling standard
Use consistent response structure for errors.

```json
{
  "statusCode": 400,
  "message": "Book is out of stock",
  "error": "Bad Request"
}
```
