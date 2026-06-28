# Changelog

All notable changes to the **Bakong-Integrated Micro-Vendor Bot** project will be documented in this file.

This project follows [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`

---

## [Unreleased]

### Planned
- Khmer language support for bot messages
- Export reports to PDF
- Weekly automated report to owner via Telegram

---

## [1.1.0] - 2026-06-28 — Week 10 & Week 11 Milestone Release

### Week 11 Deliverables
- **GitHub Wiki — Test Matrix Page:** Published complete verification log with 20 distinct test cases covering boundary tests, negative/attack scenarios, and happy path flows (`wiki/test-matrix.md`)
- **Zero-Crash Hardening:** All handlers verified to call `answerCallbackQuery` before async operations; all try/catch blocks confirmed; tested against random text, script injection, zero amounts, and multi-click attacks — server does not crash
- **Production Staging Link:** Live bot handle added to README.md header
- **Final PR Merges:** All development branches merged; GitHub Project Board updated with all items moved to Done column

### Week 10 Deliverables
- **GitHub Wiki — User Guide:** Complete user guide with interactive button maps for all inline keyboards and main keyboard (`wiki/user-guide.md`)
- **Elimination of Typed Arguments:** Full payment workflow documented as button-only flow; user can browse, select branch, choose payment method, and confirm — entirely via inline buttons
- **Graceful Spinner Resolution:** Verified `answerCallbackQuery` is called on every inline button handler to dismiss Telegram loading spinner
- **Agile Progress Verification:** GitHub Project Board Sprint 5 cards updated with advanced UI integration tasks linked to developer assignments

### Changed
- `wiki/user-guide.md` — Added full Interactive Button Map section with ASCII diagrams for all keyboards
- `README.md` — Added production bot handle link, wiki documentation table, and coverage run script
- `wiki/testing-report.md` — Updated to v1.1.0 with Week 11 test results

### Added
- `wiki/test-matrix.md` — New: 20-case test matrix (boundary, negative, happy path) — Week 11 deliverable

---

## [1.0.0] - 2026-06-01

### 🎉 Initial Release

This is the first stable release of the Bakong-Integrated Micro-Vendor Bot by SkyNova Tech Company.

### Added
- **Telegram Bot Interface** — Staff can interact via Telegram on any device
- **Branch Management** — Support for multiple branches (e.g., Central Market, Russian Market, Olympic Market)
- **Payment Recording** — Record KHQR payments with amount and description
- **Photo Support** — Staff can attach payment screenshots
- **Daily Sales Report** — View total sales and transactions per day
- **Branch-wise Report** — Break down sales by individual branch
- **Weekly & Monthly Reports** — Owner can view wider time range summaries
- **JSON Database** — Simple file-based storage in `data/` folder (no server required)
- **Bakong API Integration** — Connect with National Bank of Cambodia payment system
- **Environment Configuration** — `.env.example` template for easy setup
- **PostgreSQL Support** — Optional database upgrade for larger deployments
- **24/7 Deployment** — PM2-based always-on deployment with `ecosystem.config.js`
- **Multi-device Support** — Works across all devices with Telegram installed

### Project Structure
- `src/handlers/` — Command handlers (start, branch, payment, report)
- `src/models/` — SimpleDB JSON-based data model
- `src/services/` — Bakong payment service integration
- `src/utils/` — Authentication and QR code utilities
- `tests/` — Unit test suite

### Documentation
- `README.md` — Project overview and quick start
- `SETUP_GUIDE.md` — Full installation instructions
- `USER_MANUAL.md` — Staff and owner usage guide
- `QUICKSTART.md` — Fast setup for developers
- `DEPLOYMENT_247.md` — Production deployment guide
- `POSTGRESQL_GUIDE.md` — Database upgrade instructions
- `MULTI_DEVICE_GUIDE.md` — Multi-device setup
- `PAYMENT_METHODS_GUIDE.md` — Payment methods reference
- `ADVANCED_FEATURES.md` — Advanced configuration options
- `CONTRIBUTING.md` — Contribution guidelines
- `CHANGELOG.md` — This file

---

## How to Update This File

When you make changes to the project, add a new entry at the top under `[Unreleased]` using this format:

```
### Added
- New feature description

### Changed
- What was modified

### Fixed
- Bug that was fixed

### Removed
- Feature or file that was removed
```

When you release a new version, move the `[Unreleased]` items to a new version block:

```
## [1.1.0] - YYYY-MM-DD
```

---

Made with ❤️ by **SkyNova Tech Company** — DUC2026, Phnom Penh, Cambodia
