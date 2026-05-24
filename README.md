# Allo Inventory Reservation System

## Overview

This system prevents overselling in multi-warehouse inventory by introducing **temporary reservations** during checkout. When a customer reserves stock, units are held for a limited time before payment is completed.

**Happy path:** Reserve inventory → Confirm payment → Stock is permanently decremented.

**Alternate path:** Reserve inventory → Expire or cancel → Reserved stock is released back to available inventory.

Concurrency-safe locking and idempotent APIs ensure reliable behavior under parallel requests.

---

## Features

- ✓ Multi-warehouse inventory tracking
- ✓ Reservation creation
- ✓ Reservation confirmation
- ✓ Reservation release
- ✓ Reservation expiry
- ✓ Concurrency-safe stock handling
- ✓ Idempotent APIs
- ✓ Responsive UI

---

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| **Frontend** | Next.js, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes, Prisma |
| **Database** | Supabase PostgreSQL |
| **Caching** | Upstash Redis |
| **Deployment** | Vercel |

---

## Architecture

```mermaid
flowchart TB
  Browser[User Browser]
  FE[Next.js Frontend]
  API[API Routes]
  BL[Business Logic]
  Prisma[Prisma ORM]
  DB[(Supabase PostgreSQL)]
  Redis[(Upstash Redis)]
  Cron[Vercel Cron]
  Expire[Reservation Expiry Service]

  Browser --> FE
  FE --> API
  API --> BL
  BL --> Prisma
  Prisma --> DB
  API --> Redis
  Cron --> Expire
  Expire --> BL
```

---

## Reservation Flow

```mermaid
sequenceDiagram
  participant Customer
  participant API as Reserve API
  participant Lock as Inventory Lock
  participant DB as Database

  Customer->>API: Reserve stock
  API->>Lock: SELECT FOR UPDATE
  Lock->>DB: Increment reservedUnits
  DB-->>API: Reservation created (PENDING)
  API-->>Customer: Reservation ID + expiry

  alt Confirm payment
    Customer->>API: Confirm
    API->>DB: Decrement total & reserved units
    DB-->>Customer: CONFIRMED
  else Release or expire
    Customer->>API: Release / Cron expiry
    API->>DB: Decrement reservedUnits
    DB-->>Customer: RELEASED
  end
```

---

## Setup

```bash
git clone <repository-url>
cd inventory-reservation-system
npm install
```

Create a `.env` file:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
```

```bash
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Live Demo

| | Link |
|---|------|
| **Repository** | [GitHub URL](https://github.com/Mahabalan2301/inventory-reservation-system) |
| **Live Application** | [Vercel URL](https://inventory-reservation-system-pji3.vercel.app/) |

---

## Future Improvements

- Real-time WebSocket updates
- Analytics dashboard
- Notifications
