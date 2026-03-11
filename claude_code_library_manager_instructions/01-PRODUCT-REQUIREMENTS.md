# Product Requirements

## 1. Product summary
Build a WeChat Mini Program library management system for a small organization, school, or internal reading room.

The system must support two roles:
- **Admin**
- **Normal User**

The system must manage:
- Books
- Categories
- Users
- Borrow records
- Import/export of data
- Recommended books UI for normal users

---

## 2. User roles

### 2.1 Admin
Admin capabilities:
- Login via WeChat identity mapped to admin role in backend
- View dashboard summary
- Create, read, update, delete books
- Filter books by title, author, category, ISBN, status
- Manage categories
- View all borrow records
- Register borrow operation
- Register return operation
- View overdue status
- Import books from CSV/Excel
- Export books and borrow records
- View and manage users if needed

### 2.2 User
User capabilities:
- Login via WeChat
- View beautiful home page with recommendations
- Search books by title/author/category
- View book detail page
- View availability
- Borrow a book if business rule allows self-service borrowing
- View personal borrow history
- View current borrowed books and due dates

---

## 3. MVP scope

### 3.1 Must-have in MVP
- WeChat login
- Role identification
- Book list page
- Book detail page
- My borrow records page
- Admin book CRUD
- Admin borrow list
- Borrow and return workflow
- Category filter
- Backend role-based authorization

### 3.2 Phase 2
- Home page recommendation sections
- Hot books ranking
- New arrivals
- Import/export CSV/Excel
- Dashboard charts/statistics
- Overdue scheduled job
- Fine-grained admin user management

---

## 4. Functional requirements

### 4.1 Authentication and authorization
- Frontend calls `wx.login()` to get code
- Backend exchanges code for `openid`
- Backend finds or creates user record
- Backend returns JWT token and user profile
- Every protected API requires JWT
- Admin endpoints must require `ADMIN` role

### 4.2 Book management
Each book should support:
- title
- author
- publisher
- ISBN
- description
- cover image URL
- category
- location
- total count
- available count
- status

Admin must be able to:
- create book
- update book
- delete book
- list books with search and filter

User must be able to:
- browse books
- search books
- filter by category
- view book details

### 4.3 Borrow management
Borrow record fields:
- user
- book
- borrow date
- due date
- return date
- status

Rules:
- Can only borrow when `availableCount > 0`
- Borrow creates borrow record and decrements `availableCount`
- Return updates record and increments `availableCount`
- Return should not be allowed twice for same record
- Overdue status can be computed dynamically or updated by job

### 4.4 Recommendation UI
User homepage should have:
- search bar
- banner or hero section
- hot books
- new arrivals
- category sections

Initial recommendation logic:
- hot books: order by borrow count desc
- new arrivals: order by create time desc
- category showcase: books grouped by category

### 4.5 Import/export
Admin should be able to:
- import books from CSV or Excel template
- export current book list
- export borrow records

---

## 5. Non-functional requirements
- Clear module separation
- Stable REST API
- Secure role checks in backend
- Transaction-safe borrow and return
- Clean UI for user-facing pages
- Mobile-friendly layout in mini program
- Easy local development and deployment

---

## 6. Out of scope for MVP
- Payment or fines
- Reservation queue
- Messaging/notifications
- Multi-library branch management
- Advanced recommendation algorithm
