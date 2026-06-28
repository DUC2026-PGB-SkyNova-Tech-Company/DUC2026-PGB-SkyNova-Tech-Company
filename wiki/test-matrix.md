# Test Matrix — DUC2026-PGB-SkyNova-Tech Company Bot

> **Version:** 1.1.0 | **Date:** 2026-06-28 | **Framework:** Jest 29 | **Week 11 Deliverable**

---

## Table of Contents

1. [Overview](#overview)
2. [Test Matrix — 20 Verified Test Cases](#test-matrix--20-verified-test-cases)
3. [Boundary Tests](#boundary-tests)
4. [Negative / Attack Scenarios](#negative--attack-scenarios)
5. [Happy Path Scenarios](#happy-path-scenarios)
6. [Zero-Crash Verification](#zero-crash-verification)
7. [Full Test Run Output](#full-test-run-output)
8. [Coverage Summary](#coverage-summary)

---

## Overview

This page is the **complete verification log** for the SkyNova Vendor Bot as required for Week 11. It covers at least 15 distinct test cases across three categories:

- **Boundary tests** — edge values at the limits of valid input
- **Negative scenarios** — invalid, malicious, or unexpected inputs the bot must reject gracefully
- **Happy path scenarios** — correct normal usage flows from start to finish

All tests were executed with `npm test` using Jest 29. The bot must process or reject every scenario **without crashing the server**.

---

## Test Matrix — 20 Verified Test Cases

| # | Category | Test Case | Input | Expected Result | Status |
|---|----------|-----------|-------|-----------------|--------|
| 1 | Happy Path | New user `/start` | `/start` command | Welcome message + main keyboard shown | ✅ PASS |
| 2 | Happy Path | Branch selection | Tap `🏪 Central Market` button | `✅ Branch set to: Central Market` | ✅ PASS |
| 3 | Happy Path | Valid QR payment | `25000 2x Rice` → QR → Confirm | Receipt with Transaction ID generated | ✅ PASS |
| 4 | Happy Path | Valid cash payment | `15000 Noodle Soup` → Cash → Confirm | Receipt with `paymentMethod: CASH` | ✅ PASS |
| 5 | Happy Path | Photo upload flow | Send KHQR screenshot → `25000 Rice` → Confirm | Receipt saved successfully | ✅ PASS |
| 6 | Happy Path | Switch branch mid-session | `/branch` → tap different branch | New branch confirmed, next transaction uses new branch | ✅ PASS |
| 7 | Happy Path | Daily report | `/daily` | Shows today's totals with KHR + USD breakdown | ✅ PASS |
| 8 | Happy Path | Cancel payment | `25000 Rice` → QR → ❌ Cancel | No transaction saved, cancel message shown | ✅ PASS |
| 9 | Happy Path | Admin access | Admin ID sends `/admin` | Admin panel keyboard shown | ✅ PASS |
| 10 | Happy Path | CSV export | Admin taps `📥 Export Data` | `.csv` file sent to chat | ✅ PASS |
| 11 | Boundary | Minimum valid amount | `1 item` | Payment confirmation shown (1 KHR) | ✅ PASS |
| 12 | Boundary | Very large amount | `999999999 bulk order` | Payment confirmation shown, no overflow error | ✅ PASS |
| 13 | Boundary | Amount with no description | `25000` (no text after) | Uses default description "Payment" | ✅ PASS |
| 14 | Boundary | Amount exactly 0 | `0 test` | Silently ignored — no confirmation shown | ✅ PASS |
| 15 | Boundary | KHR/USD conversion boundary | `4100` KHR | Displays `$1.00` USD exactly | ✅ PASS |
| 16 | Negative | Random text with no amount | `hello world` | Bot ignores message — no error, no crash | ✅ PASS |
| 17 | Negative | Record without branch set | `/record` (no branch selected) | `⚠️ Please select your branch first` message | ✅ PASS |
| 18 | Negative | Non-admin tries `/admin` | Non-admin ID sends `/admin` | `❌ Access denied. Admin only.` message | ✅ PASS |
| 19 | Negative | Unusual string injection | `<script>alert(1)</script>` | Treated as non-payment text, silently ignored | ✅ PASS |
| 20 | Negative | Multi-click double confirm | Tap `✅ Confirm` twice rapidly | Only one transaction saved — second tap is idempotent | ✅ PASS |

---

## Boundary Tests

Boundary tests verify that the bot handles values at the extreme edges of its valid input range.

### TC-11: Minimum Valid Amount (1 KHR)

```
Input:     "1 item"
Expected:  Payment confirmation shows 1 ៛ / $0.00
Actual:    ✅ Confirmation shown, $0.00 USD displayed
```

**Why it matters:** Ensures the parser does not reject amounts close to zero that are still positive.

---

### TC-12: Very Large Amount

```
Input:     "999999999 bulk order"
Expected:  Payment confirmation shows 999,999,999 ៛ / $243,902.44
Actual:    ✅ No integer overflow, amounts formatted correctly
```

**Why it matters:** Prevents NaN or Infinity errors from JavaScript number limits.

---

### TC-13: Amount With No Description

```
Input:     "25000"  (no words after the number)
Expected:  Description defaults to "Payment"
Actual:    ✅ Receipt shows Description: Payment
```

**Why it matters:** The bot should not crash when `parts.slice(1).join(' ')` returns an empty string.

---

### TC-14: Amount of Zero

```
Input:     "0 test item"
Expected:  Bot silently ignores — no message sent
Actual:    ✅ No response from bot, no crash
```

**Why it matters:** Zero-value transactions would corrupt daily totals.

---

### TC-15: KHR/USD Conversion Boundary

```
Input:     4100 KHR
Expected:  $1.00 USD (exact boundary of the 4100 rate)
Actual:    ✅ formatKHR returns "4,100 ៛", formatUSD returns "$1.00"
```

---

## Negative / Attack Scenarios

These tests verify the bot remains stable when a user (or instructor) intentionally sends invalid, random, or attack-style inputs.

### TC-16: Random Text (No Amount)

```
Input:     "hello world"
Input:     "random text !!@@##"
Input:     "what is this bot"
Expected:  Bot ignores — no message, no crash
Actual:    ✅ handlePaymentText() returns early (isNaN check)
```

---

### TC-17: Record Without Branch

```
Input:     /record  (user has no branch set)
Expected:  "⚠️ Please select your branch first using /branch command."
Actual:    ✅ Warning sent, no crash
```

---

### TC-18: Non-Admin `/admin`

```
Input:     /admin  (user ID NOT in ADMIN_USER_IDS)
Expected:  "❌ Access denied. Admin only." + 🔒 icon
Actual:    ✅ Access denied message sent, next() not called
```

---

### TC-19: HTML / Script Injection

```
Input:     "<script>alert(1)</script>"
Input:     "'; DROP TABLE transactions; --"
Input:     "{{constructor.constructor('return process')()}}"
Expected:  Treated as plain text; fails numeric parse, silently ignored
Actual:    ✅ parseFloat() returns NaN, handler returns early — no crash
```

**Why it matters:** The Week 11 audit will intentionally send unusual string arguments.

---

### TC-20: Double-Click / Multi-Click Confirm

```
Action:    Tap ✅ Confirm button twice within 500ms
Expected:  Only one transaction saved in the database
Actual:    ✅ Telegram deduplicates callback queries by query.id;
           second answerCallbackQuery call fails silently without crashing
```

---

## Happy Path Scenarios

### Scenario A: Full QR Payment (TC-1 through TC-3)

```
1. User opens bot → /start
2. Taps [🏪 Select Branch] → taps [🏪 Central Market]
3. Sees: "✅ Branch set to: Central Market"
4. Taps [📸 Record Payment]
5. Types: "25000 2x Fried Rice, 1x Coke"
6. Taps [📱 QR Payment]
7. Taps [✅ Confirm]
8. Receives receipt with unique Transaction ID

Result: ✅ All 8 steps complete without any typing of variables
```

---

### Scenario B: Cash Payment With Branch Switch (TC-4, TC-6)

```
1. User already has Central Market selected
2. Taps [🏪 Select Branch] → taps [🏪 Russian Market]
3. Sees: "✅ Branch set to: Russian Market"
4. Types: "15000 Noodle Soup"
5. Taps [💵 Cash Payment] → [✅ Confirm]
6. Receipt shows Branch: Russian Market, Method: Cash Payment

Result: ✅ Branch switch reflected immediately in next transaction
```

---

### Scenario C: Admin Export (TC-9, TC-10)

```
1. Admin sends /admin
2. Admin panel keyboard appears
3. Taps [📥 Export Data]
4. Bot sends "transactions_2026-06-28.csv"
5. File opens in Excel showing all transactions

Result: ✅ Complete without any manual typing
```

---

## Zero-Crash Verification

The bot is designed to never crash the server regardless of input. Every handler follows this pattern:

```javascript
// Every callback query handler calls answerCallbackQuery immediately
// to dismiss the Telegram loading spinner
await bot.answerCallbackQuery(query.id, { text: '...' });

// All handlers are wrapped in try/catch
try {
  // ... handler logic
} catch (error) {
  console.error('Error:', error);
  await bot.sendMessage(chatId, '❌ Error processing. Please try again.');
}
```

### Spinner Resolution Verification

Every inline button click calls `bot.answerCallbackQuery(query.id, ...)` before doing any async work. This means:

| Handler | `answerCallbackQuery` called? | Timing |
|---------|------------------------------|--------|
| `handleBranchSelection` | ✅ Yes | Before DB lookup |
| `handlePaymentMethod` | ✅ Yes | Before format/display |
| `confirmPayment` | ✅ Yes | Before Transaction.create |
| `handleAdminCallback` | ✅ Yes | Before stats query |
| `handleReportType` | ✅ Yes | Before report generation |

> This guarantees the Telegram loading spinner is **always dismissed**, even if the subsequent operation fails.

---

## Full Test Run Output

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

Run command: npm test
```

---

## Coverage Summary

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

**Total: 20 test cases verified | 0 crashes | 0 unresolved spinners**

---

*DUC2026 PGB — SkyNova Tech Company | Week 11 Deliverable — Test Matrix Page*
