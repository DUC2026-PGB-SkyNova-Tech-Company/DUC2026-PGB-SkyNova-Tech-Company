# Project Charter — DUC2026-PGB-SkyNova-Tech Company

> **Course:** DUC2026 | **Phase:** 4 — Quality & Delivery | **Instructor:** Chum Pharino

---

## 1. Project Overview

| Field | Details |
|-------|---------|
| **Project Name** | Bakong-Integrated Micro-Vendor Bot |
| **Virtual Company** | SkyNova Tech Company |
| **SME Scenario** | Multi-branch street food franchise — Phnom Penh, Cambodia |
| **Platform** | Telegram Bot + Express Web Dashboard |
| **Sprint Duration** | 6 weeks (Weeks 7–12) |
| **Repository** | github.com/DUC2026-PGB-SkyNova-Tech-Company |
| **Live Bot** | [`@SkyNovaTech_Bot`](https://t.me/SkyNovaTech_Bot) |

---

## 2. Problem Statement

Street food franchise owners in Phnom Penh face daily reconciliation chaos. Branch staff currently:
- Manually photograph KHQR payment receipts
- Forward screenshots to a shared Telegram group
- Leave owners to manually tally each branch's totals

**Result:** Hours of manual reconciliation, frequent human error, no real-time visibility.

---

## 3. Solution

A Telegram bot that allows branch staff to record payments via structured inline buttons, automatically converting between KHR and USD, tagging each transaction to a branch, and surfacing live analytics to owners through a web dashboard — with zero manual data entry required from staff.

---

## 4. INVEST User Stories

| ID | Story | Acceptance Criteria |
|----|-------|---------------------|
| US-01 | As a **branch staff member**, I want to record a QR payment using buttons so that I never have to manually type IDs. | Staff can complete a payment entry entirely by tapping inline buttons + entering amount |
| US-02 | As a **branch staff member**, I want to select my branch from a button list so that my transactions are correctly tagged. | Branch selection inline keyboard appears; confirmation sent; next transaction uses selected branch |
| US-03 | As a **branch staff member**, I want to receive a formatted receipt with a Transaction ID so that I have proof of each entry. | Receipt with unique ID, branch, amount in KHR+USD, payment method, date/time is sent |
| US-04 | As an **owner**, I want to view today's total sales broken down by branch so that I can monitor revenue in real time. | `/daily` shows total, per-method split, per-branch breakdown |
| US-05 | As an **owner**, I want to see weekly and monthly analytics so that I can spot trends. | `/weekly` and `/monthly` show correct aggregated totals with visual breakdown |
| US-06 | As an **admin**, I want to export all transactions as a CSV file so that I can import into Excel for accounting. | CSV downloaded via Telegram includes all required columns |
| US-07 | As an **admin**, I want a web dashboard so that I can monitor the business without using Telegram. | Dashboard at `http://localhost:3001` shows live stats, charts, branch performance |
| US-08 | As an **owner**, I want the system to reject or ignore invalid inputs so that the bot never crashes during operations. | Random text, injections, zero amounts, out-of-order commands are handled gracefully |

---

## 5. Scope

### In Scope
- Telegram bot with inline keyboard UI (no manual variable typing)
- Multi-branch transaction recording (QR and Cash)
- KHR ↔ USD auto-conversion (rate: 4,100 KHR/USD)
- Daily, weekly, monthly, and by-branch reports
- Admin panel with CSV export
- Express web dashboard with live API
- JSON flat-file database (simpleDB)
- Crash-safe error handling on all inputs

### Out of Scope
- Real-time Bakong API webhook (mocked for staging)
- PDF export
- Khmer language support
- PostgreSQL / MongoDB in production (planned for v2)

---

## 6. Team Roles

| Role | Responsibility |
|------|---------------|
| PM | GitHub Wiki, Project Board, user stories, sprint planning |
| Lead Developer | Architecture, src/handlers, src/services, src/models |
| QA Lead | Test suite, test matrix wiki, live defacement defense |
| Full Stack | Web dashboard, API routes, public/ frontend |

---

## 7. Sprint Timeline

| Week | Milestone |
|------|-----------|
| 7 | Project setup, bot scaffold, branch handler |
| 8 | Payment recording, receipt generation, simpleDB |
| 9 | Admin panel, CSV export, web dashboard |
| 10 | Wiki User Guide, button-only flow, spinner fixes |
| 11 | Test Matrix wiki, zero-crash hardening, production link |
| 12 | Live audit, final PR merges, project sign-off |

---

*DUC2026 PGB — SkyNova Tech Company | Week 12 Final Delivery*
