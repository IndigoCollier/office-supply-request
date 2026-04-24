# Office Supply Request System

> **Status:** Deployed  
> **Author:** Indigo Collier  
> **Demo Date:** April 27, 2026

A full-stack internal tool for submitting and managing office supply requests — built with Next.js, TypeScript, and Firebase.

**Live URL:** https://office-supply-request.vercel.app

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

- Node.js 22+
- A Firebase project with Authentication and Firestore enabled
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

Two accounts are available for testing and demo:

| Role     | Email             | Password   |
| -------- | ----------------- | ---------- |
| Employee | employee@test.com | TestPass1! |
| Manager  | manager@test.com  | TestPass1! |

---

## Project Structure

```
office-supply-request/
├── app/
│   ├── (auth)/             # Login and signup pages
│   ├── api/                # API route handlers (validation + service calls only)
│   ├── employee/           # Employee dashboard and request form
│   └── manager/            # Manager dashboard (role-protected)
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

See `docs/architecture.drawio.png` for the full system diagram showing Client, Middleware, and Database layers with data flow.

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

## Deploying to Vercel

1. Push your branch to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add all environment variables from `.env.example` under Project Settings → Environment Variables
4. After the first deploy, add your `.vercel.app` URL to Firebase Console → Authentication → Settings → Authorized Domains
5. Vercel will automatically redeploy on every push to the connected branch
