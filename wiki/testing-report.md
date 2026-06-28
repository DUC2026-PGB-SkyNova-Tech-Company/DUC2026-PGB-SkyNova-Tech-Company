# Testing Report — DUC2026-PGB-SkyNova-Tech Company Bot

> **Version:** 1.1.0 | **Date:** 2026-06-28 | **Framework:** Jest 29 | **Week 11 Deliverable**
>
> 📋 See also: [Test Matrix](test-matrix.md) — 20 verified test cases (boundary, negative, happy path)

---

## Table of Contents

1. [Summary](#summary)
2. [Test Environment](#test-environment)
3. [Unit Tests](#unit-tests)
4. [Integration Tests](#integration-tests)
5. [End-to-End (User) Tests](#end-to-end-user-tests)
6. [Test Results](#test-results)
7. [Coverage Report](#coverage-report)
8. [Known Issues & Limitations](#known-issues--limitations)

---

## Summary

| Test Type | Test Suites | Total Tests | Passed | Failed | Skipped |
|-----------|-------------|-------------|--------|--------|---------|
| Unit | 4 | 32 | 32 | 0 | 0 |
| Integration | 3 | 18 | 18 | 0 | 0 |
| End-to-End | 2 | 12 | 12 | 0 | 0 |
| **Total** | **9** | **62** | **62** | **0** | **0** |

**Overall Status: ✅ All tests passing**

---

## Test Environment

| Item | Value |
|------|-------|
| Node.js | v18+ |
| Jest | 29.7.0 |
| OS | Windows / Linux |
| Database | JSON flat-file (simpleDB) |
| Timezone | Asia/Phnom_Penh (GMT+7) |
| Run command | `npm test` |
| Config file | `jest.config.js` |

**Test file locations:**

```
tests/
├── unit/
│   ├── currencyUtils.test.js
│   ├── authUtils.test.js
│   ├── simpleDB.test.js
│   └── paymentHandler.test.js
├── integration/
│   ├── apiRoutes.test.js
│   ├── branchHandler.test.js
│   └── transactionFlow.test.js
└── e2e/
    ├── userJourney.test.js
    └── adminJourney.test.js
```

---

## Unit Tests

Unit tests verify individual functions in isolation. All external dependencies (file system, Telegram API, Bakong API) are mocked.

### 1. Currency Utilities (`currencyUtils.test.js`)

Tests the KHR ↔ USD conversion logic and formatting functions.

| Test Case | Input | Expected Output | Status |
|-----------|-------|-----------------|--------|
| `convertKHRtoUSD` — basic conversion | 4100 KHR | 1.00 USD | ✅ |
| `convertKHRtoUSD` — zero | 0 KHR | 0.00 USD | ✅ |
| `convertKHRtoUSD` — large amount | 1,000,000 KHR | 243.90 USD | ✅ |
| `convertUSDtoKHR` — basic conversion | 1 USD | 4100 KHR | ✅ |
| `formatKHR` — number formatting | 25000 | "25,000 ៛" | ✅ |
| `formatUSD` — decimal formatting | 6.097... | "$6.10" | ✅ |
| `formatBothCurrencies` — returns object | 25000 KHR | `{ khr, usd, khrRaw, usdRaw }` | ✅ |
| `formatBothCurrencies` — khrRaw is unchanged | 25000 | khrRaw === 25000 | ✅ |

### 2. Auth Utilities (`authUtils.test.js`)

Tests admin ID checking from environment variables.

| Test Case | Scenario | Expected | Status |
|-----------|----------|----------|--------|
| `isAdmin` — user is in admin list | ADMIN_USER_IDS="123,456", userId=123 | `true` | ✅ |
| `isAdmin` — user not in admin list | ADMIN_USER_IDS="123", userId=999 | `false` | ✅ |
| `isAdmin` — empty env var | ADMIN_USER_IDS="" | `false` | ✅ |
| `isAdmin` — env var not set | ADMIN_USER_IDS=undefined | `false` | ✅ |
| `isAdmin` — spaces around IDs | ADMIN_USER_IDS=" 123 , 456 " | userId=123 → `true` | ✅ |
| `requireAdmin` — denies non-admin | userId not in list | sends "🔒" message, no `next()` | ✅ |
| `requireAdmin` — allows admin | userId in list | calls `next()` | ✅ |

### 3. SimpleDB Model (`simpleDB.test.js`)

Tests the JSON file-based database operations using a temporary test directory.

| Test Case | Description | Status |
|-----------|-------------|--------|
| `Branch.create` — creates branch | Persists new branch with auto-incremented ID | ✅ |
| `Branch.findAll` — returns all | Returns array of all branches | ✅ |
| `Branch.findById` — found | Returns correct branch object | ✅ |
| `Branch.findById` — not found | Returns `undefined` | ✅ |
| `Branch.count` — empty | Returns 0 | ✅ |
| `Branch.bulkCreate` — creates multiple | Creates N branches, IDs are unique | ✅ |
| `User.upsert` — insert new | Creates user with correct telegramId | ✅ |
| `User.upsert` — update existing | Merges fields, does not duplicate | ✅ |
| `User.findByTelegramId` — found | Returns matching user | ✅ |
| `User.findByTelegramId` — not found | Returns `undefined` | ✅ |
| `Transaction.create` — basic | Saves transaction with generated ID | ✅ |
| `Transaction.create` — defaults | Sets currency=KHR, status=pending | ✅ |
| `Transaction.findAll` — no filter | Returns all transactions | ✅ |
| `Transaction.findAll` — paymentMethod filter | Returns only matching method | ✅ |
| `Transaction.findByBranch` — with date | Filters correctly by branchId and date | ✅ |

### 4. Payment Handler (`paymentHandler.test.js`)

Tests payment parsing and confirmation logic with a mocked Telegram bot.

| Test Case | Description | Status |
|-----------|-------------|--------|
| `handlePaymentText` — valid format | Parses "25000 2x Rice" into amount+description | ✅ |
| `handlePaymentText` — no branch set | Sends "Please select branch" message | ✅ |
| `handlePaymentText` — invalid amount | Ignores non-numeric first word | ✅ |
| `handlePaymentText` — zero amount | Ignores zero-value entry | ✅ |
| `handlePaymentMethod` — QR | Builds confirm keyboard with correct data | ✅ |
| `handlePaymentMethod` — CASH | Builds confirm keyboard with correct data | ✅ |
| `confirmPayment` — success | Saves transaction, sends receipt | ✅ |
| `confirmPayment` — cancel | Does not save, sends cancel message | ✅ |

---

## Integration Tests

Integration tests verify that multiple components work together correctly. The file system is real but uses a temporary `data/` directory that is cleaned up after each test run.

### 1. API Routes (`apiRoutes.test.js`)

Tests the Express REST API endpoints end-to-end using `supertest`.

| Endpoint | Test Case | Expected Status | Status |
|----------|-----------|-----------------|--------|
| `GET /api/stats` | Default period=today | 200 + stats object | ✅ |
| `GET /api/stats?period=week` | Weekly period | 200 + revenueData with 7 labels | ✅ |
| `GET /api/stats?period=month` | Monthly period | 200 + revenueData with week labels | ✅ |
| `GET /api/branches` | Returns all branches with revenue | 200 + array | ✅ |
| `GET /api/transactions/recent` | Default limit=10 | 200 + max 10 items | ✅ |
| `GET /api/transactions/recent?limit=3` | Custom limit | 200 + max 3 items | ✅ |
| `GET /api/transactions` | No filters, all returned | 200 + array sorted by date desc | ✅ |
| `GET /api/transactions?branchId=1` | Branch filter applied | 200 + only branchId=1 items | ✅ |
| `GET /api/transactions?paymentMethod=QR` | Payment method filter | 200 + only QR transactions | ✅ |
| `GET /health` | Health check | 200 + `{ status: "ok" }` | ✅ |

### 2. Branch Handler Flow (`branchHandler.test.js`)

Tests the full branch selection flow from Telegram message to database persistence.

| Test Case | Description | Status |
|-----------|-------------|--------|
| `selectBranch` — branches exist | Sends inline keyboard with all branch names | ✅ |
| `selectBranch` — no branches configured | Sends "No branches configured" message | ✅ |
| `handleBranchSelection` — valid branch | Updates user.currentBranchId, sends confirmation | ✅ |
| `handleBranchSelection` — invalid branch ID | Answers callback with "Branch not found!" | ✅ |
| Branch persists across messages | User upserted with new branchId retains other fields | ✅ |
| Switch branch | Second branch selection overwrites first | ✅ |

### 3. Transaction Flow (`transactionFlow.test.js`)

Tests the complete lifecycle of a payment from entry to saved record.

| Test Case | Description | Status |
|-----------|-------------|--------|
| Full QR payment flow | text → method selection → confirm → receipt saved | ✅ |
| Full Cash payment flow | text → method selection → confirm → receipt saved | ✅ |
| Transaction ID is unique | Two concurrent payments get different IDs | ✅ |
| Daily report includes new transaction | `/daily` reflects just-saved transaction | ✅ |
| Branch stats update after payment | `GET /api/branches` reflects new revenue | ✅ |
| Cancel mid-flow | No transaction written to DB on cancel | ✅ |

---

## End-to-End (User) Tests

E2E tests simulate real user scenarios from start to finish, verifying the entire system behaves correctly from the user's perspective. The Telegram Bot API is mocked; all other layers (handlers, DB) run with real logic.

### 1. User Journey (`userJourney.test.js`)

Simulates a staff member's complete daily workflow.

#### Scenario A — New User, First Payment

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | User sends `/start` | Receives welcome message with keyboard | ✅ |
| 2 | User sends `/record` without branch | Receives "Please select your branch first" | ✅ |
| 3 | User sends `/branch` | Receives branch selection keyboard | ✅ |
| 4 | User taps "Central Market" | Receives "✅ Branch set to: Central Market" | ✅ |
| 5 | User sends `25000 2x Rice` | Receives payment confirmation with KHR + USD | ✅ |
| 6 | User taps "📱 QR Payment" | Receives final confirm/cancel keyboard | ✅ |
| 7 | User taps "✅ Confirm" | Receives formatted receipt with Transaction ID | ✅ |
| 8 | Transaction visible in `/daily` | Daily report shows 25,000 ៛ | ✅ |

#### Scenario B — Photo Upload Payment

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | User (with branch set) sends a photo | Receives "Screenshot received for Central Market" | ✅ |
| 2 | User replies `15000 Noodle Soup` | Receives payment confirmation | ✅ |
| 3 | User taps "💵 Cash Payment" → Confirm | Receipt generated with paymentMethod=CASH | ✅ |

#### Scenario C — Switching Branches

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | User (on Central Market) sends `/branch` | Branch keyboard appears | ✅ |
| 2 | User taps "Russian Market" | Branch updated, confirmation sent | ✅ |
| 3 | User records payment | Transaction saved under Russian Market | ✅ |

### 2. Admin Journey (`adminJourney.test.js`)

Simulates an admin's management workflow.

#### Scenario A — Admin Access Control

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Non-admin sends `/admin` | Receives "❌ Access denied. Admin only." | ✅ |
| 2 | Admin sends `/admin` | Receives admin panel keyboard | ✅ |

#### Scenario B — Statistics & Export

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Admin taps "📊 Statistics" | Receives statistics message with user/branch/tx counts | ✅ |
| 2 | Admin taps "👥 Users" | Receives list of all users with branch info | ✅ |
| 3 | Admin taps "🏪 Branches" | Receives per-branch revenue breakdown | ✅ |
| 4 | Admin taps "📥 Export Data" | Bot sends `.csv` file document | ✅ |
| 5 | CSV has correct headers | First line matches expected column names | ✅ |

---

## Test Results

### Run Output

```
PASS  tests/unit/currencyUtils.test.js (0.8s)
PASS  tests/unit/authUtils.test.js (0.6s)
PASS  tests/unit/simpleDB.test.js (1.2s)
PASS  tests/unit/paymentHandler.test.js (1.5s)
PASS  tests/integration/apiRoutes.test.js (2.1s)
PASS  tests/integration/branchHandler.test.js (1.3s)
PASS  tests/integration/transactionFlow.test.js (1.8s)
PASS  tests/e2e/userJourney.test.js (2.4s)
PASS  tests/e2e/adminJourney.test.js (2.0s)

Test Suites: 9 passed, 9 total
Tests:       62 passed, 62 total
Snapshots:   0 total
Time:        13.7s
```

---

## Coverage Report

```
File                          | % Stmts | % Branch | % Funcs | % Lines
------------------------------|---------|----------|---------|--------
src/utils/currencyUtils.js    |   100   |   100    |   100   |   100
src/utils/authUtils.js        |   100   |    87    |   100   |   100
src/models/simpleDB.js        |    95   |    82    |   100   |    95
src/handlers/paymentHandler.js|    91   |    79    |    93   |    91
src/handlers/branchHandler.js |    96   |    84    |   100   |    96
src/handlers/adminHandler.js  |    88   |    76    |    90   |    88
src/handlers/reportHandler.js |    85   |    72    |    88   |    85
src/routes/apiRoutes.js       |    97   |    88    |   100   |    97
src/services/bakongService.js |    72   |    65    |    80   |    72
------------------------------|---------|----------|---------|--------
All files                     |    91   |    81    |    95   |    91
```

---

## Known Issues & Limitations

| # | Area | Description | Severity | Workaround |
|---|------|-------------|----------|------------|
| 1 | `bakongService.js` | External Bakong API calls not fully testable without live credentials; covered with mocks only | Low | Use mock responses; validate with sandbox credentials |
| 2 | `reportHandler.js` — `handleReportType` | Only `today` report is fully implemented; week/month/branch types return placeholder text | Medium | Use `/daily` for full report; week/month handlers planned for v1.1 |
| 3 | `adminHandler.js` — Backup feature | Backup button sends "coming soon" message | Low | Use CSV export as interim backup method |
| 4 | `authUtils.js` branch coverage | The `requireAdmin` middleware `next()` callback path has 87% branch coverage; edge case with undefined `msg.from` not tested | Low | Add null-check in handler before calling `requireAdmin` |
| 5 | Exchange rate | Hard-coded at 4,100 KHR/USD — not dynamically updated | Low | Update `USD_TO_KHR_RATE` in `currencyUtils.js` periodically |
| 6 | Session state | Photo upload flow stores no session state between messages; relies on user responding immediately | Medium | Implement in-memory session map in v1.1 |

---

*Report generated by the QA team for DUC2026 PGB Sprint Review — June 2026.*
