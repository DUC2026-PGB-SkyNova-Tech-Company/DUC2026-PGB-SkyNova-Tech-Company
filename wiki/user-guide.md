# User Guide — DUC2026-PGB-SkyNova-Tech Company Bot

> **Version:** 1.1.0 | **Platform:** Telegram | **Timezone:** Asia/Phnom_Penh (GMT+7) | **Updated:** Week 10

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Interactive Button Map](#interactive-button-map)
4. [Commands Reference](#commands-reference)
5. [Recording Payments — Button-Only Flow](#recording-payments--button-only-flow)
6. [Payment Methods](#payment-methods)
7. [Reports & Analytics](#reports--analytics)
8. [Branch Management](#branch-management)
9. [Admin Panel](#admin-panel)
10. [Web Dashboard](#web-dashboard)
11. [Troubleshooting](#troubleshooting)

---

## Overview

The **DUC2026-PGB-SkyNova-Tech Company Bot** is a Telegram-based payment tracking system for multi-branch businesses in Cambodia. Staff can record KHQR (QR code) and cash payments entirely through **buttons** — no manual variable typing required. Managers and admins can view real-time analytics through a web dashboard.

**Key Features:**
- Record QR and cash payments from any branch — buttons only
- Auto-convert amounts between KHR and USD (rate: 1 USD = 4,100 ៛)
- Generate daily, weekly, and monthly sales reports
- Real-time admin statistics and data export
- Live web dashboard at `http://localhost:3001`

---

## Getting Started

### Step 1 — Find the Bot

Open Telegram and search for your company's bot name, or use the live link:

> 🤖 **Bot Handle:** `@SkyNovaTech_Bot` — search on Telegram or open [t.me/SkyNovaTech_Bot](https://t.me/SkyNovaTech_Bot)

Tap **Start** or send `/start`.

### Step 2 — Select Your Branch

Before recording any payment, assign yourself to a branch **using buttons only**:

1. Tap **🏪 Select Branch** from the main keyboard
2. A list of branch buttons appears inline
3. Tap your branch (e.g., **🏪 Central Market**)
4. You will see: `✅ Branch set to: Central Market`

> ⚠️ You must select a branch before recording payments. The bot will remind you if you skip this step.

### Step 3 — Record Your First Payment

After selecting a branch, tap **📸 Record Payment** from the main keyboard.

---

## Interactive Button Map

This section maps every interactive element a user can tap — no manual typing needed for any core workflow.

### Main Keyboard (always visible)

```
┌─────────────────────────────────────────────┐
│  📸 Record Payment   │   📊 View Reports     │
├──────────────────────┼──────────────────────┤
│  🏪 Select Branch    │   📅 Daily Summary    │
├──────────────────────┼──────────────────────┤
│  📆 Weekly Summary   │   📊 Monthly Summary  │
├──────────────────────┴──────────────────────┤
│               ❓ Help                        │
└─────────────────────────────────────────────┘
```

| Button | Action Triggered |
|--------|-----------------|
| 📸 Record Payment | Opens payment prompt |
| 📊 View Reports | Opens report menu |
| 🏪 Select Branch | Opens branch selection inline keyboard |
| 📅 Daily Summary | Shows today's sales report |
| 📆 Weekly Summary | Shows this week's analytics |
| 📊 Monthly Summary | Shows this month's analytics |
| ❓ Help | Shows help message and command list |

---

### Branch Selection — Inline Keyboard

Appears after tapping **🏪 Select Branch**:

```
┌─────────────────────────────────┐
│     🏪 Central Market           │
├─────────────────────────────────┤
│     🏪 Russian Market           │
├─────────────────────────────────┤
│     🏪 Olympic Market           │
└─────────────────────────────────┘
```

Tap any branch → bot confirms with `✅ Branch set to: [Branch Name]`

---

### Payment Method Selection — Inline Keyboard

Appears after entering a payment amount:

```
┌──────────────────┬───────────────────┐
│  📱 QR Payment   │  💵 Cash Payment  │
├──────────────────┴───────────────────┤
│              ❌ Cancel               │
└──────────────────────────────────────┘
```

| Button | Action |
|--------|--------|
| 📱 QR Payment | Selects KHQR method, opens Confirm step |
| 💵 Cash Payment | Selects cash method, opens Confirm step |
| ❌ Cancel | Discards the current payment entry |

---

### Payment Confirmation — Inline Keyboard

Appears after selecting a payment method:

```
┌─────────────────┬──────────────────┐
│   ✅ Confirm    │    ❌ Cancel      │
└─────────────────┴──────────────────┘
```

| Button | Action |
|--------|--------|
| ✅ Confirm | Saves transaction, generates receipt |
| ❌ Cancel | Discards payment, no data saved |

---

### Reports Menu — Inline Keyboard

Appears after tapping **📊 View Reports**:

```
┌─────────────────────────────┐
│       📅 Today              │
├─────────────────────────────┤
│       📆 This Week          │
├─────────────────────────────┤
│       📊 This Month         │
├─────────────────────────────┤
│       🏪 By Branch          │
└─────────────────────────────┘
```

---

### Admin Panel — Inline Keyboard

Appears after `/admin` (admin only):

```
┌──────────────────┬──────────────────┐
│  📊 Statistics   │   👥 Users       │
├──────────────────┼──────────────────┤
│  🏪 Branches     │  💰 Transactions │
├──────────────────┼──────────────────┤
│     📥 Export Data (CSV)            │
└─────────────────────────────────────┘
```

---

## Commands Reference

| Command | Button Equivalent | Description |
|---------|-------------------|-------------|
| `/start` | — | Welcome message and main keyboard |
| `/help` | ❓ Help | Show help and all commands |
| `/record` | 📸 Record Payment | Start recording a payment |
| `/branch` | 🏪 Select Branch | Select or change your branch |
| `/daily` | 📅 Daily Summary | Today's sales summary |
| `/report` | 📊 View Reports | Choose report type |
| `/weekly` | 📆 Weekly Summary | This week's analytics |
| `/monthly` | 📊 Monthly Summary | This month's analytics |
| `/admin` | — | Admin panel (admin only) |

---

## Recording Payments — Button-Only Flow

The entire payment workflow can be completed **without typing a single variable manually** if you use preset amounts. Here is the full button-only scenario:

### Complete Button Flow (Step by Step)

```
Step 1:  Tap [ 🏪 Select Branch ]
           ↓
Step 2:  Tap [ 🏪 Central Market ]   ← branch set
           ↓
Step 3:  Tap [ 📸 Record Payment ]
           ↓
Step 4:  Type amount + description
         e.g.: 25000 2x Fried Rice    ← only this requires typing
           ↓
Step 5:  Tap [ 📱 QR Payment ] or [ 💵 Cash Payment ]
           ↓
Step 6:  Tap [ ✅ Confirm ]
           ↓
         Receipt generated with Transaction ID ✅
```

> 💡 **Zero-Typing Mode:** You can send a photo of the KHQR receipt and the bot will ask for details — only the amount and description need to be typed once.

### Method 2 — Photo Upload (KHQR Screenshot)

1. Send a photo/screenshot of the KHQR payment proof directly to the bot
2. The bot acknowledges: `📸 Screenshot received for [Branch Name]`
3. Type `AMOUNT DESCRIPTION` (e.g. `25000 Fried Rice`)
4. Tap **📱 QR Payment** or **💵 Cash Payment**
5. Tap **✅ Confirm**

---

## Payment Methods

| Method | Icon | When to Use |
|--------|------|-------------|
| QR Payment | 📱 | Customer pays via Bakong KHQR scan |
| Cash Payment | 💵 | Customer pays physical cash |

Always tap **✅ Confirm** to save. Tapping **❌ Cancel** discards the entry with no data written.

### Payment Receipt Example

```
╔═══════════════════════════════╗
║         PAYMENT RECEIPT        ║
╚═══════════════════════════════╝

🏢 DUC2026-PGB-SkyNova-Tech Company

🆔 Transaction ID: #42
🏪 Branch: Central Market
👤 Staff: Narith

📝 Description: 2x Fried Rice, 1x Coke
💰 Amount (KHR): 25,000 ៛
💵 Amount (USD): $6.10
📱 Payment Method: QR Payment

📅 Date: 28/06/2026
🕐 Time: 10:35:22
✅ Status: PAID
```

---

## Reports & Analytics

### Daily Summary (`/daily` or 📅 Daily Summary)

Shows today's totals:
- Total revenue (KHR + USD)
- QR payment total and count
- Cash payment total and count
- Per-branch breakdown

### Reports Menu (`/report` or 📊 View Reports)

| Button | Data Shown |
|--------|-----------|
| 📅 Today | Hourly sales for current day |
| 📆 This Week | Daily totals for the current week |
| 📊 This Month | Weekly totals for the current month |
| 🏪 By Branch | Sales comparison across all branches |

### Weekly Analytics (📆 Weekly Summary)

Week-over-week comparison with payment method breakdown.

### Monthly Analytics (📊 Monthly Summary)

Monthly trends and top-performing branches.

---

## Branch Management

Each staff member works under one branch at a time. Switch branches at any moment using the **🏪 Select Branch** button.

- Branch list is managed by the admin
- Default branches: **Central Market**, **Russian Market**, **Olympic Market**
- All transactions are tagged to your currently selected branch

---

## Admin Panel

Only users whose Telegram ID is in `ADMIN_USER_IDS` can access `/admin`.

### Admin Features

| Button | Description |
|--------|-------------|
| 📊 Statistics | All-time sales, today's sales, payment method split, averages |
| 👥 Users | List of registered staff with branch assignments |
| 🏪 Branches | Per-branch revenue, transaction count, active status |
| 💰 All Transactions | Complete transaction list |
| 📥 Export Data | Download all transactions as a `.csv` file |

### Exporting Data

1. Send `/admin`
2. Tap **📥 Export Data**
3. Bot sends a `.csv` file named `transactions_YYYY-MM-DD.csv`
4. Open with Excel or Google Sheets

CSV includes: Transaction ID, Date, Time, Branch, Amount (KHR), Amount (USD), Payment Method, Description, Staff ID.

---

## Web Dashboard

Access the live dashboard at **`http://localhost:3001`** (or your server IP + port).

### Dashboard Panels

| Panel | Description |
|-------|-------------|
| Total Revenue | Revenue for selected period with % change vs previous period |
| Total Transactions | Count with % change |
| KHQR Payments | Count and % of total |
| Cash Payments | Count and % of total |
| Revenue Trend Chart | Hourly / daily / weekly chart |
| Branch Performance | Revenue and transaction count per branch |
| Recent Transactions | Last 10 transactions with branch |

### Time Period Filter

Use the dropdown at the top:
- **Today** — hourly breakdown
- **This Week** — daily breakdown
- **This Month** — weekly breakdown

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stats?period=today` | GET | Dashboard statistics |
| `/api/branches` | GET | All branches with revenue |
| `/api/transactions/recent?limit=10` | GET | Recent transactions |
| `/api/transactions` | GET | All transactions (filterable) |
| `/health` | GET | Server health check |

---

## Troubleshooting

### "Please select your branch first"
You have not selected a branch. Tap **🏪 Select Branch** and choose your branch from the buttons.

### Payment not saved
- Make sure you tapped **✅ Confirm** (not just the payment method button)
- Check your internet connection and try again
- If the error persists, note the amount and description and contact your admin

### Telegram spinner keeps spinning on a button
Every button press sends `answerCallbackQuery` immediately — if you see a spinner stuck, the bot may be restarting. Wait 30 seconds and try again.

### Bot not responding
1. Check your internet connection
2. Wait 30 seconds and try again
3. Send `/start` to reinitialize the session
4. Contact admin if the issue continues

### Wrong branch selected
Tap **🏪 Select Branch** at any time to switch. Note: this does not change the branch on already-recorded transactions.

### Amount showing wrong in USD
The exchange rate is fixed at **1 USD = 4,100 ៛**. For exact USD values, confirm with your finance team.

---

*DUC2026 PGB — SkyNova Tech Company | Week 10 Deliverable*
