# StudyRetrieval MVP (v3)

A streamlined, secure study application focused on **advanced PDF and YouTube lecture summarization**, **cross-source synchronization**, and **5-tier complexity adjustment**, protected by user authentication.

## Features (5 Core Pillars)

1. **Pillar 1 — Authentication & Session Management (`Sign In / Logout`)**
   - Email/Password login and 1-click Google OAuth (`.edu`) flow.
   - Persistent session tokens (`localStorage` / `sessionStorage`) with one-click secure logout cleanup.
2. **Pillar 2 — YouTube Summarizer**
   - Timestamped chapter navigation with clickable timestamps (e.g., `04:12`, `11:20`, `18:45`) that seek the embedded YouTube player.
   - Extracted visual lecture slide snapshots pinned beside each chapter summary.
   - Auto-generated **⚡ 3-Min Crash Course Mode** for rapid pre-exam revision.
3. **Pillar 3 — PDF Summarizer (3-Tier Breakdown & Multi-PDF Matrix)**
   - **Tier 1 (TL;DR):** 3-sentence core thesis summary.
   - **Tier 2 (Core Argument Map):** Methodologies, key findings, and theorem proofs with page citations (`Page 4`, `Page 8`).
   - **Tier 3 (Glossary & Terminology):** Searchable technical terms defined in context.
   - **Multi-PDF Cross-Referencing Matrix:** Compare multiple PDFs side-by-side to highlight agreements and contradictions.
4. **Pillar 4 — Smart Integration & Cross-Source Bridging**
   - **Unified Lecture Companion:** Bridges terse PDF slide equations with spoken explanations from the YouTube lecture transcript.
   - **Cross-Source Q&A:** Query both PDF and YouTube sources simultaneously with dual citations.
5. **Pillar 5 — Standout Feature: 5-Tier Complexity Slider**
   - Dynamically rewrites all summaries, argument maps, glossary definitions, and Q&A responses across 5 calibrated levels:
     - `1 - ELI5 (Explain Like I'm 5)`
     - `2 - High School Crash Course`
     - `3 - Undergraduate Lecture`
     - `4 - Graduate Seminar`
     - `5 - Academic Peer Review`

## Quick Start

```bash
npm install
npm run dev
```
