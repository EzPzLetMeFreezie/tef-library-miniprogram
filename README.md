# TEF Library Mini Program

A WeChat Mini Program library management system for **TEF (Thanksgiving English Fellowship)**.

## Features

- **Book browsing** — Search, filter by category/status, view book details
- **Borrow management** — Borrow and return books with due date tracking
- **User profiles** — WeChat avatar/nickname sync, borrow history
- **Admin dashboard** — Statistics overview with quick navigation
- **Admin book management** — CRUD operations, category assignment, sorting
- **Admin borrow management** — Create borrows for users, confirm returns, overdue tracking
- **Admin user management** — View users, change roles (Admin/User), delete users
- **Admin category management** — Organize books by category

## Tech Stack

- **Frontend**: WeChat Mini Program (WXML/WXSS/JS)
- **Backend**: NestJS + Prisma ORM + MySQL
- **Auth**: JWT with WeChat login (mock mode available for development)

## Project Structure

```
├── miniapp/          # WeChat Mini Program frontend
│   ├── pages/        # App pages
│   ├── utils/        # Shared utilities (request, auth, format)
│   └── images/       # Static assets
├── backend/          # NestJS backend API
│   ├── src/          # Source code
│   ├── prisma/       # Database schema
│   └── .env          # Environment config (not committed)
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MySQL](https://www.mysql.com/) (v8+)
- [WeChat DevTools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

### Backend Setup

```bash
cd backend
npm install

# Configure database connection
cp .env.example .env
# Edit .env with your MySQL credentials

# Initialize database
npx prisma db push

# Start dev server
npm run start:dev
```

### Frontend Setup

1. Open WeChat DevTools
2. Import the `miniapp/` directory as a Mini Program project
3. Update `miniapp/utils/request.js` with your backend URL
4. Compile and preview

### Environment Variables

Create `backend/.env`:

```env
DATABASE_URL="mysql://root:password@localhost:3306/library_manager"
JWT_SECRET="your-jwt-secret"
WECHAT_APPID="your-appid"
WECHAT_SECRET="your-secret"
MOCK_WECHAT=true
PORT=3000
```

## License

MIT
