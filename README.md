# finance-api

Backend for a role based finance dashboard. Built with Node.js, Express and MongoDB for backend screening assignment 

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



### transactions

| method | route | access | description |
|--------|-------|--------|-------------|
| GET | /api/transactions | all | list transactions |
| GET | /api/transactions/:id | all | get one |
| POST | /api/transactions | admin | create |
| PATCH | /api/transactions/:id | admin | update |
| DELETE | /api/transactions/:id | admin | soft delete |

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


## testing with postman

download postman from [postman.com](https://postman.com) if you don't have it.

**step 1 — register an admin**

- method: `POST`  
- url: `https://finance-backend-nnql.onrender.com/api/auth/register`  
- body (raw → JSON):
```json
{
  "name": "Raj",
  "email": "raj@test.com",
  "password": "raj123",
  "role": "admin"
}
```

**step 2 — login and copy the token**

- method: `POST`  
- url: `https://finance-backend-nnql.onrender.com/api/auth/login`  
- body:
```json
{
  "email": "raj@test.com",
  "password": "raj123"
}
```

response gives you a `token` — copy it, you'll need it for everything below.

**step 3 — add token to requests**

in postman go to the request → Auth tab → select Bearer Token → paste your token.

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

register a viewer and try to create a transaction with that token — you should get:
```json
{ "message": "you don't have access to do this" }
```

---

## notes / assumptions

- delete is soft — sets a `deleted` flag, record stays in db
- analysts and viewers have the same read access for now, analyst role is there if you want to extend it later
- no email verification, kept it simple
- for production: swap MONGO_URI to Atlas, set a strong JWT_SECRET, done

---

## deployment

hosted on Render. live URL: https://finance-backend-nnql.onrender.com
