# finance-api

Backend for a role-based finance dashboard. Built with Node.js, Express and MongoDB as part of a backend screening assignment.

---

## stack

- Node.js + Express
- MongoDB + Mongoose
- JWT for auth
- bcryptjs for password hashing

---

## local setup

```bash
git clone https://github.com/Raj-10-Singh/Finance-Backend.git
cd finance-api
npm install
cp .env.example .env
npm run dev
```

open `.env` and fill in your values:

```
MONGO_URI=mongodb://localhost:27017/finance_app
JWT_SECRET=any_long_random_string
```

make sure MongoDB is running locally before starting.

---

## roles

| role | what they can do |
|------|-----------------|
| viewer | view transactions and dashboard only |
| analyst | same as viewer |
| admin | everything — create, update, delete records and manage users |

---

## api routes

all protected routes need `Authorization: Bearer <token>` in the header.

### auth

| method | route | access | what it does |
|--------|-------|--------|-------------|
| POST | /api/auth/register | public | create account |
| POST | /api/auth/login | public | login, returns token |
| GET | /api/auth/me | any | get your own profile |

### transactions

| method | route | access | what it does |
|--------|-------|--------|-------------|
| GET | /api/transactions | any | list transactions |
| GET | /api/transactions/:id | any | get one transaction |
| POST | /api/transactions | admin | create a transaction |
| PATCH | /api/transactions/:id | admin | update a transaction |
| DELETE | /api/transactions/:id | admin | soft delete |

filtering via query params:

```
?type=income
?category=food
?startDate=2024-01-01&endDate=2024-06-30
?page=1&limit=20
```

valid types: `income`, `expense`

valid categories: `salary`, `freelance`, `food`, `rent`, `transport`, `utilities`, `health`, `other`

### dashboard

all roles can access these.

| method | route | what it returns |
|--------|-------|----------------|
| GET | /api/dashboard/summary | total income, expenses, net balance |
| GET | /api/dashboard/categories | breakdown by category |
| GET | /api/dashboard/monthly | monthly trend — pass `?months=6` |
| GET | /api/dashboard/recent | recent transactions — pass `?limit=10` |

### users (admin only)

| method | route | what it does |
|--------|-------|-------------|
| GET | /api/users | list all users |
| PATCH | /api/users/:id/role | change a user's role |
| PATCH | /api/users/:id/status | set active or inactive |

---

## testing with postman

download postman from [postman.com](https://postman.com) if you don't have it already.

**step 1 — register an admin**

- method: `POST`
- url: `https://finance-backend-nnql.onrender.com/api/auth/register`
- body (raw → JSON):

```json
{
  "name": "Raj Singh",
  "email": "raj@finance.dev",
  "password": "raj@1234",
  "role": "admin"
}
```

**step 2 — login and copy the token**

- method: `POST`
- url: `https://finance-backend-nnql.onrender.com/api/auth/login`
- body:

```json
{
  "email": "raj@finance.dev",
  "password": "raj@1234"
}
```

response gives back a `token` — copy it, you need it for all requests below.

**step 3 — add token to requests**

in postman open the request → go to Auth tab → select Bearer Token → paste your token there.

**step 4 — create a transaction (admin only)**

- method: `POST`
- url: `https://finance-backend-nnql.onrender.com/api/transactions`
- body:

```json
{
  "amount": 50000,
  "type": "income",
  "category": "salary",
  "date": "2024-06-01",
  "notes": "june salary"
}
```

**step 5 — test access control**

register a viewer account and try to hit the create transaction route with that token. you should get back:

```json
{ "message": "you don't have access to do this" }
```

that confirms role-based access is working.

---

## test accounts (live)

already registered on the hosted API — use these directly:

| role | email | password |
|------|-------|----------|
| admin | raj@finance.dev | raj@1234 |
| analyst | analyst@finance.dev | analyst@1234 |
| viewer | viewer@finance.dev | viewer@1234 |

---

## notes

- delete is soft — sets a `deleted: true` flag, nothing is actually removed from the db
- analyst and viewer have the same read access for now, kept it simple since the requirement said "may" for analyst
- no email format validation, mongoose handles the duplicate check
- didn't add input sanitization on the PATCH /transactions route — noted it but keeping scope tight

---

## live api

`https://finance-backend-nnql.onrender.com`

