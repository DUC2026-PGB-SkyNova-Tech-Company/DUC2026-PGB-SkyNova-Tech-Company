# Contributing to Bakong-Integrated Micro-Vendor Bot

Thank you for your interest in contributing to this project! This document provides guidelines for contributing to the **SkyNova Tech Company - DUC2026** project.

---

## 👥 Team Members

This project is developed by **SkyNova Tech Company** as part of the DUC2026 program at Phnom Penh, Cambodia.

---

## 🚀 How to Contribute

### 1. Fork the Repository

Click the **Fork** button at the top right of this repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR-USERNAME/DUC2026-PGB-SkyNova-Tech-Company.git
cd DUC2026-PGB-SkyNova-Tech-Company
```

### 3. Create a New Branch

Always create a new branch for your changes. Never commit directly to `main`.

```bash
git checkout -b feature/your-feature-name
```

**Branch naming conventions:**
- `feature/` — for new features (e.g., `feature/add-khmer-language`)
- `fix/` — for bug fixes (e.g., `fix/payment-handler-error`)
- `docs/` — for documentation updates (e.g., `docs/update-readme`)

### 4. Make Your Changes

- Write clean, readable code
- Add comments where necessary
- Follow the existing code style

### 5. Test Your Changes

```bash
npm test
```

Make sure all tests pass before submitting.

### 6. Commit Your Changes

Write clear and descriptive commit messages:

```bash
git add .
git commit -m "feat: add Khmer language support for bot messages"
```

**Commit message format:**
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation change
- `refactor:` — code refactoring
- `test:` — adding or updating tests

### 7. Push and Open a Pull Request

```bash
git push origin feature/your-feature-name
```

Then go to GitHub and open a **Pull Request** against the `main` branch.

---

## 📋 Code of Conduct

- Be respectful to all team members
- Communicate clearly in issues and pull requests
- Help review other team members' code
- Ask questions if something is unclear

---

## 🐛 Reporting Issues

If you find a bug or have a suggestion:

1. Go to the [Issues](https://github.com/DUC2026-PGB-SkyNova-Tech-Company/DUC2026-PGB-SkyNova-Tech-Company/issues) tab
2. Click **New Issue**
3. Describe the problem clearly with steps to reproduce it

---

## 📁 Project Structure Reference

```
/DUC2026-PGB-SkyNova-Tech-Company
├── src/handlers/     # Telegram command handlers
├── src/models/       # Database models
├── src/services/     # External API services (Bakong)
├── src/utils/        # Helper functions
├── tests/            # Test files
└── data/             # JSON database (auto-created, do not edit manually)
```

---

## ⚙️ Development Setup

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for full installation instructions.

Quick start:
```bash
npm install
cp .env.example .env
# Edit .env with your bot token
npm run dev
```

---

Made with ❤️ by **SkyNova Tech Company** — DUC2026, Phnom Penh, Cambodia
