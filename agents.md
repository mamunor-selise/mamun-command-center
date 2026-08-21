# AGENTS.md — Mamun Command Center

Instructions for any AI coding agent working in this repository. Read this fully before generating or editing code.

## 1. System Overview

**Mamun Command Center** is a personal productivity, resume management, quiz engine, and AI chatbot suite.

## 2. Tech Stack

| Layer        | Technology |
|--------------|------------|
| Frontend     | **Angular** (v19+), TypeScript, RxJS, Tailwind CSS |
| Backend      | Node.js / Express or .NET Web API |
| Database     | SQLite / MongoDB / PostgreSQL |
| Testing      | Jasmine / Karma or Vitest |

## 3. Core Architectural Rules

1. **Standalone Components**: Use modern Angular standalone components and signals for reactive state management.
2. **Modular Architecture**: Separate features cleanly into `routine`, `cv-manager`, `quiz-engine`, `chatbot`, and `shared`.
3. **Responsive UI**: Tailwind CSS for dark-theme UI components.
