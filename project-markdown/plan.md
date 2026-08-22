# 🚀 Mamun Command Center - Project Master Plan

## 📌 Executive Summary
**Mamun Command Center** is an all-in-one personal productivity and career development platform. It integrates **Daily Routine Management**, **CV & Resume Management**, an **Interactive Quiz & Knowledge Testing System**, and an **AI-powered Chatbot Assistant** into a unified, responsive dashboard.

> ℹ️ *Note: For Tech Stack & Agent configurations, refer to `agents.md`.*

---

## 📦 Core Modules & Functional Requirements

### 1. 📅 Daily Routine Controller
- **Time-Blocked Scheduler**: Interactive daily & weekly schedule planner.
- **Habit & Task Tracker**: Streak tracking, status (Pending, In Progress, Completed), priority levels.
- **Notification & Reminders**: Visual alerts and audio/push notifications for scheduled tasks.
- **Routine Analytics**: Daily performance score, completion rate percentage, visual progress bars.

### 2. 📄 CV & Resume Management
- **Master Profile Store**: Single source of truth for work experience, education, projects, skills, certifications, and achievements.
- **Custom CV Builder**: Select and assemble targeted CV variants (e.g., Frontend Developer, Full-stack Engineer, AI Specialist).
- **Template Engine**: Dynamic rendering with customizable clean styles.
- **Version Control & Export**: Export to PDF/JSON, download history, versioning notes.

### 3. 🧪 Quiz & Knowledge Testing System
- **Question Bank Manager**: Create, tag, categorize, and edit dynamic quiz questions (Multiple Choice, True/False, Short Answer, Code Snippets).
- **Test Engine**: Timed quizzes, instant grading, explanation cards for incorrect answers.
- **Spaced Repetition & Weak Spot Tracking**: Flag difficult topics and auto-generate review quizzes.
- **Progress Dashboard**: Category-wise mastery stats, historic test scores, streak counters.

### 4. 🤖 AI Chatbot Assistant
- **Context-Aware Assistant**: AI chat helper with direct access to user's daily goals, notes, and quiz topics.
- **Prompt Library**: Pre-built prompts (e.g., "Review my daily schedule", "Optimize this CV bullet point", "Explain this quiz question").
- **Custom System Instructions**: Configurable bot personality, response format (Markdown, code snippets).
- **Chat History & Search**: Save past conversations, tag key topics, search transcript history.

---

## 🗄️ Proposed Database Schema (High-Level)

```mermaid
erDiagram
    USER ||--o{ ROUTINE_TASK : owns
    USER ||--o{ HABIT : tracks
    USER ||--o{ CV_PROFILE : manages
    USER ||--o{ QUIZ_CATEGORY : owns
    USER ||--o{ CHAT_SESSION : engages

    CV_PROFILE ||--o{ CV_SECTION : contains
    QUIZ_CATEGORY ||--o{ QUESTION : includes
    QUESTION ||--o{ QUIZ_ATTEMPT_DETAIL : evaluated_in
    CHAT_SESSION ||--o{ CHAT_MESSAGE : stores
```
## Database
Database connection string - mongodb+srv://mamunorselise:Z3xxMP1KoVJIODlu@cluster0.e6whmmx.mongodb.net/?appName=Cluster0

Database Name - AE3EEEDC-E790-4CDB-96D5-2DD31F26C9CC
---

## 🗓️ Implementation Roadmap

### **Phase 1: Foundation & Project Setup (Week 1)**
- [ ] Initialize repository structure & environment variables based on `agents.md`.
- [ ] Set up project structure & core dependencies.
- [ ] Configure database connection & ORM.
- [ ] Design main layout shell with sidebar navigation.


### **Phase 2: CV Management Module (Week 3)**
- [ ] Build Master Profile data entry forms (Experience, Projects, Education, Skills).
- [ ] Create CV Variant generator (filtering components by role).
- [ ] Integrate export pipeline.
- [ ] Design clean, modern resume templates.
-- Missing in CV - Career Objective and Summary can help to AI Assistant or chatbot
-- add 2 more section to CV - Awards, Certification
-- Extra curriculam activity

### **Phase 3: AI Chatbot Integration (Week 5)**
- [ ] Set up AI LLM API handler & integration.
- [ ] Build chat UI component with streaming responses and markdown support.
- [ ] Implement system prompt context injections (Daily Routine & CV context).
- [ ] Add pre-configured prompt shortcut menu.

### **Phase 4: Unified Dashboard & Polish (Week 6)**
- [ ] Build executive overview homepage dashboard summarizing today's tasks, quiz stats, and quick chat widget.
- [ ] Implement dark/light theme switching.
- [ ] Perform full system testing, error handling, and performance optimization.

### *** Phase 5: AI buzzword this week ***
- [x] Under Dashboard -->show a list of AI tools that are currently trending, and if click the tool, it will open the tool in a new tab.
- [x] create a AI tools store 
- [x] Buzzword this week 
- [x] There will be three vertical cards showing above information
- [x] Buzzword will be top card
- [x] Use Open Router for getting all information
### *** Phase 6: Query builder (Visual) ***
- [x] Read comprehensively query-builder.md file 
- [x] Build a query builder (Visual)
- [x] Keep update in the progress.md file

---

## 🎯 Next Steps & Immediate Actions
1. **Review Plan**: Confirm all desired functional features are captured.
2. **Sync with `agents.md`**: Ensure tech stack requirements from `agents.md` map to the project setup.
3. **Begin Phase 1**: Start initial repository setup and database schema creation.
