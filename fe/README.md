# 🖥️ Auth Starter — Frontend

Next.js 15 frontend for the Auth Starter project. Connects to the NestJS GraphQL backend using Apollo Client.

**Stack:** Next.js 15 · React 19 · Apollo Client · Tailwind CSS v4 · TypeScript

---

## Setup

```bash
npm install
npm run dev
```

> **Prerequisite:** The backend must be running at `http://localhost:3001`. See `../be/README.md`.

Open **http://localhost:3000** to get started.

---

## Pages & Auth Flow

```
/           →  Landing page (links to Login & Sign Up)
/signup     →  Create account (email + password)
/verify-otp →  Enter OTP sent to email
/login      →  Log in with credentials
/dashboard  →  View user info + logout
```

**Flow:** Landing → Sign Up → Verify OTP → Login → Dashboard

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (wraps with ApolloProvider)
│   ├── page.tsx            # Landing page
│   ├── signup/page.tsx     # Sign up form
│   ├── verify-otp/page.tsx # OTP verification form
│   ├── login/page.tsx      # Login form
│   ├── dashboard/page.tsx  # User info dashboard
│   └── globals.css         # Global styles
├── graphql/
│   ├── mutations.ts        # SIGNUP, LOGIN, VERIFY_OTP, RESEND_OTP
│   └── queries.ts          # ME query
└── lib/
    ├── apollo.ts           # Apollo Client (with JWT auth header)
    ├── ApolloWrapper.tsx   # Client-side ApolloProvider
    └── getErrorMessage.ts  # Extracts readable errors from GraphQL responses
```

---

## How It Works

- **Apollo Client** (`lib/apollo.ts`) connects to `http://localhost:3001/graphql` and attaches the JWT token from `localStorage` as a `Bearer` header on every request.

- **ApolloWrapper** (`lib/ApolloWrapper.tsx`) is a `"use client"` component that wraps the app with `ApolloProvider` — required because Apollo Client is client-side only in Next.js App Router.

- **Auth token** is stored in `localStorage` on signup/login and removed on logout. All authenticated requests (like the `me` query) use this token automatically.

- **Error handling** (`lib/getErrorMessage.ts`) extracts the actual validation messages from NestJS GraphQL errors (e.g., password requirements) instead of showing generic "Bad Request Exception".

---

## Customization

| What | Where |
|------|-------|
| Backend URL | `src/lib/apollo.ts` — change the `uri` |
| Add new queries/mutations | `src/graphql/` |
| Styling | `src/app/globals.css` |
| Token storage | `src/lib/apollo.ts` — swap `localStorage` for cookies if needed |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (http://localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
