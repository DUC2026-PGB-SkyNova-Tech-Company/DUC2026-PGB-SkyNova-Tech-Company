# Physical ERD — DUC2026-PGB-SkyNova-Tech Company Bot

> **Version:** 1.1.0 | **Database:** JSON flat-file (simpleDB) | **Week 12**

---

## Entity-Relationship Diagram

```
┌──────────────────────────────────┐
│            BRANCH                │
├──────────────────────────────────┤
│ PK  id          INTEGER          │
│     name        VARCHAR(100)     │
│     location    VARCHAR(200)     │
│     isActive    BOOLEAN          │
│     createdAt   TIMESTAMP        │
└──────────────┬───────────────────┘
               │ 1
               │
               │ has many
               │
               │ N
┌──────────────┴───────────────────┐       ┌──────────────────────────────────┐
│          TRANSACTION             │       │              USER                │
├──────────────────────────────────┤       ├──────────────────────────────────┤
│ PK  id                INTEGER   │       │ PK  id            INTEGER        │
│ FK  branchId          INTEGER   │       │     telegramId    BIGINT (unique) │
│ FK  userId            BIGINT    │       │     firstName     VARCHAR(100)   │
│     amount            DECIMAL   │       │     username      VARCHAR(100)   │
│     currency          VARCHAR(3)│       │ FK  currentBranchId INTEGER      │
│     description       TEXT      │       │     isAdmin       BOOLEAN        │
│     paymentMethod     VARCHAR(5)│       │     createdAt     TIMESTAMP      │
│     verificationStatus VARCHAR  │       │     updatedAt     TIMESTAMP      │
│     createdAt         TIMESTAMP │       └──────────────────────────────────┘
└──────────────────────────────────┘
         │                   │
         │ N                 │ N
         │ recorded by       │ assigned to
         │                   │
         └─────── USER ──────┘
                (userId FK)
```

---

## Table Definitions

### BRANCH

| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| `id` | INTEGER | PK, AUTO INCREMENT | Unique branch identifier |
| `name` | VARCHAR(100) | NOT NULL | Branch display name (e.g. "Central Market") |
| `location` | VARCHAR(200) | | Physical location / address |
| `isActive` | BOOLEAN | DEFAULT true | Whether branch is operational |
| `createdAt` | TIMESTAMP | NOT NULL | Record creation time (ISO 8601) |

### USER

| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| `id` | INTEGER | PK, AUTO INCREMENT | Internal user ID |
| `telegramId` | BIGINT | UNIQUE, NOT NULL | Telegram platform user ID |
| `firstName` | VARCHAR(100) | | User's Telegram first name |
| `username` | VARCHAR(100) | | Telegram @username (optional) |
| `currentBranchId` | INTEGER | FK → BRANCH.id | Currently selected branch |
| `isAdmin` | BOOLEAN | DEFAULT false | Admin access flag |
| `createdAt` | TIMESTAMP | NOT NULL | First interaction time |
| `updatedAt` | TIMESTAMP | | Last update time |

### TRANSACTION

| Column | Type | Constraint | Description |
|--------|------|------------|-------------|
| `id` | INTEGER | PK, AUTO INCREMENT | Unique transaction identifier |
| `branchId` | INTEGER | FK → BRANCH.id, NOT NULL | Branch where payment was recorded |
| `userId` | BIGINT | FK → USER.telegramId, NOT NULL | Staff who recorded it |
| `amount` | DECIMAL | NOT NULL, > 0 | Payment amount in KHR |
| `currency` | VARCHAR(3) | DEFAULT 'KHR' | Currency code |
| `description` | TEXT | DEFAULT 'Payment' | Item/order description |
| `paymentMethod` | VARCHAR(5) | NOT NULL, IN ('QR','CASH') | Payment type |
| `verificationStatus` | VARCHAR(10) | DEFAULT 'pending' | pending / verified / failed |
| `createdAt` | TIMESTAMP | NOT NULL | Transaction timestamp (ISO 8601) |

---

## Relationships

| Relationship | Type | Description |
|-------------|------|-------------|
| BRANCH → TRANSACTION | One-to-Many | One branch has many transactions |
| USER → TRANSACTION | One-to-Many | One user records many transactions |
| USER → BRANCH (currentBranchId) | Many-to-One | Many users can be assigned to the same branch |

---

## Data Constraints

| Rule | Enforced By |
|------|------------|
| `amount` must be > 0 | `handlePaymentText()` — returns early if `isNaN(amount) || amount <= 0` |
| `paymentMethod` must be QR or CASH | Inline keyboard only — no freetext input |
| `telegramId` is unique per user | `User.upsert()` — finds by telegramId before insert |
| Transaction ID is monotonically increasing | `Math.max(...ids) + 1` in `Transaction.create()` |
| Branch must exist before transaction | `Branch.findById()` check in `handlePaymentText()` |

---

## Database File Locations

```
data/
├── branches.json      ← BRANCH table
├── users.json         ← USER table
└── transactions.json  ← TRANSACTION table
```

These files are created automatically on first run by `initDatabase()` in `src/models/simpleDB.js`.

> ⚠️ The `data/` folder is in `.gitignore` to prevent production data from being committed.

---

*DUC2026 PGB — SkyNova Tech Company | Week 12 Final Delivery*
