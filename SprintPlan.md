# FramePostReady — Sprint Plan for Windsurf IDE Build

**Product:** FramePostReady — AI-Powered Listing Content Generator by Frame & Form Studio
**Author:** Colby Hollins
**Version:** 1.0
**Date:** March 12, 2026
**IDE:** Windsurf (Codeium) with Cascade AI
**Methodology:** Solo-dev Agile / 1-week sprints

---

## Table of Contents

1. [Build Strategy Overview](#1-build-strategy-overview)
2. [Windsurf Environment Setup](#2-windsurf-environment-setup)
3. [Tech Stack Decisions](#3-tech-stack-decisions)
4. [Project Structure](#4-project-structure)
5. [Sprint 0 — Environment & Project Scaffolding](#sprint-0--environment--project-scaffolding)
6. [Sprint 1 — Database Foundation & Scraper](#sprint-1--database-foundation--scraper)
7. [Sprint 2 — Data Pipeline & Enrichment](#sprint-2--data-pipeline--enrichment)
8. [Sprint 3 — AI Content Engine Core](#sprint-3--ai-content-engine-core)
9. [Sprint 4 — Content Modules: Instagram, Facebook, MLS](#sprint-4--content-modules-instagram-facebook-mls)
10. [Sprint 5 — Content Modules: Email, Reel, Hashtags](#sprint-5--content-modules-email-reel-hashtags)
11. [Sprint 6 — Make.com Orchestration & Pipeline Wiring](#sprint-6--makecom-orchestration--pipeline-wiring)
12. [Sprint 7 — Compliance, QA & 5-Listing Validation](#sprint-7--compliance-qa--5-listing-validation)
13. [Sprint 8 — Client Pilot, Prompt Iteration & MVP Lock](#sprint-8--client-pilot-prompt-iteration--mvp-lock)
14. [Sprint 9 — Frontend: Content Dashboard UI](#sprint-9--frontend-content-dashboard-ui)
15. [Sprint 10 — Frontend: Input, Settings & Agent Management](#sprint-10--frontend-input-settings--agent-management)
16. [Sprint 11 — Export & Delivery System](#sprint-11--export--delivery-system)
17. [Sprint 12 — Client-Facing Launch & Polish](#sprint-12--client-facing-launch--polish)
18. [Windsurf Cascade Prompt Library](#18-windsurf-cascade-prompt-library)
19. [Daily Workflow SOP](#19-daily-workflow-sop)
20. [Risk Register & Contingency Plans](#20-risk-register--contingency-plans)
21. [Post-MVP Sprint Roadmap](#21-post-mvp-sprint-roadmap)

---

## 1. Build Strategy Overview

### Why Windsurf

Windsurf's Cascade AI agent is your force multiplier as a solo developer. It can scaffold entire files, write boilerplate, debug errors, and iterate on code in real-time. The strategy is to treat Cascade as a junior developer — you architect and direct, it writes and iterates.

### Build Philosophy

1. **Backend-first.** Get the data pipeline and AI engine working in the terminal before touching any UI. If the content output is bad, a beautiful frontend is worthless.
2. **API-first architecture.** Build a standalone Next.js API that handles scraping, AI generation, and data operations. The frontend consumes this API. This keeps the system modular and prepares it for Agent Engine integration later.
3. **Airtable as the database for MVP.** Don't over-engineer. Airtable gives you a visual database, built-in views, and API access. Migrate to PostgreSQL only if you hit Airtable's limits.
4. **Make.com for orchestration.** Use Make.com for the webhook triggers, scheduling, and multi-step workflows. Don't rebuild orchestration logic in code when Make.com handles it with drag-and-drop.
5. **Ship ugly, then polish.** MVP frontend is functional, not beautiful. Phase 2 sprints add the polish.

### Sprint Parameters

| Parameter | Value |
|---|---|
| Sprint Length | 1 week (Monday – Sunday) |
| Daily Work Window | 7:00 AM – 1:00 PM (6 hours before server shift prep) |
| Weekly Capacity | ~30 focused hours |
| Velocity Target | 15–20 story points |
| Tools | Windsurf IDE, Cascade AI, Terminal, Browser (Airtable, Make.com) |
| Version Control | Git + GitHub (private repo) |
| Deployment | Vercel (Next.js) + Make.com (automation) |

### Total Timeline

| Phase | Sprints | Duration | Outcome |
|---|---|---|---|
| **Phase 1 — MVP** | Sprints 0–8 | 9 weeks | Internal tool: Colby generates content for clients |
| **Phase 2 — Client-Facing** | Sprints 9–12 | 4 weeks | Agents can self-serve via web UI |
| **Total to Client Launch** | 12 sprints | ~3 months | Full product live |

---

## 2. Windsurf Environment Setup

### 2.1 Pre-Sprint Checklist

Complete these before Sprint 0 begins. Estimated time: 2–3 hours.

**Accounts & API Keys:**

- [ ] Anthropic API account created → API key generated (`sk-ant-...`)
- [ ] Apify account created → API token generated
- [ ] Airtable account created (free tier) → Personal Access Token generated
- [ ] Google Cloud project created → Google Drive API enabled → Service Account key (JSON) downloaded
- [ ] Make.com account created (Core plan, $9/mo)
- [ ] GitHub account ready → new private repo created: `framepostready`
- [ ] Vercel account created → linked to GitHub repo
- [ ] Domain purchased (optional for MVP): `framepostready.com` or subdomain of `frameandformstudio.com`

**Local Environment:**

- [ ] Node.js v20+ installed (`node -v` to verify)
- [ ] npm or pnpm installed
- [ ] Git installed and configured (`git config --global user.name`, `user.email`)
- [ ] Windsurf IDE installed and updated to latest version
- [ ] Windsurf Cascade AI enabled (verify in settings)

**Windsurf Configuration:**

- [ ] Open Windsurf → Settings → enable Cascade AI
- [ ] Set Cascade model to highest available (GPT-4 or Claude if available in Windsurf)
- [ ] Enable auto-save
- [ ] Install recommended extensions: ESLint, Prettier, Tailwind CSS IntelliSense, Prisma (optional for later), REST Client, GitLens
- [ ] Set terminal default to bash or zsh

### 2.2 Windsurf Cascade Usage Rules

These are your personal rules for working with Cascade. Following these consistently will save you hours of debugging.

**DO:**
- Give Cascade the full context of what you're building before asking it to write code. Paste the relevant section of this sprint plan or the Implementation Guide.
- Ask Cascade to write one file at a time. Don't ask it to scaffold 10 files in one prompt.
- Review every line Cascade writes before accepting. It's a junior dev, not a senior architect.
- Use Cascade's inline chat to ask "why did you do X?" when you don't understand its approach.
- Ask Cascade to write tests alongside code, not after.
- Use Cascade to refactor and clean up code after each sprint.

**DON'T:**
- Don't let Cascade make architectural decisions without your explicit direction.
- Don't accept code that you can't explain to someone else.
- Don't skip the "read what Cascade wrote" step — ever.
- Don't ask Cascade to write Make.com scenarios — that's a visual builder, not code. Use Cascade for the API endpoints and logic that Make.com calls.
- Don't let Cascade install packages you don't need. Keep dependencies minimal.

---

## 3. Tech Stack Decisions

### 3.1 Final Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Full-stack React framework, API routes built-in, deploys to Vercel in one click |
| **Language** | TypeScript | Catch bugs at compile time, better Cascade autocomplete |
| **Styling** | Tailwind CSS | Utility-first, fast to build, Cascade generates it well |
| **UI Components** | shadcn/ui | Copy-paste components, no heavy dependencies, works with Tailwind |
| **Database** | Airtable (via API) | Visual database, no migrations, built-in views, fast to iterate |
| **Airtable SDK** | `airtable` npm package | Official Node.js client |
| **AI Engine** | Anthropic Claude API (`@anthropic-ai/sdk`) | Best quality for structured content generation |
| **Scraper** | Apify Client (`apify-client`) | Managed Zillow scraping, no proxy headaches |
| **File Storage** | Google Drive API (`googleapis`) | Client delivery folders, PDF storage |
| **PDF Generation** | `@react-pdf/renderer` or `puppeteer` | Generate branded PDFs server-side |
| **Orchestration** | Make.com | Webhook-driven workflows, connects to everything |
| **Deployment** | Vercel | Zero-config Next.js hosting, automatic deploys from GitHub |
| **Email** | Resend (`resend` npm) or Gmail API | Transactional delivery emails |

### 3.2 Package List

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@anthropic-ai/sdk": "^0.24.0",
    "airtable": "^0.12.2",
    "apify-client": "^2.9.0",
    "googleapis": "^140.0.0",
    "resend": "^3.0.0",
    "zod": "^3.23.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0",
    "lucide-react": "^0.383.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.0.0",
    "prettier": "^3.2.0"
  }
}
```

---

## 4. Project Structure

```
framepostready/
├── .env.local                          # API keys (never committed)
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
│
├── src/
│   ├── app/                            # Next.js App Router
│   │   ├── layout.tsx                  # Root layout
│   │   ├── page.tsx                    # Landing / home
│   │   ├── dashboard/
│   │   │   ├── page.tsx                # Listing history / main dashboard
│   │   │   └── [listingId]/
│   │   │       └── page.tsx            # Content dashboard for a specific listing
│   │   ├── generate/
│   │   │   └── page.tsx                # Listing input / generation page
│   │   ├── settings/
│   │   │   └── page.tsx                # Settings page
│   │   └── api/                        # API routes
│   │       ├── scrape/
│   │       │   └── route.ts            # POST: Zillow URL → Apify → parsed data
│   │       ├── generate/
│   │       │   ├── route.ts            # POST: Generate all 6 content types
│   │       │   └── [contentType]/
│   │       │       └── route.ts        # POST: Regenerate single content type
│   │       ├── listings/
│   │       │   ├── route.ts            # GET: list, POST: create
│   │       │   └── [id]/
│   │       │       └── route.ts        # GET: single, PATCH: update
│   │       ├── content/
│   │       │   ├── route.ts            # GET: by listing
│   │       │   └── [id]/
│   │       │       └── route.ts        # PATCH: update, POST: regenerate
│   │       ├── agents/
│   │       │   ├── route.ts            # GET: list, POST: create
│   │       │   └── [id]/
│   │       │       └── route.ts        # GET, PATCH, DELETE
│   │       ├── export/
│   │       │   ├── pdf/
│   │       │   │   └── route.ts        # POST: generate PDF
│   │       │   └── drive/
│   │       │       └── route.ts        # POST: upload to Google Drive
│   │       └── webhook/
│   │           └── make/
│   │               └── route.ts        # POST: webhook for Make.com triggers
│   │
│   ├── lib/                            # Core business logic
│   │   ├── airtable/
│   │   │   ├── client.ts               # Airtable connection singleton
│   │   │   ├── listings.ts             # CRUD for Listings table
│   │   │   ├── content.ts              # CRUD for Content table
│   │   │   ├── agents.ts               # CRUD for Agents table
│   │   │   ├── prompts.ts              # CRUD for Prompt Templates table
│   │   │   └── delivery.ts             # CRUD for Delivery Log table
│   │   ├── ai/
│   │   │   ├── client.ts               # Anthropic client singleton
│   │   │   ├── generate.ts             # Main generation orchestrator
│   │   │   ├── prompts/
│   │   │   │   ├── instagram.ts        # Instagram prompt builder
│   │   │   │   ├── facebook.ts         # Facebook prompt builder
│   │   │   │   ├── mls.ts              # MLS prompt builder
│   │   │   │   ├── email.ts            # Email prompt builder
│   │   │   │   ├── reel.ts             # Reel script prompt builder
│   │   │   │   └── hashtags.ts         # Hashtag prompt builder
│   │   │   └── parser.ts              # Response parser & variant splitter
│   │   ├── scraper/
│   │   │   ├── apify.ts               # Apify Zillow scraper integration
│   │   │   ├── parser.ts              # Parse Apify response → structured data
│   │   │   └── enrichment.ts          # SWFL keyword enrichment logic
│   │   ├── compliance/
│   │   │   ├── scanner.ts             # MLS compliance scanner
│   │   │   └── blocklist.ts           # Blocked terms data & matching logic
│   │   ├── export/
│   │   │   ├── pdf.ts                 # PDF generation logic
│   │   │   └── drive.ts              # Google Drive upload logic
│   │   └── utils/
│   │       ├── formatting.ts          # Currency, text formatting helpers
│   │       ├── validation.ts          # URL validation, form validation
│   │       └── constants.ts           # SWFL keywords, blocked terms, config
│   │
│   ├── components/                    # React components
│   │   ├── ui/                        # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── listing/
│   │   │   ├── ListingInputForm.tsx
│   │   │   ├── ListingSummaryCard.tsx
│   │   │   └── ListingHistoryTable.tsx
│   │   ├── content/
│   │   │   ├── ContentTabs.tsx
│   │   │   ├── ContentCard.tsx
│   │   │   ├── VariantSelector.tsx
│   │   │   ├── ContentEditor.tsx
│   │   │   ├── CopyButton.tsx
│   │   │   ├── RegenerateButton.tsx
│   │   │   └── ApproveButton.tsx
│   │   ├── agent/
│   │   │   ├── AgentForm.tsx
│   │   │   └── AgentSelector.tsx
│   │   ├── export/
│   │   │   └── ExportBar.tsx
│   │   └── compliance/
│   │       └── ComplianceFlags.tsx
│   │
│   ├── hooks/                         # Custom React hooks
│   │   ├── useListing.ts
│   │   ├── useContent.ts
│   │   ├── useGenerate.ts
│   │   └── useClipboard.ts
│   │
│   └── types/                         # TypeScript types
│       ├── listing.ts
│       ├── content.ts
│       ├── agent.ts
│       ├── prompt.ts
│       └── api.ts
│
├── public/
│   ├── logo.svg                       # Frame & Form Studio logo
│   └── favicon.ico
│
├── data/
│   ├── swfl-keywords.json             # SWFL keyword master list
│   ├── blocked-terms.json             # MLS compliance blocked terms
│   └── shadowbanned-hashtags.json     # Instagram shadowban list
│
└── docs/
    ├── PRD.md                         # Product Requirements Document
    ├── implementation-guide.md        # Detailed Implementation Guide
    ├── backlog.md                     # Product Backlog
    └── sprint-plan.md                # This document
```

---

## Sprint 0 — Environment & Project Scaffolding

**Dates:** Week 0 (Setup week — can overlap with regular schedule)
**Goal:** Fully configured development environment, scaffolded project, all accounts and keys ready.
**Story Points:** 8 (setup, no backlog stories)

### Day 1 (Monday) — Accounts & Keys

**Time: 2 hours**

| Task | Windsurf Action | Verification |
|---|---|---|
| Create Anthropic API account, generate key | Browser | Test with `curl` in terminal |
| Create Apify account, generate token | Browser | Verify on Apify dashboard |
| Create Airtable account, generate PAT | Browser | Test with Airtable API playground |
| Set up Google Cloud project, enable Drive API, create Service Account | Browser | Download JSON key file |
| Create Make.com account (Core plan) | Browser | Verify login |
| Create GitHub repo `framepostready` (private) | Browser | Clone locally |

**Cascade Prompt — Test API Keys:**
```
I need to test my API connections. Write me a simple Node.js script called 
test-connections.js that:
1. Tests Anthropic API by sending a simple "Hello" message
2. Tests Airtable API by listing bases
3. Tests Apify API by getting account info
4. Tests Google Drive API by listing root files

Read the API keys from a .env file. Use dotenv package. Print success/failure 
for each connection.
```

### Day 2 (Tuesday) — Project Scaffolding

**Time: 3 hours**

**Cascade Prompt — Scaffold Next.js Project:**
```
Scaffold a new Next.js 14 project with the following configuration:
- App Router (not Pages Router)
- TypeScript
- Tailwind CSS
- src/ directory
- ESLint + Prettier
- Path alias: @/ maps to src/

After scaffolding, create the full folder structure I'll paste below. 
Create placeholder files (empty exports or TODO comments) for every 
file in the structure. Don't write implementation yet — just the 
skeleton with proper TypeScript types.

[Paste the project structure from Section 4 above]
```

**Cascade Prompt — Environment Variables:**
```
Create a .env.local file with the following variables (use placeholder 
values I'll replace):

ANTHROPIC_API_KEY=sk-ant-xxxxx
AIRTABLE_PAT=patxxxxx
AIRTABLE_BASE_ID=appxxxxx
APIFY_TOKEN=apify_api_xxxxx
GOOGLE_SERVICE_ACCOUNT_EMAIL=xxxxx@xxxxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nxxxxx\n-----END PRIVATE KEY-----"
GOOGLE_DRIVE_ROOT_FOLDER_ID=xxxxx
MAKE_WEBHOOK_SECRET=xxxxx
RESEND_API_KEY=re_xxxxx

Also create a .env.example with the same variables but empty values, 
and make sure .env.local is in .gitignore.
```

**Cascade Prompt — TypeScript Types:**
```
I'm building a real estate listing content generator called FramePostReady. 
Create the TypeScript type definitions for src/types/. Here are the data 
models:

[Paste the Airtable schema from Section 3 of the Implementation Guide — 
all 5 tables with their fields and types]

Create proper TypeScript interfaces for:
- Listing (matches Airtable Listings table)
- Agent (matches Airtable Agents table)
- ContentBlock (matches Airtable Content table)
- PromptTemplate (matches Airtable Prompt Templates table)
- DeliveryRecord (matches Airtable Delivery Log table)
- ListingInput (the form data from the user)
- GenerationResult (what the API returns after content generation)
- ScrapedListingData (raw data from Apify)

Use Zod schemas alongside the interfaces for runtime validation.
```

### Day 3 (Wednesday) — Airtable Base Setup

**Time: 3 hours**

This is done in the browser, not in Windsurf. But use Cascade to generate the Airtable setup verification script.

| Task | Where | Details |
|---|---|---|
| Create Airtable base "FramePostReady" | Airtable UI | New base from scratch |
| Create Listings table | Airtable UI | All fields per schema Section 3.1 |
| Create Agents table | Airtable UI | All fields per schema Section 3.2 |
| Create Content table | Airtable UI | All fields per schema Section 3.3 |
| Create Prompt Templates table | Airtable UI | All fields per schema Section 3.4 |
| Create Delivery Log table | Airtable UI | All fields per schema Section 3.5 |
| Link tables (Listings ↔ Agents, Listings ↔ Content) | Airtable UI | Linked record fields |
| Create dashboard views | Airtable UI | Kanban by Content Status, Active Agents, etc. |
| Enter 6 prompt templates | Airtable UI | Copy from Section 5 of Implementation Guide |
| Get Base ID and Table IDs | Airtable API docs | Update .env.local |

**Cascade Prompt — Airtable Client Library:**
```
Create the Airtable client library for src/lib/airtable/. I'm using the 
official 'airtable' npm package with a Personal Access Token.

Base ID is in process.env.AIRTABLE_BASE_ID.

Create these files:
1. client.ts — Airtable connection singleton, base reference
2. listings.ts — Functions: createListing, getListing, updateListing, 
   getListingByZpid, listListings (with filter options)
3. content.ts — Functions: createContentBlock, getContentByListing, 
   updateContentBlock, getContentBlock
4. agents.ts — Functions: createAgent, getAgent, listAgents, updateAgent
5. prompts.ts — Functions: getActivePromptsByType, getPromptTemplate
6. delivery.ts — Functions: createDeliveryRecord, getDeliveriesByListing

Use proper TypeScript types from src/types/. Handle errors gracefully.
Each function should return typed data, not raw Airtable records.
Map Airtable field names to our TypeScript interface property names.

Here are the exact Airtable field names for each table:
[Paste field names from the schema]
```

### Day 4 (Thursday) — Install Dependencies & Test

**Time: 2 hours**

```bash
# In Windsurf terminal
npm install @anthropic-ai/sdk airtable apify-client googleapis resend zod clsx tailwind-merge lucide-react
npm install -D @types/node @types/react
```

**Cascade Prompt — Connection Test Suite:**
```
Create a test script at scripts/test-setup.ts that:
1. Imports and tests the Airtable client — list all tables, verify 
   field names match our schema
2. Sends a test message to Anthropic Claude API (model: claude-sonnet-4-6)
3. Checks Apify connection
4. Verifies Google Drive access

Run with: npx tsx scripts/test-setup.ts

Print clear ✅ / ❌ for each connection with error details if failed.
```

### Day 5 (Friday) — Git Setup & First Commit

**Time: 1 hour**

```bash
git add .
git commit -m "Sprint 0: Project scaffolding, types, Airtable client, environment setup"
git push origin main
```

**Sprint 0 Exit Criteria:**
- [ ] All API keys are working (verified by test script)
- [ ] Airtable base is created with all 5 tables and correct fields
- [ ] 6 prompt templates are entered in the Prompt Templates table
- [ ] Next.js project runs locally (`npm run dev`)
- [ ] Full folder structure exists with placeholder files
- [ ] TypeScript types are defined for all data models
- [ ] Airtable CRUD library compiles without errors
- [ ] First commit pushed to GitHub

---

## Sprint 1 — Database Foundation & Scraper

**Goal:** Zillow URL goes in, structured listing data comes out and is stored in Airtable.
**Backlog Stories:** FPR-101, FPR-102, FPR-108, FPR-1301
**Story Points:** 13
**Key Deliverable:** Paste a Zillow URL in the terminal → see structured data in Airtable

### Day 1 (Monday) — Zillow URL Validation

**Stories:** FPR-101 (2 pts)
**Time:** 2 hours

**Cascade Prompt:**
```
Create src/lib/utils/validation.ts with a function validateZillowUrl(url: string) 
that:
1. Validates the URL is a proper Zillow listing URL (homedetails path)
2. Extracts the ZPID (numeric ID before _zpid in the URL)
3. Returns { isValid: boolean, zpid: string | null, error: string | null }

Also create src/lib/scraper/apify.ts with a class ApifyScraper that:
1. Takes a Zillow URL
2. Calls the Apify Zillow Scraper actor (actor ID: "petr_cermak~zillow-api-scraper" 
   or similar — I'll confirm the exact actor)
3. Waits for the run to complete (polling with timeout of 60 seconds)
4. Returns the raw dataset items

Use the apify-client package. API token from process.env.APIFY_TOKEN.
Handle errors: invalid URL, timeout, empty results, Apify errors.
```

### Day 2 (Tuesday) — Apify Response Parser

**Stories:** FPR-102 (5 pts, part 1)
**Time:** 4 hours

**Cascade Prompt:**
```
Create src/lib/scraper/parser.ts that takes raw Apify Zillow scraper output 
and parses it into our Listing TypeScript interface.

The Apify output looks like this (I'll paste a real example):
[Paste a real Apify Zillow response JSON — run one test scrape first]

Map the fields to our Listing type:
- address: combine streetAddress, city, state, zipcode
- price: from price field (number)
- beds: from bedrooms
- baths: from bathrooms
- sqft: from livingArea
- lotSize: from lotSize (convert to string with units)
- yearBuilt: from yearBuilt
- propertyType: from homeType (map SINGLE_FAMILY → "Single Family", etc.)
- originalDescription: from description
- keyFeatures: from resoFacts or facts array (extract relevant ones)
- photoUrls: from photos array (extract URLs)
- neighborhood: from subdivision or neighborhood field
- listingAgent: from listing agent info
- zpid: from zpid

Handle missing fields gracefully — set to null, don't throw.
Return a typed ParsedListing object.
```

### Day 3 (Wednesday) — SWFL Keyword Enrichment

**Stories:** FPR-104 reference (enrichment logic, not full story)
**Time:** 3 hours

**Cascade Prompt:**
```
Create src/lib/scraper/enrichment.ts with a function enrichWithSwflKeywords 
that takes a ParsedListing and returns an array of matched SWFL keywords.

The keyword matching rules are:
[Paste the full SWFL Keyword Enrichment Logic table from Section 4.2 
of the Implementation Guide]

Also create data/swfl-keywords.json with the master keyword list and 
matching rules as structured data.

The function should:
1. Scan description and keyFeatures for keyword matches
2. Apply the city-specific compound rules
3. Apply the year-based rules (new construction)
4. Return an array of matched keyword strings
5. Be case-insensitive
6. Handle partial matches (e.g., "canal" matches "canal front")
```

### Day 4 (Thursday) — Listing Storage & API Route

**Stories:** FPR-108 (3 pts)
**Time:** 4 hours

**Cascade Prompt:**
```
Create the API route at src/app/api/scrape/route.ts that:

1. Accepts POST with JSON body: { zillowUrl: string, agentId?: string }
2. Validates the Zillow URL
3. Checks Airtable for existing listing with same ZPID (deduplication)
4. Calls ApifyScraper to scrape the listing
5. Parses the response with our parser
6. Enriches with SWFL keywords
7. Creates a record in the Airtable Listings table
8. Returns the created listing data with its Airtable record ID

Use proper error handling and return appropriate HTTP status codes.
Return JSON responses with a consistent shape:
{ success: boolean, data?: Listing, error?: string }
```

**Manual Test:**
```bash
# Test with a real Cape Coral listing
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"zillowUrl": "https://www.zillow.com/homedetails/REAL-URL-HERE"}'
```

### Day 5 (Friday) — Blocked Terms List & Testing

**Stories:** FPR-1301 (3 pts)
**Time:** 3 hours

**Cascade Prompt:**
```
Create data/blocked-terms.json with the MLS compliance blocked terms list.
Structure it as:

{
  "fairHousing": [
    { "term": "perfect for families", "replacement": "spacious layout", "severity": "high" },
    ...
  ],
  "unsubstantiated": [
    { "term": "best", "replacement": "exceptional", "severity": "medium" },
    ...
  ],
  "overused": [
    { "term": "nestled", "replacement": "located", "severity": "low" },
    ...
  ]
}

Include ALL terms from this list:
[Paste the full blocked terms table from Section 10.1 of the Implementation Guide]

Also create src/lib/compliance/blocklist.ts that loads this data and exports 
a function getBlockedTerms() that returns the full categorized list.
```

### End of Sprint Test

```bash
# Run the full scrape pipeline
npx tsx scripts/test-scrape.ts "https://www.zillow.com/homedetails/REAL-LISTING/"

# Verify in Airtable: new record in Listings table with all fields populated
```

**Sprint 1 Exit Criteria:**
- [ ] Zillow URL validation works correctly
- [ ] Apify scraper returns structured data for a real listing
- [ ] Parser maps all fields to our Listing type
- [ ] SWFL keyword enrichment tags listings correctly
- [ ] Listing is created in Airtable with all fields populated
- [ ] Blocked terms data file is complete
- [ ] API route `/api/scrape` works end-to-end
- [ ] Git commit: "Sprint 1: Scraper pipeline and data storage"

---

## Sprint 2 — Data Pipeline & Enrichment

**Goal:** Complete the data intake pipeline with manual entry fallback, deduplication, error handling, and status management.
**Backlog Stories:** FPR-103, FPR-105, FPR-107, FPR-110, FPR-106
**Story Points:** 15
**Key Deliverable:** Robust listing intake that handles both Zillow URLs and manual entry, with proper error states

### Day 1 (Monday) — Manual Entry API Route

**Stories:** FPR-103 (5 pts, backend portion)
**Time:** 4 hours

**Cascade Prompt:**
```
Create a POST API route at src/app/api/listings/route.ts that accepts 
manually entered listing data.

Request body should match our ListingInput type (create this in types/listing.ts 
if not already defined):
{
  address: string (required)
  city: string (required)
  zip: string (required)
  price: number (required)
  beds: number (required)
  baths: number (required)
  sqft: number (required)
  propertyType: "Single Family" | "Condo" | "Townhome" | "Villa" | "Multi-Family" | "Vacant Land" (required)
  lotSize?: string
  yearBuilt?: number
  neighborhood?: string
  originalDescription?: string
  keyFeatures?: string
  uniqueSellingPoints?: string
  openHouseDate?: string
  priceChangeAmount?: number
  photoUrls?: string[]
  agentId?: string
  tone?: string
  targetBuyer?: string
  emailType?: string
  specialNotes?: string
}

Validate with Zod. Run SWFL enrichment. Create Airtable record.
Return the created listing.

Also add GET handler to list listings with optional filters 
(status, agentId, city).
```

### Day 2 (Tuesday) — Deduplication & Status Management

**Stories:** FPR-105 (2 pts), FPR-110 (2 pts)
**Time:** 3 hours

**Cascade Prompt:**
```
Update src/lib/airtable/listings.ts to add:

1. checkDuplicate(zpid?: string, address?: string) — checks if a listing 
   with the same ZPID or address already exists. Returns the existing 
   record if found, null if not.

2. updateStatus(listingId: string, status: ContentStatus) — updates the 
   Content Status field. Valid statuses: "Queued", "Scraping", 
   "Scrape Complete", "Scrape Failed", "Generating", "Content Ready", 
   "Delivered", "Archived"

3. Update the scrape API route to:
   - Call checkDuplicate before scraping
   - If duplicate found, return { duplicate: true, existingListing: ... }
   - Track status transitions throughout the pipeline (set "Scraping" 
     when starting, "Scrape Complete" when done, "Scrape Failed" on error)
```

### Day 3 (Wednesday) — Error Handling & Retry Logic

**Stories:** FPR-107 (3 pts)
**Time:** 3 hours

**Cascade Prompt:**
```
Enhance the scraper pipeline with robust error handling:

1. Update src/lib/scraper/apify.ts:
   - Add retry logic: if first attempt fails, wait 5 seconds, retry once
   - Add timeout: if Apify run exceeds 90 seconds, abort and mark as failed
   - Categorize errors: TIMEOUT, APIFY_ERROR, EMPTY_RESULT, PARSE_ERROR, UNKNOWN

2. Create src/lib/utils/notifications.ts with a function sendAlert 
   that sends a notification when something fails:
   - For MVP, use console.error + a Resend email to colby@frameandform.com
   - Include: failed URL, error type, error message, timestamp
   - Later this will also trigger Make.com webhook for Slack

3. Update the scrape route to:
   - Set status to "Scrape Failed" on any error
   - Call sendAlert with error details
   - Return helpful error message to the user
```

### Day 4 (Thursday) — Supplemental Context Handling

**Stories:** FPR-106 (3 pts)
**Time:** 3 hours

**Cascade Prompt:**
```
Create the supplemental context system:

1. Update the Listing type and Airtable schema to include:
   - tone: "Luxury" | "Family-Friendly" | "Investor-Focused" | "First-Time Buyer" | "Neutral"
   - targetBuyer: "Relocator" | "Snowbird" | "First-Time Buyer" | "Investor" | "Downsizer" | "Upsizer" | "Military/VA"
   - emailType: "Just Listed" | "Open House" | "Price Reduction" | "Back on Market" | "Under Contract"
   - uniqueSellingPoints: string
   - specialNotes: string
   - openHouseDate: string
   - priceChangeAmount: number

2. Update both API routes (scrape and manual entry) to accept and 
   store these supplemental fields

3. Create a helper function buildPromptVariables(listing: Listing, agent: Agent) 
   in src/lib/ai/generate.ts that combines all listing data, agent data, 
   and supplemental context into a flat key-value map of template variables 
   like { "{address}": "1234 Example St", "{price}": "425,000", ... }
```

### Day 5 (Friday) — Integration Test & Cleanup

**Time:** 3 hours

**Cascade Prompt:**
```
Create a comprehensive integration test script at scripts/test-pipeline.ts 
that:

1. Tests the scrape pipeline with a real Zillow URL:
   - Scrape → Parse → Enrich → Store → Verify in Airtable
   
2. Tests the manual entry pipeline:
   - Submit manual data → Enrich → Store → Verify in Airtable
   
3. Tests deduplication:
   - Submit the same listing twice → verify duplicate detection
   
4. Tests error handling:
   - Submit an invalid URL → verify proper error response
   - Submit a removed listing URL → verify graceful failure

Print a summary of all test results with ✅ / ❌.

Also run a code cleanup pass:
- Remove any TODO comments that are now resolved
- Ensure all functions have proper JSDoc comments
- Verify all TypeScript types are used correctly (no 'any')
```

**Sprint 2 Exit Criteria:**
- [ ] Manual entry API route creates listings in Airtable
- [ ] Deduplication prevents double-processing
- [ ] Error handling catches and reports all failure modes
- [ ] Status lifecycle updates correctly at each pipeline stage
- [ ] Supplemental context fields are stored and retrievable
- [ ] buildPromptVariables returns complete variable map
- [ ] Integration test passes all scenarios
- [ ] Git commit: "Sprint 2: Data pipeline, enrichment, error handling"

---

## Sprint 3 — AI Content Engine Core

**Goal:** Send a listing's data to Claude API and get structured content back, parsed into individual variants and stored in Airtable.
**Backlog Stories:** FPR-201, FPR-202, FPR-203, FPR-204, FPR-205
**Story Points:** 17
**Key Deliverable:** Call one API endpoint with a listing ID → get 6 content types generated and stored

### Day 1 (Monday) — Anthropic Client & Prompt Retrieval

**Stories:** FPR-201 (3 pts), FPR-203 (5 pts, part 1)
**Time:** 4 hours

**Cascade Prompt:**
```
Create the AI engine foundation:

1. src/lib/ai/client.ts — Anthropic client singleton
   - Initialize @anthropic-ai/sdk with process.env.ANTHROPIC_API_KEY
   - Export a function callClaude(systemPrompt: string, userPrompt: string, 
     options?: { temperature?: number, maxTokens?: number }) that:
     - Sends a message to claude-sonnet-4-6
     - Returns { text: string, inputTokens: number, outputTokens: number }
     - Handles rate limits with exponential backoff (1 retry)
     - Handles API errors gracefully

2. Update src/lib/airtable/prompts.ts:
   - getActivePrompts() — returns all 6 active prompt templates
   - getPromptByType(contentType: string) — returns the active template 
     for a specific content type

3. Verify by writing a quick test: pull the Instagram prompt template 
   from Airtable, merge in test variables, send to Claude, print response.
```

### Day 2 (Tuesday) — Variable Merging Engine

**Stories:** FPR-202 (3 pts)
**Time:** 3 hours

**Cascade Prompt:**
```
Create the variable merging engine in src/lib/ai/generate.ts:

Function: mergeVariables(template: string, variables: Record<string, string>): string

Rules:
1. Replace all {variable_name} placeholders with actual values
2. If a variable value is null/undefined/empty, replace with "Not provided"
3. Format currency values with commas and $ sign ($425,000)
4. Join array values (key_features, swfl_keywords) as comma-separated strings
5. Trim excessive whitespace from the final merged prompt
6. Log a warning if any {variable} placeholders remain after merging 
   (indicates a missing variable mapping)

Also create buildPromptVariables(listing: Listing, agent: Agent | null): 
Record<string, string> that maps all our data fields to the prompt 
variable names:
- listing.address → "{address}"
- listing.price → "{price}" (formatted as currency)
- listing.beds → "{beds}"
[Include ALL variables from Appendix A of the Implementation Guide]

Test with a real prompt template and real listing data — print the 
fully merged prompt.
```

### Day 3 (Wednesday) — Content Generation Orchestrator

**Stories:** FPR-203 (5 pts, part 2), FPR-204 (3 pts)
**Time:** 5 hours

**Cascade Prompt:**
```
Create the main content generation orchestrator in src/lib/ai/generate.ts:

Function: generateAllContent(listingId: string): Promise<GenerationResult>

This function:
1. Fetches the listing from Airtable by ID
2. Fetches the agent from Airtable (if linked)
3. Builds the variable map (buildPromptVariables)
4. Fetches all 6 active prompt templates from Airtable
5. For each content type (instagram, facebook, mls, email, reel, hashtags):
   a. Merge variables into the system prompt and user prompt
   b. Call Claude API with the merged prompts
   c. Parse the response into individual variants
   d. Store each variant as a Content record in Airtable
6. Update listing status to "Content Ready"
7. Return a summary: { listingId, contentTypes generated, total tokens, 
   total cost, errors if any }

Run all 6 API calls sequentially (not parallel — avoid rate limits in MVP).
Log timing for each call.

For the response parser (src/lib/ai/parser.ts):
- Split on "---" delimiter
- Extract variant labels from headers (e.g., "VARIANT 1 — HOOK-DRIVEN")
- Clean up whitespace and formatting
- Return an array of { label: string, text: string } objects
- If no delimiters found, return the entire response as a single variant 
  with label "Default" and log a parse warning
```

### Day 4 (Thursday) — Content Storage & API Route

**Stories:** FPR-205 (3 pts)
**Time:** 4 hours

**Cascade Prompt:**
```
1. Verify the content storage functions in src/lib/airtable/content.ts 
   are working correctly. Each variant should create a Content record with:
   - Listing link (to parent listing)
   - Content Type (Instagram, Facebook, MLS, Email, Reel Script, Hashtags)
   - Variant Label (e.g., "Hook-Driven")
   - Generated Text (the full content)
   - Version (1 for first generation)
   - Status ("Draft")
   - Prompt Template Used (template name and version)
   - Token Count Input and Output
   - API Cost (calculated from token counts)

2. Create the API route at src/app/api/generate/route.ts:
   - POST with body: { listingId: string }
   - Calls generateAllContent
   - Returns the generation summary
   - Updates listing status throughout the process

3. Create the API route at src/app/api/content/route.ts:
   - GET with query param: listingId
   - Returns all content blocks for a listing, grouped by content type
   - Each content type includes all its variants
```

### Day 5 (Friday) — End-to-End Test

**Time:** 3 hours

**Test Script:**
```bash
# Step 1: Scrape a real listing
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"zillowUrl": "REAL_URL_HERE"}'

# Step 2: Generate content (use the listing ID from step 1)
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"listingId": "rec_XXXXX"}'

# Step 3: Retrieve content
curl http://localhost:3000/api/content?listingId=rec_XXXXX
```

**Cascade Prompt — End-to-End Test Script:**
```
Create scripts/test-full-pipeline.ts that:
1. Scrapes a real SWFL listing (I'll provide the URL)
2. Generates all 6 content types
3. Retrieves and displays all generated content
4. Prints timing for each step
5. Prints total API cost
6. Verifies all 6 content types are present in Airtable
7. Verifies variant counts: Instagram (3), Facebook (2), MLS (2), 
   Email (subject lines + body), Reel (2), Hashtags (main + first comment)

This is the most important test so far — it validates the entire core 
pipeline.
```

**Sprint 3 Exit Criteria:**
- [ ] Claude API calls work reliably
- [ ] Variable merging produces correct, complete prompts
- [ ] All 6 content types generate successfully
- [ ] Response parser correctly splits variants
- [ ] Content records are stored in Airtable with all metadata
- [ ] Token counts and costs are tracked
- [ ] Full pipeline test passes (URL → scrape → generate → store → retrieve)
- [ ] Git commit: "Sprint 3: AI content engine core"

---

## Sprint 4 — Content Modules: Instagram, Facebook, MLS

**Goal:** Refine the three highest-priority content modules with proper prompt engineering, tone customization, and compliance scanning.
**Backlog Stories:** FPR-301, FPR-302, FPR-401, FPR-501, FPR-503
**Story Points:** 20
**Key Deliverable:** Instagram, Facebook, and MLS outputs are high quality and MLS-compliant

### Day 1 (Monday) — Instagram Prompt Refinement

**Stories:** FPR-301 (5 pts), FPR-302 (3 pts)
**Time:** 5 hours

**Process (not a Cascade prompt — this is manual prompt engineering):**

1. Run the existing Instagram prompt against 3 different real listings
2. Score each output against the acceptance criteria from Story 3.1
3. Identify weaknesses (generic hooks? missing emojis? bad formatting?)
4. Edit the prompt template in Airtable (increment version)
5. Rerun and compare

**Cascade Prompt — Prompt Builder Functions:**
```
Create src/lib/ai/prompts/instagram.ts with:

1. buildInstagramPrompt(listing: Listing, agent: Agent | null, 
   options: { tone: string }): { systemPrompt: string, userPrompt: string }

   This function builds the Instagram prompt dynamically rather than 
   just pulling from Airtable. It:
   - Starts with the base system prompt from Airtable
   - Injects tone-specific instructions based on the tone parameter:
     - "Luxury": add instructions for aspirational language, exclusivity cues
     - "Family-Friendly": emphasize space, safety, community
     - "Investor-Focused": highlight ROI, rental potential, numbers
     - "First-Time Buyer": approachable tone, explain value
     - "Neutral": professional, balanced
   - Merges all listing variables into the user prompt
   - Returns the final system and user prompts

2. parseInstagramResponse(response: string): InstagramVariant[]
   - Splits into 3 variants
   - Extracts labels
   - Validates each variant has: hook line, emojis, CTA, proper length
   - Returns typed array
```

### Day 2 (Tuesday) — Facebook Prompt Refinement

**Stories:** FPR-401 (5 pts)
**Time:** 4 hours

**Same process as Instagram: test against real listings, score, iterate.**

**Cascade Prompt:**
```
Create src/lib/ai/prompts/facebook.ts with:

1. buildFacebookPrompt(listing: Listing, agent: Agent | null, 
   options: { tone: string }): { systemPrompt: string, userPrompt: string }

2. parseFacebookResponse(response: string): FacebookVariant[]
   - Splits into 2 variants (Community-Focused, Feature-Focused)
   - Validates: paragraph formatting, engagement hook present, 
     CTA with contact info, proper length (200-500 words)
```

### Day 3 (Wednesday) — MLS Prompt Refinement + Compliance Scanner

**Stories:** FPR-501 (5 pts), FPR-503 (5 pts)
**Time:** 5 hours

**Cascade Prompt:**
```
Create src/lib/ai/prompts/mls.ts with:

1. buildMlsPrompt(listing: Listing, options: { shortLimit: number, 
   longLimit: number }): { systemPrompt: string, userPrompt: string }

2. parseMlsResponse(response: string): { short: MlsVersion, long: MlsVersion }
   - Extract short and long versions
   - Count characters for each
   - Flag if over limit

Then create src/lib/compliance/scanner.ts with:

1. scanForCompliance(text: string): ComplianceScanResult
   Returns: {
     isClean: boolean,
     flags: Array<{
       term: string,
       category: "fairHousing" | "unsubstantiated" | "overused",
       severity: "high" | "medium" | "low",
       position: number,
       replacement: string
     }>
   }

2. Scan is case-insensitive
3. Matches whole words and common phrases (not partial word matches — 
   "best" shouldn't flag "bestow")
4. Load blocked terms from data/blocked-terms.json

Integrate the scanner: after MLS content is generated, automatically 
run the compliance scan and store the results alongside the content.
```

### Day 4 (Thursday) — Quality Testing: 3 Real Listings

**Time:** 4 hours

Run all three modules (Instagram, Facebook, MLS) against 3 real SWFL listings:
1. Cape Coral Gulf access pool home (~$500K)
2. Naples condo (~$300K)
3. Fort Myers new construction (~$400K)

**Cascade Prompt:**
```
Create scripts/test-content-quality.ts that:

1. Takes a listing ID as input
2. Generates Instagram, Facebook, and MLS content
3. For each output, runs automated quality checks:

   Instagram:
   - Hook line is not in a "generic hooks" list I'll provide
   - Contains 3-6 emojis
   - Contains line breaks
   - Word count between 150-300
   - Contains agent handle
   - Contains CTA keywords (DM, call, link, bio)
   - No banned words

   Facebook:
   - Word count between 200-500
   - Contains paragraph breaks (not short line breaks)
   - Contains a question mark (engagement hook)
   - Contains agent contact info
   - No banned words

   MLS:
   - Short version under character limit
   - Long version under character limit
   - Compliance scan passes (no flags)
   - Contains at least 2 SWFL keywords
   - No banned words

Print a quality report with scores for each check.
```

### Day 5 (Friday) — Prompt Iterations & Commit

**Time:** 3 hours

Based on quality test results:
1. Update prompt templates in Airtable (increment versions)
2. Rerun tests
3. Repeat until quality score averages 4.0+

**Sprint 4 Exit Criteria:**
- [ ] Instagram generates 3 quality variants with tone customization
- [ ] Facebook generates 2 quality variants
- [ ] MLS generates compliant short and long versions
- [ ] Compliance scanner detects all blocked terms
- [ ] Tested against 3 real SWFL listings with 4.0+ average quality
- [ ] Git commit: "Sprint 4: Instagram, Facebook, MLS modules refined"

---

## Sprint 5 — Content Modules: Email, Reel, Hashtags

**Goal:** Complete the remaining 3 content modules and wire them into the generation pipeline.
**Backlog Stories:** FPR-601, FPR-602, FPR-701, FPR-801, FPR-802
**Story Points:** 20
**Key Deliverable:** All 6 content types generate at production quality

### Day 1 (Monday) — Email Module

**Stories:** FPR-601 (5 pts), FPR-602 (3 pts)
**Time:** 5 hours

**Cascade Prompt:**
```
Create src/lib/ai/prompts/email.ts with:

1. buildEmailPrompt(listing: Listing, agent: Agent | null, 
   options: { emailType: string, openHouseDate?: string, 
   priceChangeAmount?: number }): { systemPrompt: string, userPrompt: string }

   Supports email types: "Just Listed", "Open House", "Price Reduction", 
   "Back on Market"

   The email type changes the prompt significantly:
   - Just Listed: excitement, new opportunity framing
   - Open House: event-driven, date prominent, RSVP CTA
   - Price Reduction: second-chance opportunity, new value comparison
   - Back on Market: urgency, "this won't last twice"

2. parseEmailResponse(response: string): EmailContent
   Returns: {
     subjectLines: string[] (3 variants),
     previewText: string,
     body: string (with **bold** markers preserved),
     ctaButtonText: string
   }

Validate: subject lines under 50 chars, preview text 40-90 chars, 
body 150-250 words.
```

### Day 2 (Tuesday) — Reel Script Module

**Stories:** FPR-701 (5 pts)
**Time:** 5 hours

**Cascade Prompt:**
```
Create src/lib/ai/prompts/reel.ts with:

1. buildReelPrompt(listing: Listing, agent: Agent | null, 
   options: { tone: string }): { systemPrompt: string, userPrompt: string }

2. parseReelResponse(response: string): ReelScript[]
   Returns array of 2 scripts, each containing:
   {
     title: string,
     style: "Walkthrough" | "Fast-Cut",
     totalRuntime: string,
     musicCue: string,
     shots: Array<{
       shotNumber: number,
       duration: string,
       visualDirection: string,
       voiceoverOrOverlay: string,
       notes: string
     }>
   }

   Parse the table format from the AI response. Handle both markdown 
   table format and plain text format. Validate that shot durations 
   sum to stated total runtime (within 5 second tolerance).
```

### Day 3 (Wednesday) — Hashtag Module

**Stories:** FPR-801 (5 pts), FPR-802 (2 pts)
**Time:** 4 hours

**Cascade Prompt:**
```
Create src/lib/ai/prompts/hashtags.ts with:

1. buildHashtagPrompt(listing: Listing, 
   options: { seedHashtags?: string[] }): { systemPrompt: string, userPrompt: string }

   If seedHashtags are provided (from agent or global settings), 
   include them in the prompt as "always include these tags."

2. parseHashtagResponse(response: string): HashtagResult
   Returns: {
     mainSet: string[] (30 hashtags),
     firstCommentSet: string[] (15 hashtags),
     categorized: {
       location: string[],
       propertyType: string[],
       lifestyle: string[],
       broadReach: string[]
     }
   }

   Validate: all lowercase, no spaces within tags, all start with #, 
   no duplicates across main and first comment sets.

Also create data/shadowbanned-hashtags.json with known shadowbanned 
Instagram hashtags. Add a filter step that removes any matched tags 
from the output.
```

### Day 4 (Thursday) — Full Pipeline Integration Test

**Time:** 4 hours

**Cascade Prompt:**
```
Update the generateAllContent function in src/lib/ai/generate.ts to:
1. Use the module-specific prompt builders (instagram.ts, facebook.ts, 
   mls.ts, email.ts, reel.ts, hashtags.ts) instead of generic template merging
2. Use the module-specific response parsers
3. Run the MLS compliance scan after MLS generation
4. Track timing and cost per content type

Then create scripts/test-all-content.ts that:
1. Takes a real listing ID
2. Generates all 6 content types
3. Displays a formatted output of all generated content
4. Shows quality metrics: word counts, character counts, variant counts, 
   compliance flags, timing per type, total cost
5. Saves the output to a local markdown file for manual review
```

### Day 5 (Friday) — Quality Pass & Prompt Iteration

**Time:** 3 hours

Run against 2 real listings. Score all outputs. Iterate prompts in Airtable. Rerun until satisfied.

**Sprint 5 Exit Criteria:**
- [ ] Email generates with 3 subject lines, preview text, body, CTA
- [ ] "Just Listed" and "Open House" email types work correctly
- [ ] Reel scripts generate with proper timed shot tables
- [ ] Reel script timings add up correctly
- [ ] Hashtags generate 30 main + 15 first comment tags
- [ ] Shadowbanned hashtags are filtered out
- [ ] All 6 content types generate end-to-end from a single API call
- [ ] Git commit: "Sprint 5: Email, Reel, Hashtag modules complete"

---

## Sprint 6 — Make.com Orchestration & Pipeline Wiring

**Goal:** Build the Make.com scenarios that automate the full pipeline from webhook trigger to content generation to notification.
**Backlog Stories:** FPR-1501, FPR-1502, FPR-1504
**Story Points:** 19
**Key Deliverable:** Trigger a Make.com webhook → entire pipeline runs automatically → notification on completion

### Day 1 (Monday) — Webhook Endpoint for Make.com

**Stories:** FPR-1504 (3 pts)
**Time:** 3 hours

**Cascade Prompt:**
```
Create the webhook endpoint at src/app/api/webhook/make/route.ts:

This is the endpoint that Make.com will call to trigger various actions.

POST body: {
  action: "scrape" | "generate" | "export",
  secret: string,
  payload: {
    // For "scrape": { zillowUrl: string, agentId?: string, tone?: string, ... }
    // For "generate": { listingId: string }
    // For "export": { listingId: string, deliveryMethod: string }
  }
}

1. Validate the secret against process.env.MAKE_WEBHOOK_SECRET
2. Route to the appropriate handler based on action
3. Return 200 with result or 401/400/500 with error

This endpoint is the bridge between Make.com and our Next.js backend.
```

### Day 2–3 (Tuesday–Wednesday) — Make.com Scenario 1: Listing Intake

**Stories:** FPR-1501 (8 pts)
**Time:** 8 hours (this is the most complex Make.com work)

This is done in the Make.com visual builder, not in Windsurf. Document the scenario as you build it.

**Make.com Scenario 1 — Step by Step:**

| Step | Module | Configuration |
|---|---|---|
| 1 | **Custom Webhook** | Create new webhook. Name: "FPR Listing Intake." Copy the webhook URL. |
| 2 | **HTTP — Make a Request** | POST to `https://your-vercel-app.vercel.app/api/scrape`. Body: `{ "zillowUrl": "{{1.zillowUrl}}", "agentId": "{{1.agentId}}" }`. Headers: Content-Type application/json. |
| 3 | **JSON — Parse JSON** | Parse the response body from Step 2. |
| 4 | **Router** | Route 1: success (response.success = true). Route 2: failure. |
| 5a (success) | **HTTP — Make a Request** | POST to `https://your-vercel-app.vercel.app/api/generate`. Body: `{ "listingId": "{{3.data.id}}" }`. |
| 5b (failure) | **Email (Gmail/Resend)** | Send failure alert to colby@frameandformstudio.com. Subject: "FPR Scrape Failed: {{1.zillowUrl}}". Body: error details. |
| 6 | **JSON — Parse JSON** | Parse generation response. |
| 7 | **Email (Gmail/Resend)** | Send success notification. Subject: "Content Ready: {{3.data.address}}". Body: listing summary + link to Airtable record. |

**Cascade Prompt — Documentation:**
```
Create docs/make-scenarios.md with detailed documentation of Make.com 
Scenario 1. Include:
- Scenario name and purpose
- Trigger type and webhook URL
- Each module in sequence with its configuration
- Data mappings between modules
- Error handling routes
- Test instructions
- Screenshots placeholder notes (I'll add these manually)
```

### Day 4 (Thursday) — Make.com Scenario 2: Content Generation

**Stories:** FPR-1502 (8 pts)
**Time:** 4 hours

Since Scenario 1 already calls our `/api/generate` endpoint, Scenario 2 is simpler — it's the standalone trigger for regeneration or manual generation.

**Make.com Scenario 2 — Step by Step:**

| Step | Module | Configuration |
|---|---|---|
| 1 | **Custom Webhook** | Name: "FPR Generate Content." Receives: { listingId, contentType? (optional, for single regeneration) } |
| 2 | **Router** | Route 1: contentType is empty (generate all). Route 2: contentType is specified (regenerate single). |
| 3a (all) | **HTTP** | POST to `/api/generate` with { listingId } |
| 3b (single) | **HTTP** | POST to `/api/generate/[contentType]` with { listingId } |
| 4 | **JSON Parse** | Parse response |
| 5 | **Email** | Notification to Colby |

### Day 5 (Friday) — Testing Make.com Integration

**Time:** 4 hours

**Test sequence:**
1. Send a test webhook to Scenario 1 with a real Zillow URL
2. Verify: scrape completes, listing appears in Airtable, content generates, notification email arrives
3. Time the full end-to-end pipeline
4. Test error paths: invalid URL, removed listing

**Sprint 6 Exit Criteria:**
- [ ] Webhook endpoint validates secrets and routes correctly
- [ ] Make.com Scenario 1 runs end-to-end (URL → scrape → generate → notify)
- [ ] Make.com Scenario 2 handles both full and single regeneration
- [ ] Error notifications sent on failure
- [ ] Success notifications sent on completion
- [ ] Full pipeline takes under 3 minutes end-to-end
- [ ] Make.com scenarios documented
- [ ] Git commit: "Sprint 6: Make.com orchestration and webhook integration"

---

## Sprint 7 — Compliance, QA & 5-Listing Validation

**Goal:** Run the complete system against 5 diverse real SWFL listings, score quality, iterate prompts, and verify compliance.
**Backlog Stories:** FPR-1302, FPR-1303, FPR-2001, FPR-1304
**Story Points:** 16
**Key Deliverable:** 5 real listings processed with 4.0+ average quality score

### Day 1 (Monday) — Automated Compliance Integration

**Stories:** FPR-1302 (5 pts)
**Time:** 4 hours

**Cascade Prompt:**
```
Integrate the compliance scanner into the generation pipeline:

1. After MLS description generation, automatically run scanForCompliance()
2. Store the scan results in the Content record (add a new field 
   "complianceFlags" in the Content type and Airtable)
3. If any high-severity flags are found, log a warning

Also update the compliance scanner to scan ALL content types, not just MLS:
- Instagram: check for banned words, check for fair housing language
- Facebook: same as Instagram
- Email: check subject lines and body
- Reel script: check voiceover text
- Hashtags: check against shadowban list

4. Create an API endpoint GET /api/content/[id]/compliance that returns 
   the compliance scan results for a specific content block
```

### Day 2 (Tuesday) — QA Checklist System

**Stories:** FPR-1303 (3 pts)
**Time:** 3 hours

**Cascade Prompt:**
```
Create a QA checklist system:

1. src/lib/compliance/qa-checklist.ts with:
   - generateQaChecklist(listing: Listing, content: ContentBlock[]): QaChecklist
   - The checklist auto-populates these items:
     [Paste the full QA checklist from Section 10.2 of the Implementation Guide]
   - Items that can be auto-verified are pre-checked (e.g., character counts, 
     banned word absence, variant counts)
   - Items requiring human review are left unchecked

2. API endpoint: GET /api/listings/[id]/qa — returns the QA checklist
3. API endpoint: PATCH /api/listings/[id]/qa — update checklist items 
   (mark as checked/unchecked)
```

### Day 3 (Wednesday) — Shadowban List & Hashtag Compliance

**Stories:** FPR-1304 (2 pts)
**Time:** 2 hours

**Cascade Prompt:**
```
Finalize the hashtag compliance system:

1. Update data/shadowbanned-hashtags.json with a comprehensive list 
   (research current Instagram shadowbanned tags — I'll provide sources)
2. Ensure the hashtag parser filters these before output
3. Add a validation step that checks for:
   - Duplicate tags between main and first comment sets
   - Tags with spaces or special characters
   - Tags that are too long (over 30 characters)
   - Tags that are too generic ("#home", "#house") — flag but don't remove
```

### Day 3–5 (Wednesday–Friday) — 5-Listing Validation Test

**Stories:** FPR-2001 (5 pts)
**Time:** 12 hours across 3 days

**The 5 test listings:**

| # | Type | City | Price Range | Zillow URL |
|---|---|---|---|---|
| 1 | Gulf Access Pool Home | Cape Coral | $400K–$600K | [Find real URL] |
| 2 | Gated Community Condo | Naples | $250K–$400K | [Find real URL] |
| 3 | New Construction | Fort Myers | $350K–$500K | [Find real URL] |
| 4 | Vacant Canal Lot | Cape Coral | $100K–$200K | [Find real URL] |
| 5 | Luxury Waterfront | Naples | $1M+ | [Find real URL] |

**For each listing:**
1. Trigger Make.com Scenario 1 with the URL
2. Wait for pipeline to complete
3. Review all generated content in Airtable
4. Score each content type using the evaluation criteria
5. Run QA checklist
6. Document issues
7. Iterate prompts if needed

**Cascade Prompt — Scoring Dashboard:**
```
Create scripts/quality-report.ts that:

1. Takes a listing ID
2. Pulls all content from Airtable
3. Runs automated quality checks per content type
4. Generates a markdown quality report with:
   - Per-content-type scores (1-5, automated where possible)
   - Compliance scan results
   - Word/character counts vs. targets
   - Hook analysis (first line of Instagram, first 3 seconds of Reel)
   - SWFL keyword coverage
   - Overall automated quality score
5. Saves report to docs/quality-reports/[address].md
```

**Sprint 7 Exit Criteria:**
- [ ] Compliance scanner integrated into generation pipeline
- [ ] QA checklist auto-populates for each listing
- [ ] Shadowbanned hashtag filtering works
- [ ] All 5 test listings processed end-to-end successfully
- [ ] Average quality score across all 5 listings is 4.0+
- [ ] No high-severity compliance flags in any MLS output
- [ ] All quality reports documented
- [ ] Prompts iterated to at least version 2 for any underperforming module
- [ ] Git commit: "Sprint 7: Compliance, QA, 5-listing validation complete"

---

## Sprint 8 — Client Pilot, Prompt Iteration & MVP Lock

**Goal:** Generate content for 3 real Frame & Form clients, collect feedback, final prompt iterations, and lock the MVP for internal use.
**Backlog Stories:** FPR-2002, FPR-2004, FPR-1101, FPR-206
**Story Points:** 14
**Key Deliverable:** 3 clients received content, feedback is positive, MVP is stable

### Day 1 (Monday) — Agent Profile Setup

**Stories:** FPR-1101 (3 pts)
**Time:** 2 hours

Create 3 real agent profiles in Airtable for the pilot clients. Include all their real info: name, handle, brokerage, phone, preferred tone.

### Day 2 (Tuesday) — Client Listing 1

**Stories:** FPR-2004 (part 1)
**Time:** 4 hours

1. Get a real active listing from Client 1
2. Run through full pipeline
3. Review all content
4. Run QA checklist
5. Manually edit anything that's not up to standard
6. Export to Google Drive (manual for now)
7. Deliver to client

### Day 3 (Wednesday) — Client Listings 2 & 3

**Time:** 5 hours

Same process for clients 2 and 3.

### Day 4 (Thursday) — Regeneration Feature + Feedback Collection

**Stories:** FPR-206 (3 pts)
**Time:** 4 hours

**Cascade Prompt:**
```
Create the single content block regeneration API route at 
src/app/api/generate/[contentType]/route.ts:

POST with body: { listingId: string }
The [contentType] path parameter is one of: instagram, facebook, mls, 
email, reel, hashtags

This route:
1. Fetches the listing data
2. Generates only the specified content type
3. Creates new Content records with version incremented
4. Preserves the original version records
5. Returns the new content
```

Collect feedback from all 3 pilot clients (call, email, or text). Document in Airtable Delivery Log.

### Day 5 (Friday) — Final Prompt Iterations & MVP Lock

**Stories:** FPR-2002 (5 pts, final iteration)
**Time:** 4 hours

Based on client feedback:
1. Identify any content types that needed heavy editing
2. Update those prompt templates
3. Rerun against the same listing to verify improvement
4. Lock prompt template versions as "MVP Production"
5. Document the final state of all prompt templates

**MVP Lock Checklist:**
- [ ] All 6 content types generate reliably
- [ ] Average quality score is 4.0+ across test listings
- [ ] 3 real clients received content and gave positive feedback (4+ rating)
- [ ] Compliance scanner catches all known blocked terms
- [ ] Make.com pipelines run end-to-end without manual intervention
- [ ] Error handling and notifications are working
- [ ] All prompt templates versioned and documented
- [ ] Total generation time per listing is under 3 minutes
- [ ] API cost per listing is under $0.05

**Git commit: "Sprint 8: MVP LOCKED — client pilot complete, prompts finalized"**

---

## Sprint 9 — Frontend: Content Dashboard UI

**Goal:** Build the primary content dashboard where users view, review, and interact with generated content.
**Backlog Stories:** FPR-901, FPR-902, FPR-903, FPR-904, FPR-905, FPR-906, FPR-907
**Story Points:** 22
**Key Deliverable:** Working content dashboard UI that displays and allows interaction with all 6 content types

### Day 1 (Monday) — UI Foundation & shadcn Setup

**Time:** 3 hours

**Cascade Prompt:**
```
Set up the UI foundation for FramePostReady:

1. Install shadcn/ui CLI and initialize with:
   - Tailwind CSS
   - New York style
   - CSS variables for theming

2. Add these shadcn components: Button, Card, Tabs, Badge, 
   Textarea, Input, Select, Dialog, Toast, Separator, 
   DropdownMenu, ScrollArea, Tooltip

3. Create src/app/layout.tsx with:
   - Frame & Form Studio branding (dark navy #1a2332, 
     accent gold #c9a84c, clean white background)
   - Header component with logo, nav links (Generate, Dashboard, Settings)
   - Responsive layout with max-width container

4. Create the base page at src/app/dashboard/page.tsx with a 
   placeholder "Listing History" view
```

### Day 2 (Tuesday) — Listing Summary Header & Content Tabs

**Stories:** FPR-901 (3 pts), FPR-902 (3 pts)
**Time:** 5 hours

**Cascade Prompt:**
```
Build the content dashboard page at src/app/dashboard/[listingId]/page.tsx:

1. ListingSummaryCard component (sticky header):
   - Shows hero photo thumbnail (or placeholder)
   - Address, price (formatted), beds/baths/sqft
   - Property type badge
   - Content status badge (color-coded: yellow=Generating, 
     green=Content Ready, blue=Delivered)
   - Minimal, clean design — not cluttered

2. ContentTabs component:
   - 6 horizontal tabs: Instagram, Facebook, MLS, Email, Reel Script, Hashtags
   - Active tab highlighted with accent color
   - Each tab shows a checkmark icon if all content in that type is approved
   - Warning icon if compliance flags exist
   - Tabs are scrollable on mobile

3. Data fetching:
   - Use React Server Components or client-side fetch to GET /api/listings/[id]
   - Fetch content via GET /api/content?listingId=[id]
   - Group content by type for tab display

The page uses real data from our API. Use the useListing and useContent 
hooks (create these if not already built).
```

### Day 3 (Wednesday) — Content Display & Variants

**Stories:** FPR-903 (3 pts), FPR-904 (3 pts)
**Time:** 5 hours

**Cascade Prompt:**
```
Build the content display components:

1. VariantSelector component:
   - Renders variant labels as selectable pill buttons
   - Instagram: "Hook-Driven", "Storytelling", "Direct CTA"
   - Facebook: "Community-Focused", "Feature-Focused"
   - MLS: "Short (500 char)", "Long (1000 char)"
   - Email: shows subject lines + body
   - Reel: "Walkthrough", "Fast-Cut"
   - Hashtags: "Main Set", "First Comment", "Categorized"
   - Clicking a variant loads that variant's content

2. ContentCard component:
   - Displays the generated text with proper formatting
   - Instagram: preserves line breaks and emojis
   - MLS: shows character count
   - Email: shows subject lines separately from body
   - Reel: renders shot table (Shot #, Duration, Visual, 
     VO/Overlay, Notes) in a clean table
   - Hashtags: renders as a tag cloud or copy-block
   - Word count and character count shown at bottom
   - Compliance flags displayed inline (highlighted text with warning icon)
```

### Day 4 (Thursday) — Interactive Features

**Stories:** FPR-905 (2 pts), FPR-906 (5 pts), FPR-907 (3 pts)
**Time:** 5 hours

**Cascade Prompt:**
```
Add interactive features to the ContentCard component:

1. CopyButton component:
   - Copies the content text to clipboard
   - Shows "Copied!" toast for 2 seconds
   - For hashtags, copies as space-separated block
   - Uses the useClipboard hook

2. ContentEditor:
   - "Edit" toggle converts content display to a Textarea
   - Auto-saves on blur or after 2 seconds of no typing
   - Saves via PATCH /api/content/[id]
   - Updates character/word count in real-time
   - "Revert to Original" button restores the generated version
   - Marks the Content record as "Edited"

3. RegenerateButton:
   - Triggers POST /api/generate/[contentType] with the listing ID
   - Shows a loading spinner during regeneration
   - On completion, displays the new version
   - "Previous Version" toggle to compare old vs new

Build all three features into the ContentCard and wire them up with 
real API calls.
```

### Day 5 (Friday) — Polish & Responsive

**Time:** 3 hours

**Cascade Prompt:**
```
Polish the content dashboard:

1. Add loading skeletons for all content cards while data is fetching
2. Add empty states ("No content generated yet — click Generate")
3. Make everything responsive:
   - Mobile: tabs scroll horizontally, cards stack vertically, 
     copy buttons are thumb-accessible
   - Tablet: 2-column layout where appropriate
4. Add keyboard shortcuts: Ctrl+C on focused content copies it
5. Add a toast notification system for: copy success, save success, 
   regeneration started/complete, errors
6. Test all interactions and fix any visual bugs
```

**Sprint 9 Exit Criteria:**
- [ ] Content dashboard renders all 6 content types with real data
- [ ] Variant selection works for all content types
- [ ] Copy to clipboard works for all content blocks
- [ ] Inline editing saves to Airtable
- [ ] Regeneration triggers API and displays new version
- [ ] Responsive on mobile and tablet
- [ ] Git commit: "Sprint 9: Content Dashboard UI complete"

---

## Sprint 10 — Frontend: Input, Settings & Agent Management

**Goal:** Build the listing input page, settings page, and agent management UI.
**Backlog Stories:** FPR-1702, FPR-1704, FPR-1102, FPR-1201, FPR-1202, FPR-1203, FPR-1205
**Story Points:** 16
**Key Deliverable:** Complete client-facing frontend with input, dashboard, and settings

### Day 1–2 (Monday–Tuesday) — Listing Input Page

**Stories:** FPR-1702 (5 pts)
**Time:** 8 hours

**Cascade Prompt:**
```
Build the listing input page at src/app/generate/page.tsx matching 
the wireframe from Section 7.1 of our Implementation Guide:

1. URL Input Section:
   - Large input field with placeholder "Paste Zillow URL..."
   - "Generate" button next to it
   - "OR enter details manually" expandable section below

2. Manual Entry Form (collapsible):
   - All required fields: address, city, zip, price, beds, baths, sqft, 
     property type (dropdown)
   - Optional fields: lot size, year built, neighborhood, MLS description, 
     key features (textarea), unique selling points (textarea)

3. Content Preferences Section:
   - Tone dropdown: Luxury, Family-Friendly, Investor-Focused, 
     First-Time Buyer, Neutral
   - Target Buyer dropdown: Relocator, Snowbird, First-Time Buyer, 
     Investor, Downsizer, Upsizer, Military/VA
   - Email Type dropdown: Just Listed, Open House, Price Reduction, 
     Back on Market
   - Special Notes textarea
   - Open House Date picker (shown when email type is "Open House")

4. Agent Selection:
   - Dropdown populated from /api/agents
   - "Add New Agent" link to settings
   - Pre-fills with default agent from settings

5. Submit Flow:
   - "Generate All Content" primary button
   - On submit: POST to /api/scrape (if URL) or /api/listings (if manual)
   - Then POST to /api/generate
   - Show loading screen with progress messages
   - On completion: redirect to /dashboard/[listingId]

Use Zod for client-side form validation. Show inline validation errors.
```

### Day 3 (Wednesday) — Settings Page

**Stories:** FPR-1704 (3 pts), FPR-1201 (2 pts), FPR-1202 (1 pt), FPR-1203 (1 pt), FPR-1205 (2 pts)
**Time:** 5 hours

**Cascade Prompt:**
```
Build the settings page at src/app/settings/page.tsx matching the 
wireframe from Section 7.3:

1. Default Agent Profile section:
   - Dropdown to select default agent
   - Quick link to edit agent profiles

2. Default Preferences section:
   - Default Tone dropdown
   - Default Target Buyer dropdown
   - Default CTA text input
   - These pre-fill on the generate page

3. MLS Settings section:
   - Short version character limit (number input, default 500)
   - Long version character limit (number input, default 1000)

4. Brand Settings section:
   - Logo upload field (store URL)
   - Primary color picker (default #1a2332)
   - Accent color picker (default #c9a84c)

5. Custom Hashtag Seeds section:
   - Tag input field (type tag, press enter to add)
   - Display as removable pills
   - Save as array to settings

6. Save button that persists to a settings record in Airtable 
   (create a new Settings table with a single record, or store 
   in local storage for MVP)

All settings should load on page mount and save on button click.
```

### Day 4 (Thursday) — Agent Management

**Stories:** FPR-1102 (2 pts)
**Time:** 3 hours

**Cascade Prompt:**
```
Build an agent management section within settings (or as a sub-page 
/settings/agents):

1. Agent List:
   - Table showing all agents: name, brokerage, tier, active status
   - "Add Agent" button

2. Agent Form (dialog/modal):
   - All agent fields: name, email, phone, Instagram handle, 
     Facebook page URL, brokerage, preferred tone, default CTA
   - Save creates/updates agent via /api/agents

3. Agent Detail:
   - Click an agent to see their profile
   - Edit button opens the form pre-filled
   - Shows listing count (read-only)
```

### Day 5 (Friday) — Listing History Dashboard

**Time:** 3 hours

**Cascade Prompt:**
```
Build the listing history view at src/app/dashboard/page.tsx:

1. Table/card view showing all processed listings
2. Columns: address, city, price, agent name, date generated, content status
3. Status badges: color-coded (Queued, Generating, Content Ready, Delivered)
4. Click a row to navigate to /dashboard/[listingId]
5. Search bar to filter by address
6. Filter dropdowns: by status, by agent, by city
7. Sort by: date (newest first default), price, status

Fetch data from GET /api/listings with query params for filters.
```

**Sprint 10 Exit Criteria:**
- [ ] Listing input page works for both URL and manual entry
- [ ] Form validation prevents bad data
- [ ] Settings page saves and loads preferences
- [ ] Agent CRUD works
- [ ] Listing history shows all processed listings
- [ ] Navigation between all pages works
- [ ] Git commit: "Sprint 10: Input, Settings, Agent Management UI complete"

---

## Sprint 11 — Export & Delivery System

**Goal:** Build PDF export, Google Drive delivery, and delivery email.
**Backlog Stories:** FPR-1001, FPR-1002, FPR-1003, FPR-1005, FPR-908
**Story Points:** 22
**Key Deliverable:** One-click export to branded PDF, auto-upload to Drive, email to client

### Day 1–2 (Monday–Tuesday) — PDF Generation

**Stories:** FPR-1001 (8 pts)
**Time:** 8 hours

**Cascade Prompt:**
```
Build the PDF generation system at src/lib/export/pdf.ts.

Use puppeteer to generate PDFs from an HTML template (this gives us 
the most control over branding and layout).

1. Create an HTML template at src/lib/export/pdf-template.ts that 
   generates the full content package PDF:

   Page 1 — Cover:
   - Frame & Form Studio logo (top left)
   - Agent name and brokerage (top right)
   - Property hero photo (center, large)
   - Address, Price, Bed/Bath/Sqft
   - "Content Package — Prepared by Frame & Form Studio"
   - Generation date

   Page 2 — Instagram Captions:
   - All 3 variants with clear labels
   - Clean formatting with proper line breaks

   Page 3 — Facebook Captions:
   - Both variants with labels

   Page 4 — MLS Description:
   - Short version with character count
   - Long version with character count

   Page 5 — Email Blast:
   - Subject line options
   - Preview text
   - Body copy
   - CTA button text

   Page 6 — Reel Script:
   - Both script variants with shot tables

   Page 7 — Hashtags:
   - Main set (copy block)
   - First comment set (copy block)
   - Categorized breakdown

   Use the brand colors from settings. Clean, professional design.
   No clutter. Easy to read.

2. API route at src/app/api/export/pdf/route.ts:
   - POST with { listingId }
   - Generates PDF
   - Returns the PDF file (or URL if saved to disk)
```

### Day 3 (Wednesday) — Google Drive Upload

**Stories:** FPR-1002 (5 pts)
**Time:** 4 hours

**Cascade Prompt:**
```
Build the Google Drive upload system at src/lib/export/drive.ts:

1. Initialize Google Drive API with service account credentials
2. Function: uploadToClientFolder(agentId: string, listingAddress: string, 
   pdfBuffer: Buffer): string (returns file URL)
   
   Logic:
   - Get agent's Google Drive Folder ID from Airtable
   - Create a subfolder: "{Address} — {Date}"
   - Upload the PDF to this subfolder
   - Return the shareable link

3. API route at src/app/api/export/drive/route.ts:
   - POST with { listingId }
   - Generates PDF → uploads to Drive → returns Drive link

Handle: missing folder ID (skip Drive upload), permission errors, 
quota limits.
```

### Day 4 (Thursday) — Delivery Email & Log

**Stories:** FPR-1003 (3 pts), FPR-1005 (3 pts)
**Time:** 4 hours

**Cascade Prompt:**
```
Build the delivery system:

1. src/lib/export/email.ts:
   - Function: sendDeliveryEmail(agent: Agent, listing: Listing, 
     driveLink: string)
   - Uses Resend to send a branded email:
     - To: agent's email
     - Subject: "Your Content Package is Ready — {Address}"
     - Body: greeting, listing reference, Drive link, 
       brief instructions, Frame & Form contact info
   - HTML email template with Frame & Form branding

2. Update src/lib/airtable/delivery.ts to log every delivery:
   - Listing link, Agent link, Delivery Method, PDF URL, 
     Delivery Date, Status

3. Create a combined export flow in the API:
   POST /api/export/deliver with { listingId, deliveryMethod: "full" }
   - Generate PDF
   - Upload to Google Drive
   - Send delivery email
   - Log to Delivery Log
   - Update listing status to "Delivered"
   - Return success with Drive link
```

### Day 5 (Friday) — Export Bar UI & Copy All

**Stories:** FPR-908 (2 pts)
**Time:** 3 hours

**Cascade Prompt:**
```
Build the ExportBar component for the content dashboard:

1. Fixed bar at the bottom of the content dashboard with:
   - "Copy All" button — copies all 6 content types as formatted text
   - "Export PDF" button — triggers PDF generation, shows download link
   - "Send to Drive" button — triggers Drive upload flow
   - "Deliver to Client" button — runs full delivery pipeline 
     (PDF → Drive → Email)

2. Each button shows loading state during processing
3. Success/error toasts for each action
4. "Deliver to Client" shows a confirmation dialog before sending

Wire all buttons to the appropriate API endpoints.
```

**Sprint 11 Exit Criteria:**
- [ ] PDF generates with all 6 content types, branded
- [ ] Google Drive upload creates proper folder structure
- [ ] Delivery email sends with Drive link
- [ ] Delivery logged in Airtable
- [ ] Export bar works from the content dashboard
- [ ] "Copy All" formats all content cleanly
- [ ] Git commit: "Sprint 11: Export & delivery system complete"

---

## Sprint 12 — Client-Facing Launch & Polish

**Goal:** Deploy to Vercel, test the full client experience, fix bugs, and launch.
**Backlog Stories:** FPR-1701, FPR-911, FPR-909
**Story Points:** 10 + polish
**Key Deliverable:** FramePostReady is live and usable by clients

### Day 1 (Monday) — Vercel Deployment

**Time:** 3 hours

```bash
# In Windsurf terminal
vercel link
vercel env add ANTHROPIC_API_KEY
vercel env add AIRTABLE_PAT
vercel env add AIRTABLE_BASE_ID
# ... add all env vars
vercel deploy --prod
```

**Cascade Prompt:**
```
Prepare the app for production deployment:

1. Review next.config.js for any needed production settings
2. Add proper error boundaries to all pages
3. Add a loading.tsx for each route segment
4. Ensure all API routes have proper error responses
5. Add rate limiting to the webhook endpoint (basic: 
   check Make.com IP or secret token)
6. Review all console.log statements — remove debug logs, 
   keep error logs
7. Verify all environment variables are referenced correctly
8. Add a health check endpoint at /api/health
```

### Day 2 (Tuesday) — Landing Page

**Stories:** FPR-1701 (3 pts)
**Time:** 4 hours

**Cascade Prompt:**
```
Build a clean landing page at src/app/page.tsx:

Frame & Form Studio branding. Simple and professional.

Sections:
1. Hero: "Stop writing listing copy. Start closing deals." 
   Subhead explaining FramePostReady in one sentence. 
   CTA: "Generate Your First Content Package"

2. How It Works: 3-step visual
   Step 1: Paste your Zillow URL
   Step 2: AI generates 6 types of content
   Step 3: Copy, export, or deliver to your inbox

3. What You Get: 6 content types with brief descriptions and icons

4. Pricing: 4 tiers from the pricing model

5. Footer: Frame & Form Studio contact, Colby's info

Keep it simple — this is a service page, not a SaaS marketing site. 
One page, no fluff.
```

### Day 3 (Wednesday) — Mobile Polish & Content Approval

**Stories:** FPR-911 (4 pts), FPR-909 (3 pts)
**Time:** 5 hours

**Cascade Prompt:**
```
1. Mobile responsive pass on all pages:
   - Test at 375px (iPhone), 768px (iPad), 1024px+
   - Fix any layout breaks
   - Ensure all buttons are touch-friendly (min 44px target)
   - Tabs scroll horizontally on mobile

2. Add the content approval feature:
   - "Approve" button on each content card
   - Approved content shows green checkmark badge
   - Saves approval status to Airtable Content record
   - Tab shows checkmark when all variants are approved
   - "Approve All" button in the export bar
```

### Day 4 (Thursday) — Full Client Flow Test

**Time:** 4 hours

Walk through the entire client experience end-to-end:

1. Land on the landing page
2. Navigate to Generate
3. Paste a real Zillow URL
4. Select agent, tone, target buyer
5. Click Generate
6. Wait for loading
7. View content dashboard
8. Review all 6 content types
9. Copy an Instagram caption
10. Edit the MLS description
11. Regenerate a weak Reel script
12. Approve all content
13. Export PDF
14. Send to Google Drive
15. Deliver to client email

Document every bug, UX issue, or confusing moment.

### Day 5 (Friday) — Bug Fixes & Launch

**Time:** 4 hours

Fix all issues from Day 4 testing. Final deploy.

**Launch Checklist:**
- [ ] All pages load correctly on production URL
- [ ] API routes work on Vercel
- [ ] Make.com webhooks point to production URLs
- [ ] Environment variables set in Vercel
- [ ] Full client flow works without errors
- [ ] PDF generation works on Vercel (puppeteer may need serverless config)
- [ ] Google Drive upload works from production
- [ ] Delivery email sends from production
- [ ] Mobile responsive
- [ ] Landing page looks professional
- [ ] Custom domain configured (if purchased)

**Git commit: "Sprint 12: LAUNCH — FramePostReady client-facing v1.0"**

---

## 18. Windsurf Cascade Prompt Library

Reusable prompts to paste into Cascade throughout the build. Keep this section open as a reference.

### Context Primer (Paste This Before Complex Prompts)

```
I'm building FramePostReady, a real estate listing content generator 
for Southwest Florida. It takes a Zillow listing URL, scrapes the property 
data, and uses the Anthropic Claude API to generate 6 types of marketing 
content: Instagram captions (3 variants), Facebook captions (2 variants), 
MLS description rewrites (short + long), email blast copy, Reel video 
scripts (2 styles), and optimized hashtag sets.

Tech stack: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, 
Airtable (database), Anthropic Claude API (AI), Apify (scraping), 
Google Drive API (export), Make.com (automation), Vercel (deployment).

The project structure is: [paste relevant folder structure]
The relevant types are: [paste relevant types]
```

### Debugging Prompt

```
I'm getting this error: [paste error]
In this file: [paste file path]
Here's the full file: [paste file or let Cascade read it]
Here's what I'm trying to do: [explain intent]
Fix the error and explain what went wrong.
```

### Refactor Prompt

```
Review this file for code quality issues: [paste file path]
Check for:
- TypeScript 'any' types that should be specific
- Missing error handling
- Functions that are too long (break into smaller ones)
- Repeated code that should be extracted
- Missing JSDoc comments on exported functions
Refactor and explain each change.
```

### New Feature Prompt Template

```
I need to add [feature name] to FramePostReady.

Here's the user story:
As a [user], I want to [action], so that [benefit].

Acceptance criteria:
[paste from backlog]

Files that will be affected:
[list files]

Please implement this feature. Start with [specific file] and 
work through each file. Test each piece as you go.
```

---

## 19. Daily Workflow SOP

### Every Morning (7:00 AM)

1. **Open Windsurf** → pull latest from GitHub
2. **Check sprint board** → identify today's stories
3. **Read relevant backlog stories** → review acceptance criteria
4. **Paste context into Cascade** → prime it with the project context
5. **Code for 4–5 hours** → use Cascade for implementation, review everything
6. **Test what you built** → run scripts, verify in Airtable, check UI
7. **Commit and push** → descriptive commit message

### Every Friday (End of Sprint)

1. **Run all test scripts** → verify nothing is broken
2. **Review sprint goals** → check off completed stories
3. **Update Airtable backlog** → move stories to Done
4. **Write sprint notes** → what shipped, what carried over, what blocked you
5. **Plan next sprint** → review next sprint's stories, read acceptance criteria
6. **Deploy to Vercel** → push to production (after Sprint 9+)

### Commit Message Convention

```
Sprint X: [Summary of changes]

Stories completed: FPR-XXX, FPR-XXX
- Bullet point of key change 1
- Bullet point of key change 2
- Known issues: [if any]
```

---

## 20. Risk Register & Contingency Plans

| Risk | Probability | Impact | Contingency |
|---|---|---|---|
| Apify Zillow scraper breaks (Zillow changes page structure) | Medium | High | Fallback to manual entry. Monitor Apify actor updates. Have 2nd scraper actor bookmarked. |
| Vercel serverless timeout on PDF generation (puppeteer is heavy) | High | Medium | Use a separate PDF service (Documint, or a dedicated serverless function with higher timeout). Or generate PDFs client-side with jsPDF. |
| Airtable rate limits hit at scale (5 req/sec on free tier) | Medium | Medium | Batch Airtable writes. Cache reads. Upgrade to Airtable Pro if needed ($20/mo). |
| Claude API rate limits during batch generation | Low | Medium | Sequential generation (not parallel). Add delays between calls. Monitor with cost tracking. |
| Prompt quality degrades for edge-case properties (vacant land, mobile homes) | Medium | Medium | Build edge-case-specific prompt variations. More testing in Sprint 7. |
| Make.com scenario fails silently | Low | High | Add error notification to every scenario. Daily check of execution logs. |
| Scope creep (adding features before MVP is stable) | High | High | This sprint plan is the scope. Don't build anything not in the current sprint's stories. Period. |

---

## 21. Post-MVP Sprint Roadmap

### Sprint 13–14: Analytics & Optimization
- Usage dashboard
- Revenue tracking
- Content variant analytics
- Prompt performance reports

### Sprint 15–16: Batch Processing & Scale
- Multi-URL input
- CSV upload
- Queue management
- Non-Zillow source support

### Sprint 17–18: Agent Engine Integration
- Content queue for automated posting
- Multi-week campaign mapping
- Status sync between platforms

### Sprint 19–20: Advanced Features
- Instagram carousel support
- Facebook Marketplace copy
- TikTok-specific scripts
- AI-powered photo-to-caption matching
- Email HTML template builder
- White-label option

---

## Appendix: Environment Variable Reference

```env
# Anthropic (AI Content Generation)
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx

# Airtable (Database)
AIRTABLE_PAT=patxxxxx.xxxxx
AIRTABLE_BASE_ID=appxxxxx

# Apify (Zillow Scraper)
APIFY_TOKEN=apify_api_xxxxx

# Google Drive (Export/Delivery)
GOOGLE_SERVICE_ACCOUNT_EMAIL=fpr-service@xxxxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nxxxxx\n-----END PRIVATE KEY-----"
GOOGLE_DRIVE_ROOT_FOLDER_ID=xxxxx

# Make.com (Orchestration)
MAKE_WEBHOOK_SECRET=xxxxx
MAKE_WEBHOOK_URL_INTAKE=https://hook.us1.make.com/xxxxx
MAKE_WEBHOOK_URL_GENERATE=https://hook.us1.make.com/xxxxx

# Email (Delivery)
RESEND_API_KEY=re_xxxxx

# App
NEXT_PUBLIC_APP_URL=https://framepostready.vercel.app
NODE_ENV=production
```

---

*FramePostReady Sprint Plan — Built for Windsurf IDE by Frame & Form Studio. Maintained by Colby Hollins. Last updated March 12, 2026.*
