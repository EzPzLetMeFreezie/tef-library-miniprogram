# Database Schema

Use MySQL with Prisma ORM.

## 1. Prisma schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id            Int            @id @default(autoincrement())
  openid        String         @unique
  name          String
  avatarUrl     String?
  phone         String?
  role          Role           @default(USER)
  borrowRecords BorrowRecord[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model Category {
  id        Int      @id @default(autoincrement())
  name      String   @unique
  sortOrder Int      @default(0)
  books     Book[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Book {
  id             Int            @id @default(autoincrement())
  title          String
  author         String
  publisher      String?
  isbn           String?        @unique
  description    String?        @db.Text
  coverUrl       String?
  totalCount     Int            @default(1)
  availableCount Int            @default(1)
  location       String?
  status         BookStatus     @default(AVAILABLE)
  categoryId     Int?
  category       Category?      @relation(fields: [categoryId], references: [id])
  borrowRecords  BorrowRecord[]
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  @@index([title])
  @@index([author])
  @@index([categoryId])
}

model BorrowRecord {
  id         Int          @id @default(autoincrement())
  userId     Int
  bookId     Int
  borrowDate DateTime     @default(now())
  dueDate    DateTime
  returnDate DateTime?
  status     BorrowStatus @default(BORROWED)
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt

  user User @relation(fields: [userId], references: [id])
  book Book @relation(fields: [bookId], references: [id])

  @@index([userId])
  @@index([bookId])
  @@index([status])
}

enum Role {
  ADMIN
  USER
}

enum BookStatus {
  AVAILABLE
  DISABLED
}

enum BorrowStatus {
  BORROWED
  RETURNED
  OVERDUE
}
```

---

## 2. Notes on schema design
- `openid` uniquely identifies WeChat users
- `availableCount` must always be `<= totalCount`
- `isbn` is optional because some books may not have a valid ISBN
- `BorrowRecord.status` supports overdue state

---

## 3. Seed suggestions
Initial seed data should include:
- at least 1 admin user using configurable openid placeholder
- 4 to 8 categories
- 20 to 50 books
- several borrow records for testing hot books logic

---

## 4. Sample category seed values
- Computer Science
- Literature
- Business
- History
- Design
- Children
- Language
- Art

---

## 5. Data integrity rules
- when a book is borrowed, decrement `availableCount`
- when returned, increment `availableCount`
- `availableCount` must never go below 0
- disabled books cannot be borrowed
