# Library Manager Backend

NestJS + MySQL + Prisma 图书馆管理系统后端。

## 技术栈

- **NestJS** - Node.js 后端框架
- **Prisma** - ORM
- **MySQL** - 数据库
- **JWT** - 身份认证
- **class-validator** - DTO 验证

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

主要配置项：
- `DATABASE_URL` - MySQL 连接字符串
- `JWT_SECRET` - JWT 密钥
- `WECHAT_APPID` - 微信小程序 AppID
- `WECHAT_SECRET` - 微信小程序密钥
- `MOCK_WECHAT` - 是否使用模拟微信登录（开发用）

### 3. 创建数据库

```sql
CREATE DATABASE library_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. 运行数据库迁移

```bash
npx prisma migrate dev --name init
```

### 5. 填充种子数据

```bash
npx prisma db seed
```

### 6. 启动服务

```bash
# 开发模式
npm run start:dev

# 生产模式
npm run build
npm run start:prod
```

服务默认运行在 `http://localhost:3000`。

## API 端点

所有 API 以 `/api` 为前缀。

### 认证
- `POST /api/auth/login` - 微信登录
- `GET /api/auth/profile` - 获取当前用户信息

### 用户
- `GET /api/users/me` - 当前用户信息
- `GET /api/users` - 用户列表（管理员）

### 分类
- `GET /api/categories` - 分类列表
- `POST /api/categories` - 创建分类（管理员）
- `PATCH /api/categories/:id` - 更新分类（管理员）
- `DELETE /api/categories/:id` - 删除分类（管理员）

### 图书
- `GET /api/books` - 图书列表（支持搜索、筛选、分页）
- `GET /api/books/:id` - 图书详情
- `POST /api/books` - 创建图书（管理员）
- `PATCH /api/books/:id` - 更新图书（管理员）
- `DELETE /api/books/:id` - 删除图书（管理员）

### 借阅记录
- `GET /api/borrow-records` - 借阅记录列表（管理员）
- `GET /api/borrow-records/my` - 我的借阅记录
- `POST /api/borrow-records/borrow` - 借阅图书
- `POST /api/borrow-records/return` - 归还图书

### 推荐
- `GET /api/recommendations/home` - 首页推荐数据

### 导入导出
- `POST /api/import/books` - 导入图书（管理员）
- `GET /api/export/books` - 导出图书（管理员）
- `GET /api/export/borrow-records` - 导出借阅记录（管理员）

## 开发测试

Mock 模式下，微信登录的 `code` 参数会直接作为 `openid` 使用：
- 使用 `admin-openid-placeholder` 作为 code 登录管理员
- 使用 `user-openid-placeholder` 作为 code 登录普通用户
