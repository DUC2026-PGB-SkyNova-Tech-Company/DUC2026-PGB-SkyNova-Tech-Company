# Conversation Flowchart — DUC2026-PGB-SkyNova-Tech Company Bot

> **Version:** 1.1.0 | **Platform:** Telegram | **Week 12**

This document maps every live state transition in the bot. Every node below corresponds directly to a handler function in `src/handlers/`.

---

## 1. Main Entry Flow

```
User opens Telegram
        │
        ▼
[sends /start or ❓ Help]
        │
        ▼
┌───────────────────────┐
│   startHandler.js     │
│   sendMessage()       │
│   → Welcome message   │
│   → Main keyboard     │
└──────────┬────────────┘
           │
           ▼
    ┌──────────────────────────────────────────────┐
    │              MAIN KEYBOARD                    │
    │  📸 Record  │ 📊 Reports │ 🏪 Branch │ 📅 Daily │
    │  📆 Weekly  │ 📊 Monthly │           │ ❓ Help   │
    └──────┬───────┬──────────┬────────────┬────────┘
           │       │          │            │
          (A)     (B)        (C)          (D)
```

---

## 2. Flow A — Payment Recording

```
Tap [📸 Record Payment] or /record
        │
        ▼
┌─────────────────────────────────┐
│ paymentHandler.recordPayment()  │
│ Check user.currentBranchId      │
└──────────┬──────────────────────┘
           │
    ┌──────┴──────────┐
    │                 │
  null/no branch   branch set
    │                 │
    ▼                 ▼
 Send:            Send:
 ⚠️ "Please       "💰 Record New Payment
  select branch"   AMOUNT DESCRIPTION"
 (end)
    │
    ▼
User types: "25000 2x Fried Rice"
    │
    ▼
┌──────────────────────────────────────┐
│  paymentHandler.handlePaymentText()  │
│  • Parse parts[0] → amount           │
│  • isNaN or ≤ 0 → return (no msg)   │
│  • parts.slice(1) → description      │
│  • Branch.findById(currentBranchId)  │
│  • formatBothCurrencies(amount)      │
└───────────────┬──────────────────────┘
                │
                ▼
      ┌─────────────────────┐
      │ PAYMENT CONFIRMATION │
      │  💰 KHR + USD shown  │
      │  [📱 QR] [💵 Cash]   │
      │  [❌ Cancel]          │
      └─────────┬───────────┘
                │
         ┌──────┴──────┐
         │             │
     Tap [❌]       Tap [📱 or 💵]
         │             │
         ▼             ▼
      confirm_cancel  method_{amount}_{branchId}_{desc}_{METHOD}
         │             │
         ▼             ▼
    Send: "❌       paymentHandler.handlePaymentMethod()
     Cancelled"    • answerCallbackQuery() ← dismisses spinner
                   • Branch.findById()
                   • Format confirmation message
                   │
                   ▼
          ┌────────────────────┐
          │  CONFIRM/CANCEL    │
          │  [✅ Confirm]      │
          │  [❌ Cancel]       │
          └──────┬─────────────┘
                 │
          ┌──────┴──────┐
          │             │
       Tap [❌]      Tap [✅]
          │             │
          ▼             ▼
     confirm_cancel  confirm_{amount}_{branchId}_{desc}_{METHOD}
          │             │
          ▼             ▼
     "❌ Cancelled"  paymentHandler.confirmPayment()
                    • answerCallbackQuery() ← dismisses spinner
                    • Transaction.create()
                    • Generate formatted receipt
                    • Send receipt with Transaction ID #N
                    │
                    ▼
             ┌────────────────┐
             │ PAYMENT RECEIPT │
             │ #ID, Branch,   │
             │ KHR+USD, Method│
             │ ✅ Status: PAID │
             └────────────────┘
```

---

## 3. Flow B — Reports

```
Tap [📊 View Reports] or /report
        │
        ▼
┌──────────────────────────────────┐
│ reportHandler.generateReport()   │
│ Send inline keyboard             │
└────────────────┬─────────────────┘
                 │
    ┌────────────┼────────────┬────────────┐
    │            │            │            │
 [📅 Today] [📆 Week]  [📊 Month]  [🏪 Branch]
    │            │            │            │
    ▼            ▼            ▼            ▼
reportHandler.handleReportType()
    • answerCallbackQuery() ← dismisses spinner
    │
    ├── report_today  → reportService.buildDailyReport()
    ├── report_week   → reportService.buildWeeklyReport()
    ├── report_month  → reportService.buildMonthlyReport()
    └── report_branch → reportService.buildBranchReport()
                │
                ▼
         Send report message
         (Markdown formatted)
```

---

## 4. Flow C — Branch Selection

```
Tap [🏪 Select Branch] or /branch
        │
        ▼
┌──────────────────────────────────┐
│ branchHandler.selectBranch()     │
│ Branch.findAll()                 │
│ branches.length === 0?           │
└──────┬───────────────────────────┘
       │
 ┌─────┴──────────┐
 │                │
no branches    branches exist
 │                │
 ▼                ▼
Send:         Build inline keyboard:
"❌ No         [🏪 Central Market]
 branches"    [🏪 Russian Market]
 (end)        [🏪 Olympic Market]
                   │
                   ▼
             User taps branch
                   │
                   ▼
       branch_{id} callback_data
                   │
                   ▼
┌────────────────────────────────────┐
│ branchHandler.handleBranchSelection│
│ • answerCallbackQuery() ← spinner  │
│ • Branch.findById(branchId)        │
│ • not found → "Branch not found!"  │
│ • User.upsert({ currentBranchId }) │
│ • Send: "✅ Branch set to: [Name]" │
└────────────────────────────────────┘
```

---

## 5. Flow D — Daily Summary

```
Tap [📅 Daily Summary] or /daily
        │
        ▼
┌──────────────────────────────┐
│ reportHandler.dailyReport()  │
│ → reportService.buildDaily() │
│ transactions.length === 0?   │
└────────────┬─────────────────┘
             │
      ┌──────┴──────┐
      │             │
   empty          has data
      │             │
      ▼             ▼
 "📭 No         Send full daily
 transactions"  report message
```

---

## 6. Admin Flow

```
User sends /admin
        │
        ▼
┌──────────────────────────────┐
│ adminHandler.adminPanel()    │
│ isAdmin(userId)?             │
└────────────┬─────────────────┘
             │
      ┌──────┴──────┐
      │             │
   not admin     is admin
      │             │
      ▼             ▼
 "❌ Access      Admin panel
  denied"       inline keyboard
                     │
       ┌─────────────┼───────────────┬────────────┐
       │             │               │            │
  [📊 Stats]   [👥 Users]     [🏪 Branches]  [📥 Export]
       │             │               │            │
       ▼             ▼               ▼            ▼
  showStatistics  showUsers     showBranches  exportData
  (all with answerCallbackQuery called first)
```

---

## 7. Error Handling State — All Flows

```
Any handler throws an exception
        │
        ▼
catch (error) block
        │
        ▼
console.error(error)
        │
        ▼
bot.sendMessage(chatId, '❌ Error ...')
        │
        ▼
Server continues running — NO CRASH
```

Every callback handler also calls `answerCallbackQuery()` at the start to ensure the Telegram loading spinner is **always dismissed**, even when an error occurs.

---

*DUC2026 PGB — SkyNova Tech Company | Week 12 Final Delivery*
