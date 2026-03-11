# Mini Program Pages and User Flows

## 1. Mini program page structure

```text
miniapp/
  pages/
    login/
    home/
    books/
    book-detail/
    my-borrows/
    admin-dashboard/
    admin-books/
    admin-book-form/
    admin-borrows/
    admin-categories/
  utils/
    request.js
    auth.js
    format.js
  components/
    book-card/
    empty-state/
    filter-bar/
    section-header/
```

---

## 2. Common frontend requirements
- Use a clean and modern visual style
- Use card-based book list layout
- Encapsulate reusable book card component
- Display role-based navigation entries
- Store token in local storage
- Handle 401 by redirecting to login

---

## 3. Page definitions

### 3.1 Login page
Purpose:
- trigger WeChat login
- send login code to backend
- store token and user profile
- redirect by role

### 3.2 Home page
For normal users.
Sections:
- search bar
- top banner/hero
- hot books
- new arrivals
- category shelves

### 3.3 Books page
Features:
- search input
- category filter
- pagination or infinite scroll
- book cards

### 3.4 Book detail page
Show:
- cover image
- title
- author
- publisher
- description
- category
- location
- available count
- borrow button if allowed

### 3.5 My borrows page
Show:
- current borrowed books
- history
- due dates
- status tags

### 3.6 Admin dashboard
Show summary cards:
- total books
- available books
- active borrows
- overdue records

### 3.7 Admin books page
Features:
- list books
- keyword search
- category/status filter
- create/edit/delete buttons

### 3.8 Admin book form page
Form fields:
- title
- author
- publisher
- isbn
- category
- description
- coverUrl
- totalCount
- availableCount
- location
- status

### 3.9 Admin borrows page
Features:
- borrow record list
- status filter
- keyword filter
- return action
- optional borrow registration action

### 3.10 Admin categories page
Features:
- create category
- edit category
- delete category

---

## 4. User flow

### User login flow
1. app launches
2. check token
3. if no token, go login
4. call WeChat login
5. backend returns token + user profile
6. redirect to home page

### User borrow flow
1. user enters book detail page
2. click borrow
3. confirm action
4. frontend calls borrow API
5. success toast
6. refresh detail and my-borrows page

### Admin book CRUD flow
1. admin enters admin-books page
2. clicks create/edit
3. submits form
4. API saves data
5. list refreshes

### Admin return flow
1. admin enters admin-borrows page
2. finds active record
3. clicks return
4. calls return API
5. list refreshes

---

## 5. UI style guidance
- user pages should look visually pleasant, not like admin tables
- use large cover cards, rounded corners, whitespace, and section blocks
- admin pages can be more compact and data-oriented
