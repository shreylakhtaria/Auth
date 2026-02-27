# 🔐 Auth Starter — Next.js + NestJS + GraphQL + MongoDB

A full-stack authentication boilerplate. Clone it, configure it, and start building with auth already handled.

**Stack:** Next.js 15 · NestJS · Apollo GraphQL · MongoDB · Tailwind CSS

---

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url> my-app
cd my-app

# Install backend
cd be && npm install

# Install frontend
cd ../fe && npm install
```

### 2. Configure Backend Environment

```bash
cd be
cp .env.example .env
```

Edit `be/.env` with your values:

```env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-random-secret-min-32-characters
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
PORT=3001
FRONTEND_URL=http://localhost:3000
```

> **Tip:** Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a free cloud DB. For Gmail, generate an [App Password](https://support.google.com/accounts/answer/185833).

### 3. Run

```bash
# Terminal 1 — Backend (http://localhost:3001)
cd be && npm run start:dev

# Terminal 2 — Frontend (http://localhost:3000)
cd fe && npm run dev
```

Open **http://localhost:3000** → Sign Up → Verify OTP → Login → Dashboard.

---

## Features

- **Signup** with email + password (validation enforced)
- **OTP verification** via email (Nodemailer)
- **Login** with JWT authentication
- **Dashboard** showing current user info
- **Role-based** access control (USER / ADMIN)
- **Password hashing** with bcrypt (12 rounds)
- **Auto-cleanup** of expired tokens (scheduled)
- **GraphQL Playground** at `http://localhost:3001/graphql`

---

## GraphQL API

All mutations and queries available:

```graphql
# Sign up
mutation {
  signup(signupInput: { email: "user@example.com", password: "Password123!" }) {
    token
    user { id email role isVerified }
  }
}

# Verify OTP
mutation {
  verifyOtp(verifyOtpInput: { email: "user@example.com", otp: "123456" }) {
    success
    message
  }
}

# Resend OTP
mutation {
  resendOtp(resendOtpInput: { email: "user@example.com" })
}

# Login
mutation {
  login(loginInput: { email: "user@example.com", password: "Password123!" }) {
    token
    user { id email role isVerified }
  }
}

# Get current user (requires Authorization: Bearer <token>)
query {
  me { email role isVerified createdAt }
}
```

**Password requirements:** Min 8 characters, uppercase, lowercase, number, and special character.

---

## Project Structure

```
├── be/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/       # Auth service, resolver, guards, email, JWT
│   │   ├── user/       # User schema, service
│   │   └── config/     # Environment validation
│   ├── .env.example
│   └── package.json
│
├── fe/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/        # Pages (signup, login, verify-otp, dashboard)
│   │   ├── graphql/    # Queries & mutations
│   │   └── lib/        # Apollo client setup
│   └── package.json
│
└── docs/               # API documentation
```

---

## Customization

| What | Where |
|------|-------|
| Add roles | `be/src/user/schema/user.schema.ts` |
| JWT expiry | `be/src/auth/auth.module.ts` |
| Email templates | `be/src/auth/email.service.ts` |
| GraphQL endpoint URL | `fe/src/lib/apollo.ts` |

---

## License

MIT — use it however you want.
