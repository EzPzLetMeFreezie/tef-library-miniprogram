# Coding Rules and Engineering Constraints

## 1. General
- Use TypeScript in backend
- Keep modules cohesive and small
- Use DTOs for all write endpoints
- Validate input using `class-validator`
- Avoid business logic inside controllers; put it in services
- Write readable code with meaningful names

---

## 2. Backend rules
- Use NestJS modules, controllers, services, DTOs
- Use Prisma for database access
- Prefer Prisma queries over raw SQL
- Use transactions for borrow and return flows
- Implement JWT auth guard
- Implement role guard for admin endpoints
- Throw proper HTTP exceptions with useful messages
- Use pagination for list APIs

### Required guards
- `JwtAuthGuard`
- `RolesGuard`

### Required decorators/helpers
- `@Roles()` decorator
- `@CurrentUser()` custom decorator if useful

---

## 3. Frontend rules
- Keep request logic centralized in one utility
- Store token and user profile locally
- Keep page logic simple and mobile-first
- Extract reusable components for book cards and filters
- Handle loading, empty, and error states
- Avoid hardcoding API URLs in many places

---

## 4. Data and business rules
- Never allow borrow when stock is unavailable
- Never trust frontend role alone
- Never let `availableCount` go negative
- Return should be idempotent-safe by validation
- Disabled books cannot be borrowed

---

## 5. UX rules
- User homepage should feel like a reading app, not a spreadsheet
- Admin pages prioritize efficiency and filters
- Show meaningful toasts after save/borrow/return actions
- Confirmation dialog before destructive actions

---

## 6. Testing suggestions
- Add service-level tests for borrow and return logic if time allows
- At minimum manually verify:
  - login
  - admin CRUD
  - borrow success
  - borrow fail when out of stock
  - return success
  - my records display correctly
