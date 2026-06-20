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
