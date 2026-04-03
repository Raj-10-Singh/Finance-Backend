# finance-api

Backend for a role based finance dashboard. Built with Node.js, Express and MongoDB.

---

## stack

- Node.js + Express
- MongoDB + Mongoose
- JWT for auth
- bcryptjs for password hashing

---

## setup

```bash
git clone <your-repo-url>
cd finance-api
npm install
cp .env
npm run dev
```

make sure MongoDB is running locally before starting.

---

## roles

| role | what they can do |
|------|-----------------|
| viewer | view transactions and dashboard |
| analyst | same as viewer |
| admin | everything — create, edit, delete records, manage users |

---

## api

all protected routes need Authorization: Bearer <token> in the header.

### auth

| method | route | access | description |
|--------|-------|--------|-------------|
| POST | /api/auth/register | public | create account |
| POST | /api/auth/login | public | login, get token |
| GET | /api/auth/me | auth | get your own profile |

register body:
```json
{
  "name": "Rahul",
  "email": "rahul@example.com",
  "password": "password123",
  "role": "analyst"
}
```

login returns a `token` — use it as `Authorization: Bearer <token>` for all other requests.

---

### transactions

| method | route | access | description |
|--------|-------|--------|-------------|
| GET | /api/transactions | all | list transactions |
| GET | /api/transactions/:id | all | get one |
| POST | /api/transactions | admin | create |
| PATCH | /api/transactions/:id | admin | update |
| DELETE | /api/transactions/:id | admin | soft delete |

filtering (query params):
```
?type=income
?category=food
?startDate=2024-01-01&endDate=2024-06-30
?page=1&limit=20
```

valid types: `income`, `expense`  
valid categories: `salary`, `freelance`, `food`, `rent`, `transport`, `utilities`, `health`, `other`

---

### dashboard

all roles can access these.

| method | route | description |
|--------|-------|-------------|
| GET | /api/dashboard/summary | total income, expenses, net balance |
| GET | /api/dashboard/categories | totals by category |
| GET | /api/dashboard/monthly | monthly breakdown (pass ?months=6) |
| GET | /api/dashboard/recent | last N transactions (pass ?limit=10) |

---

### users (admin only)

| method | route | description |
|--------|-------|-------------|
| GET | /api/users | list all users |
| PATCH | /api/users/:id/role | change role |
| PATCH | /api/users/:id/status | set active or inactive |

---

## notes / assumptions

- delete is soft — sets a `deleted` flag, record stays in db
- analysts and viewers have the same read access for now, analyst role is there if you want to extend it later
- no email verification, kept it simple
- for production: swap MONGO_URI to Atlas, set a strong JWT_SECRET, done

---

## deployment

hosted on Render. live URL: `<add after deploying>`
