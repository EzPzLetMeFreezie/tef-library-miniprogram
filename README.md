# TEF Library Mini Program

A WeChat Mini Program library management system for **TEF (Thanksgiving English Fellowship)**.

## Features

- **Book browsing** — Search, filter by category/status, horizontal scroll for new arrivals and popular books
- **Book detail** — Centered cover display, stock progress bar, one-tap borrow
- **Borrow management** — Borrow and return books with due date tracking
- **User profiles** — WeChat avatar/nickname sync, borrow history with status filters
- **Admin dashboard** — Statistics overview with clickable navigation cards
- **Admin book management** — CRUD, category assignment, sorting by title/author/date
- **Admin borrow management** — Create borrows for users, confirm returns, overdue tracking
- **Admin user management** — View users, change roles (Admin/User), delete users
- **Admin category management** — Organize books by category
- **i18n** — Full Chinese/English language toggle across all pages
- **Custom TabBar** — Black rounded tab bar with icon labels

## Screenshots

| Home | Search | Book Detail | Library |
|------|--------|-------------|---------|
| Date header + avatar, new arrivals, popular books, my borrows | Category filters, search bar | Centered cover, stock bar, info cards | Status filter tabs, borrow records |

## Design

UI inspired by [Library App Design Concept](https://www.figma.com/community/file/CTLBMVnHLEKipHFYsMNTFw) — minimal white/gray palette, rounded cards, black accent buttons, centered book covers.

## Tech Stack

- **Frontend**: WeChat Mini Program (WXML/WXSS/JS)
- **Backend**: NestJS + Prisma ORM + MySQL
- **Auth**: JWT with WeChat login (mock mode available for development)

## Project Structure

```
├── miniapp/                # WeChat Mini Program frontend
│   ├── pages/              # App pages (home, books, book-detail, my-borrows, admin-*)
│   ├── custom-tab-bar/     # Custom black tab bar component
│   ├── components/         # Reusable components (book-card, section-header)
│   ├── utils/              # Shared utilities
│   │   ├── request.js      # HTTP request wrapper
│   │   ├── auth.js         # Login/auth helpers
│   │   ├── format.js       # Date/status formatting
│   │   └── i18n.js         # Chinese/English translations
│   └── images/             # Static assets (icons, default covers)
├── backend/                # NestJS backend API
│   ├── src/                # Source code (modules: auth, books, borrow-records, users, categories)
│   ├── prisma/             # Database schema
│   └── .env                # Environment config (not committed)
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
3. Update `miniapp/utils/request.js` with your backend URL (e.g. your LAN IP)
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

Set `MOCK_WECHAT=true` for local development without a real WeChat AppID.

## License

MIT
