# STUDY-RETRIVAL-WEB — AI-Native Smart Notebook & Multi-Tier Study Platform

**study-retrival-web** is an AI-native smart notebook, study, and knowledge management platform designed to bridge the gap between passive content consumption and active learning. It unifies multi-source ingestion (YouTube, Academic PDFs, Podcasts, Web Articles), timestamped/page-anchored annotations, 5-tier complexity calibration, and strictly grounded cross-source AI querying into a single distraction-free workspace.

---

## Product Architecture & Core Feature Set (Zero Duplication)

### 1. Authentication & Session Guard (`Sign In / Logout`)
* **User Authentication:** Email/Password login and one-click Google OAuth (`.edu`) flow to persist study spaces, anchored notes, and uploaded files.
* **Secure Logout:** Terminates the active session, clears local/session tokens, and returns to the public landing screen.

### 2. Multi-Source Ingestion & In-App PDF Viewer
* **YouTube Summarizer:** Timestamped chapter navigation with clickable timestamps (e.g., `04:12`, `11:20`, `18:45`), extracted visual lecture slide snapshots, and a **⚡ 3-Min Crash Course Mode**.
* **3-Tier PDF Summarizer & In-App PDF Viewer:**
  * **In-App PDF Reader:** Smooth scrolling manuscript viewer with interactive zoom controls (`75%`–`160%`), direct page jumping, and 1-click page-anchor pinning.
  * **3-Tier Breakdown:** Tier 1 (3-Sentence TL;DR), Tier 2 (Core Argument Map with page refs & formulas), and Tier 3 (Searchable Context-Aware Glossary).
  * **Multi-PDF Cross-Referencing Matrix:** Compare multiple PDFs side-by-side to highlight agreements and contradictions.
* **Podcast & Web Article Pulling:** Import episodes from **Spotify / Apple Podcasts** (with audio timestamp locators) and **Web Articles** (via Web Importer or Chrome Extension clips).

### 3. Timestamped & Page-Anchored Notes (with Manual Tag Editing)
* Context-aware annotation system that binds user highlights and notes directly to exact video timestamps (`Video @ 11:20`), podcast audio locators (`Podcast @ 14:05`), or PDF page numbers (`PDF Page 4`).
* Includes **manual custom `#tag` editing** alongside AI-driven categorization.

### 4. Grounded Cross-Source AI Assistant & Lecture Companion
* **Unified Lecture Companion:** Syncs PDF slide equations with spoken YouTube lecture explanations.
* **Strict Source Grounding (Zero Hallucination):** Multi-source Q&A operates strictly within user-saved content, returning dual citations and **Guided Prompt Unlocks** for deeper follow-up exploration.

### 5. Cross-Source Threads & Collections Workbench
* Combines insights from academic PDFs, YouTube lectures, podcasts, and web articles into unified narrative hubs for **Literature Reviews**, **Mini-Courses**, and **Project Briefs**.

### 6. Standout Feature: 5-Tier Complexity Slider
* Dynamically rewrites all video chapters, PDF tiers, podcast/article summaries, synthesis threads, and Q&A answers across 5 calibrated levels:
  1. `ELI5 (Explain Like I'm 5)`
  2. `High School Crash Course`
  3. `Undergraduate Lecture`
  4. `Graduate Seminar`
  5. `Academic Peer Review`

### 7. Ecosystem Touchpoints & Accessibility
* **Chrome Browser Extension & Mobile-Responsive UI:** One-click web capture workflow and responsive dark-mode interface with keyboard navigation shortcuts (`Alt+1..4`).

---

## Quick Start

```bash
npm install
npm run dev
```
