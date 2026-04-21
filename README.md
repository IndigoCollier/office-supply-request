# Office Supply Request System

> **Status:** In Development  
> **Author:** Indigo Collier
> **Demo Date:** April 27, 2026

This is a Full-stack internal tool for submitting and managing office supply requests — built with Next.js, TypeScript, and Firebase.

---

## Tech Stack

| Layer      | Technology                                                   |
| ---------- | ------------------------------------------------------------ |
| Frontend   | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend    | Next.js API Routes                                           |
| Database   | Firebase Firestore                                           |
| Auth       | Firebase Authentication                                      |
| Deployment | Vercel                                                       |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Auth and Firestore enabled
- A Vercel account (for deployment)

### 1. Clone the repo

```bash
git clone https://github.com/IndigoCollier/office-supply-request
cd office-supply-request
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your Firebase config values. See [Environment Variables](#environment-variables) below.

### 4. Run locally

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

---

## Environment Variables

| Variable                                   | Description                  |
| ------------------------------------------ | ---------------------------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`             | Firebase project API key     |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | Firebase Auth domain         |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | Firebase project ID          |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | Firebase Storage bucket      |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID`              | Firebase app ID              |

---

## Test Accounts

Two pre-seeded accounts are available for local development and demo:

| Role     | Email             | Password          |
| -------- | ----------------- | ----------------- |
| Employee | employee@test.com | [set in Firebase] |
| Manager  | manager@test.com  | [set in Firebase] |

---

## Project Structure

```
office-supply-request/
├── app/                    # Next.js App Router — pages and API routes
│   ├── api/                # API route handlers (thin — validation + service calls only)
│   ├── dashboard/          # Employee dashboard
│   ├── manager/            # Manager dashboard (role-protected)
│   └── login/              # Auth page
├── components/             # Reusable UI components
├── lib/
│   ├── services/           # Business logic
│   ├── repositories/       # Firestore data access
│   ├── models/             # TypeScript types and Zod schemas
│   └── firebase/           # Firebase client and admin config
├── docs/                   # Project documentation
└── public/                 # Static assets
```

---

## Architecture

See `docs/architecture.drawio` for the full system diagram showing Client, Middleware, and Database layers with data flow.

---

## Running Tests

```bash
npm run test
```

---

## Linting & Formatting

```bash
npm run lint        # Check for linting errors
npm run lint:fix    # Auto-fix linting errors
npm run format      # Format with Prettier
```

---

## Deployment

This app is deployed to Vercel. Every push to `main` triggers an automatic production deployment via GitHub Actions CI.

Live URL: [add after first deploy]
