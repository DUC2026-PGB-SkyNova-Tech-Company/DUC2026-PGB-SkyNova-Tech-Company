# Meeting Minutes — DUC2026-PGB-SkyNova-Tech Company

> GitHub Wiki — Witness Log | All sprint sessions documented below.

---

## Week 12 — Final Sign-off & Audit Preparation

**Date:** June 27–28, 2026  
**Attendees:** Full team  
**Type:** Internal deployment + audit preparation

### Agenda
1. Final audit checklist review
2. Live bot defacement rehearsal
3. Repository cleanup — zero open PRs / issues
4. Wiki completeness check

### Decisions Made
- All development branches merged to `main` ✅
- Production bot link added to README top ✅
- Wiki pages confirmed: User Guide, Testing Report, Test Matrix, ERD, Flowchart, Project Charter, Meeting Minutes ✅
- `data/*.json` cleared of test debris, ready for live audit ✅
- `reportService.js` created to separate business logic from handlers ✅
- Division-by-zero bug in `adminHandler.showStatistics` fixed ✅
- `startHandler.js` missing `isAdmin` import fixed ✅

### Sign-off
All Week 12 deliverables locked. Repository ready for live audit on June 27, 2026.

---

## Week 11 — Testing & Zero-Crash Hardening

**Date:** June 21–22, 2026  
**Attendees:** Full team  
**Type:** Internal testing session

### Agenda
1. Run full test suite and review results
2. Test Matrix wiki page creation
3. Defacement simulation (random text, injection, multi-click)
4. Production staging link setup

### Test Results
- 62 tests across 9 suites — all passing ✅
- Zero crashes on: random text, HTML injection, zero-amount inputs, multi-click
- `answerCallbackQuery` verified on all 5 inline handlers ✅

### Decisions Made
- `wiki/test-matrix.md` published with 20 verified test cases ✅
- Production bot handle `@SkyNovaVendorBot` added to README ✅
- `CHANGELOG.md` v1.1.0 updated ✅

---

## Week 10 — UI Polish & Wiki User Guide

**Date:** June 14–15, 2026  
**Attendees:** Full team  
**Type:** Sprint review + documentation session

### Agenda
1. Review inline button flows — eliminate all typed variable requirements
2. User Guide wiki page creation with ASCII button maps
3. Spinner resolution audit — confirm every inline handler has `answerCallbackQuery`
4. GitHub Project Board Sprint 5 review

### Issues Found & Fixed
- `handleReportType` was a stub — stub noted, planned for Week 11 fix
- Branch keyboard confirmed button-only (no manual ID typing)
- All confirm/cancel flows verified to not require typing

### Decisions Made
- `wiki/user-guide.md` published with complete Interactive Button Map ✅
- Sprint 5 board cards updated with UI integration tasks ✅

---

## Week 9 — Admin Panel & Web Dashboard

**Date:** June 7–8, 2026  
**Attendees:** Full team  
**Type:** Sprint review

### Agenda
1. Admin panel review — statistics, users, branches, export
2. Web dashboard API integration
3. CSV export testing

### Decisions Made
- Admin panel keyboard with 6 buttons implemented ✅
- Express API routes (`/api/stats`, `/api/branches`, `/api/transactions`) live ✅
- CSV export via `bot.sendDocument()` tested ✅
- `data/` folder added to `.gitignore` ✅

---

## Week 8 — Payment Recording & simpleDB

**Date:** May 31 – June 1, 2026  
**Attendees:** Full team  
**Type:** Development sprint review

### Agenda
1. Payment recording flow end-to-end test
2. simpleDB schema review
3. KHR/USD conversion implementation

### Decisions Made
- Three-step payment flow: text entry → method selection → confirm ✅
- `simpleDB.js` JSON flat-file chosen over Postgres for simplicity ✅
- `currencyUtils.js` with `formatBothCurrencies()` implemented ✅
- Receipt format with Transaction ID agreed ✅

---

## Week 7 — Project Kickoff & Bot Scaffold

**Date:** May 24–25, 2026  
**Attendees:** Full team  
**Type:** Kickoff

### Agenda
1. SME scenario selection
2. Technology stack decision
3. Repository setup
4. Role assignments

### Decisions Made
- SME scenario: Multi-branch street food franchise (Phnom Penh) ✅
- Stack: Node.js + node-telegram-bot-api + Express + JSON DB ✅
- Repository created under DUC2026-PGB-SkyNova-Tech-Company org ✅
- Roles: PM, Lead Dev, QA Lead, Full Stack ✅
- Branch strategy: feature branches → PR → main ✅

---

*DUC2026 PGB — SkyNova Tech Company | Maintained throughout Weeks 7–12*
