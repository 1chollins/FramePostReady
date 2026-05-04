# FramePostReady — Master Planning Document

**Product:** FramePostReady — AI-Powered Listing Content Generator by Frame & Form Studio
**Author:** Colby Hollins / Frame & Form Studio
**Version:** 1.0 | **Date:** March 12, 2026 | **Status:** Pre-Build (Sprint 0)
**IDE:** Windsurf (Codeium) with Cascade AI

> **This document consolidates:** PRD.md + datamodel.md (Implementation Guide) + Backlog.md + SprintPlan.md

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem & Target Users](#2-problem--target-users)
3. [Product Goals & Success Metrics](#3-product-goals--success-metrics)
4. [Tech Stack & Architecture](#4-tech-stack--architecture)
5. [Airtable Database Schema](#5-airtable-database-schema)
6. [AI Prompt Templates (All 6 Content Types)](#6-ai-prompt-templates)
7. [Variable Reference](#7-variable-reference)
8. [Make.com Scenario Blueprints](#8-makecom-scenario-blueprints)
9. [Project File Structure](#9-project-file-structure)
10. [Sprint Roadmap (12 Sprints)](#10-sprint-roadmap)
11. [Epic Map & Backlog Summary](#11-epic-map--backlog-summary)
12. [UI/UX Wireframes](#12-uiux-wireframes)
13. [Export & Delivery System](#13-export--delivery-system)
14. [Pricing & Revenue Model](#14-pricing--revenue-model)
15. [Compliance & QA](#15-compliance--qa)
16. [Testing Plan](#16-testing-plan)
17. [Launch Checklist](#17-launch-checklist)
18. [Maintenance SOP](#18-maintenance-sop)
19. [Cost Summary](#19-cost-summary)
20. [Risks, Open Questions & Roadmap](#20-risks-open-questions--roadmap)

---

## 1. Executive Summary

FramePostReady ingests active Zillow listings in SWFL (Cape Coral, Fort Myers, Naples, Bonita Springs, Lehigh Acres, Estero) and auto-generates a full marketing content suite per listing in under 2 minutes.

**Six outputs per listing:**
1. Instagram Captions — 3 variants (hook-driven, storytelling, direct CTA)
2. Facebook Captions — 2 variants (community-focused, feature-focused)
3. MLS Description Rewrite — short (500 char) and long (1,000 char)
4. Email Blast Copy — 3 subject lines, preview text, body, CTA
5. Reel Script — 30–60 sec timed shot-by-shot in 2 styles (walkthrough, fast-cut)
6. Hashtags — 30 main + 15 first-comment tags, categorized

**Two business purposes:**
1. Service add-on for Frame & Form Studio media packages
2. Foundation module for Agent Engine (planned SaaS for automated social campaigns)

---

## 2. Problem & Target Users

**Core Problem:** SWFL agents underperform on listing marketing — no time, no skill, no system for platform-specific copy, email blasts, or video scripts. Media assets (photos, drone, 3D tours) go underutilized.

| Persona | Primary Need |
|---|---|
| Solo Agent (3–15 listings) | Fast, done-for-you content to copy-paste and post |
| Team Lead / Broker | Consistent brand voice across all agent listings |
| Frame & Form Client | Bundled content alongside photo/video delivery |
| Colby (Internal) | Streamlined production to scale service delivery |

**SWFL Service Area:** Cape Coral, Fort Myers, Naples, Bonita Springs, Estero, Lehigh Acres, Sanibel/Fort Myers Beach

**Key Regional Keywords:** Gulf access, canal front, pool home, lanai, hurricane shutters, impact windows, no HOA, boat dock, seawall, new construction, CBS construction, STR eligible, golf community, gated community, preserve view

---

## 3. Product Goals & Success Metrics

| Goal | Target (MVP — First 90 Days) |
|---|---|
| Content generation time per listing | < 2 minutes |
| Client adoption rate (offered to clients) | 60%+ opt-in |
| Content quality score (client feedback 1–5) | 4.0+ avg |
| Listings processed per week | 15+ |
| Revenue contribution | $500+/month |

---

## 4. Tech Stack & Architecture

### Final Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Airtable (`airtable` npm package) |
| AI Engine | Anthropic Claude API (`@anthropic-ai/sdk`), model: `claude-sonnet-4-6` |
| Scraper | Apify (`apify-client`), Zillow Scraper Actor |
| File Storage | Google Drive API (`googleapis`) |
| PDF Generation | `@react-pdf/renderer` or `puppeteer` |
| Orchestration | Make.com (webhook-driven workflows) |
| Deployment | Vercel |
| Email | Resend (`resend` npm) |

### Claude API Config

| Parameter | Value |
|---|---|
| Model | `claude-sonnet-4-6` |
| Max Tokens | 2,000 per content type |
| Temperature | 0.7 |
| Top P | 0.9 |

### Estimated Cost Per Listing: ~$0.026

| Content Type | Cost |
|---|---|
| Instagram (3 variants) | ~$0.006 |
| Facebook (2 variants) | ~$0.005 |
| MLS (2 versions) | ~$0.003 |
| Email | ~$0.004 |
| Reel Script (2 styles) | ~$0.006 |
| Hashtags | ~$0.002 |

### Data Flow

```
[Zillow URL] → [Apify Scraper] → [Parse + SWFL Enrichment]
     → [Airtable Listings Table]
     → [6x Claude API Calls] → [Parse Variants]
     → [Airtable Content Table]
     → [Dashboard: Review, Edit, Copy, Export]
     → [PDF / Google Drive / Email Platform]
```

### package.json Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0", "react": "^18.0.0", "react-dom": "^18.0.0",
    "@anthropic-ai/sdk": "^0.24.0", "airtable": "^0.12.2",
    "apify-client": "^2.9.0", "googleapis": "^140.0.0",
    "resend": "^3.0.0", "zod": "^3.23.0",
    "clsx": "^2.1.0", "tailwind-merge": "^2.3.0", "lucide-react": "^0.383.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0", "@types/node": "^20.0.0", "@types/react": "^18.0.0",
    "tailwindcss": "^3.4.0", "postcss": "^8.4.0", "autoprefixer": "^10.4.0",
    "eslint": "^8.0.0", "prettier": "^3.2.0"
  }
}
```

### .env.local Variables

```
ANTHROPIC_API_KEY=sk-ant-xxxxx
AIRTABLE_PAT=patxxxxx
AIRTABLE_BASE_ID=appxxxxx
APIFY_TOKEN=apify_api_xxxxx
GOOGLE_SERVICE_ACCOUNT_EMAIL=xxxxx@xxxxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nxxxxx\n-----END PRIVATE KEY-----"
GOOGLE_DRIVE_ROOT_FOLDER_ID=xxxxx
MAKE_WEBHOOK_SECRET=xxxxx
RESEND_API_KEY=re_xxxxx
```

---

## 5. Airtable Database Schema

### Table 1: Listings

| Field | Type | Notes |
|---|---|---|
| Listing ID | Auto Number | PK |
| Zillow URL | URL | Source URL |
| ZPID | Single Line Text | For deduplication |
| Address | Single Line Text | Full address |
| City | Single Line Text | |
| County | Single Line Text | Lee, Collier, Charlotte |
| Zip Code | Single Line Text | |
| Price | Currency | |
| Beds | Number | |
| Baths | Number | Supports .5 |
| Sqft | Number | |
| Lot Size | Single Line Text | |
| Year Built | Number | |
| Property Type | Single Select | Single Family, Condo, Townhome, Villa, Multi-Family, Vacant Land |
| Original MLS Description | Long Text | |
| Key Features | Long Text | JSON array |
| Photo URLs | Long Text | JSON array |
| Neighborhood | Single Line Text | Subdivision name |
| SWFL Keywords Matched | Multiple Select | Auto-tagged |
| Tone | Single Select | Luxury, Family-Friendly, Investor-Focused, First-Time Buyer, Neutral |
| Target Buyer | Single Select | Relocator, Snowbird, First-Time Buyer, Investor, Downsizer, Upsizer, Military/VA |
| Email Type | Single Select | Just Listed, Open House, Price Reduction, Back on Market, Under Contract |
| Unique Selling Points | Long Text | Manual input |
| Special Notes | Long Text | Free-text context |
| Open House Date | Single Line Text | |
| Price Change Amount | Currency | |
| Listing Status | Single Select | Active, Pending, Sold, Price Reduced, Back on Market |
| Content Status | Single Select | Queued → Scraping → Scrape Complete/Failed → Generating → Content Ready → Delivered → Archived |
| Agent (Link) | Link to Agents | |
| Content (Link) | Link to Content | |
| Created Date | Created Time | Auto |
| Last Modified | Last Modified Time | Auto |

### Table 2: Agents

| Field | Type | Notes |
|---|---|---|
| Agent ID | Auto Number | PK |
| Agent Name | Single Line Text | |
| Email | Email | |
| Phone | Phone | |
| Instagram Handle | Single Line Text | @handle |
| Facebook Page URL | URL | |
| Brokerage | Single Line Text | |
| Preferred Tone | Single Select | |
| Default CTA | Single Line Text | |
| Headshot URL | URL | For PDF exports |
| Logo URL | URL | |
| Google Drive Folder ID | Single Line Text | Client delivery folder |
| Listings (Link) | Link to Listings | |
| Tier | Single Select | Bundled, Single, Monthly-5, Monthly-15 |
| Active | Checkbox | |
| Notes | Long Text | |

### Table 3: Content

| Field | Type | Notes |
|---|---|---|
| Content ID | Auto Number | PK |
| Listing (Link) | Link to Listings | |
| Content Type | Single Select | Instagram, Facebook, MLS, Email, Reel Script, Hashtags |
| Variant Label | Single Line Text | e.g., "Hook-Driven" |
| Generated Text | Long Text | |
| Version | Number | Increments on regeneration |
| Status | Single Select | Draft, Approved, Exported, Archived |
| Prompt Template Used | Single Line Text | |
| Token Count (Input) | Number | |
| Token Count (Output) | Number | |
| API Cost | Currency | |
| Generated Date | Created Time | Auto |
| Edited | Checkbox | |
| Edit Notes | Long Text | |
| Compliance Flags | Long Text | JSON scan results |

### Table 4: Prompt Templates

| Field | Type | Notes |
|---|---|---|
| Template ID | Auto Number | PK |
| Template Name | Single Line Text | e.g., "Instagram — Hook-Driven v3" |
| Content Type | Single Select | |
| Variant | Single Line Text | |
| System Prompt | Long Text | |
| User Prompt Template | Long Text | With {variable} placeholders |
| Version | Number | |
| Active | Checkbox | Only active templates used |
| Temperature | Number (0–1) | Per-type override |
| Max Tokens | Number | Per-type override |
| Performance Score | Number (1–5) | Manual rating |
| Notes | Long Text | Iteration notes |
| Last Updated | Last Modified Time | Auto |

### Table 5: Delivery Log

| Field | Type | Notes |
|---|---|---|
| Delivery ID | Auto Number | PK |
| Listing (Link) | Link to Listings | |
| Agent (Link) | Link to Agents | |
| Delivery Method | Single Select | PDF Email, Google Drive, Manual Handoff, Agent Engine |
| PDF URL | URL | |
| Delivery Date | Date | |
| Opened | Checkbox | |
| Feedback | Long Text | |
| Rating | Rating (1–5) | |

---

## 6. AI Prompt Templates

All prompts: System Prompt (role, rules, output format) + User Prompt (listing data). Variants separated by `---`.

### 6.1 Instagram Caption

**System:**
```
You are a top-performing real estate social media copywriter specializing in Southwest Florida luxury and lifestyle properties.

RULES:
- Every caption must open with a hook on its own line (bold claim, question, or pattern interrupt).
- Use line breaks between every 1-2 sentences for mobile readability.
- Integrate emojis naturally (3-6 per caption, never forced).
- End with a specific CTA (DM, call, link in bio, or open house invite).
- NEVER fabricate property details.
- NEVER use: "nestled," "boasts," "stunning," "dream home."
- 150-300 words per caption.

OUTPUT: 3 variants separated by "---"
VARIANT 1 — HOOK-DRIVEN | VARIANT 2 — STORYTELLING | VARIANT 3 — DIRECT CTA
```

**User:** `ADDRESS, CITY, PRICE, BEDS, BATHS, SQFT, LOT SIZE, YEAR BUILT, PROPERTY TYPE, KEY FEATURES, SWFL KEYWORDS, NEIGHBORHOOD, UNIQUE SELLING POINTS, AGENT, HANDLE, BROKERAGE, TONE, TARGET BUYER, SPECIAL NOTES`

---

### 6.2 Facebook Caption

**System:**
```
You are a real estate marketing specialist writing high-performing Facebook posts for SWFL agents. Posts feel like a knowledgeable friend sharing a find — not a salesy ad.

RULES:
- Paragraph formatting (not short IG-style line breaks). 200-500 words.
- Reference neighborhood/local landmarks naturally.
- Include engagement hook (question, "tag someone," "share this").
- End with clear CTA including contact info.
- NEVER fabricate. Avoid: "nestled," "boasts," "won't last long," "dream home."

OUTPUT: 2 variants separated by "---"
VARIANT 1 — COMMUNITY-FOCUSED | VARIANT 2 — FEATURE-FOCUSED
```

**User:** `ADDRESS, CITY, PRICE, BEDS, BATHS, SQFT, PROPERTY TYPE, KEY FEATURES, SWFL KEYWORDS, NEIGHBORHOOD, ORIGINAL MLS DESCRIPTION, UNIQUE SELLING POINTS, AGENT, PHONE, BROKERAGE, TONE, TARGET BUYER, SPECIAL NOTES`

---

### 6.3 MLS Description Rewrite

**System:**
```
You are an MLS listing description specialist for SWFL real estate. Rewrite generic descriptions into compelling, keyword-rich, compliant copy.

RULES:
- Complete rewrite — do not copy original phrases.
- Lead with the property's strongest differentiator.
- Include proximity callouts (beaches, downtown, I-75, RSW airport, schools) where relevant.
- COMPLIANCE: No subjective superlatives without qualification. No protected class references. No investment return promises.
- BANNED: nestled, boasts, stunning, dream home, must-see, won't last, motivated seller.

OUTPUT: 2 versions separated by "---"
SHORT VERSION (under 500 chars) — include exact character count
LONG VERSION (under 1,000 chars) — include exact character count
```

**User:** `ORIGINAL MLS DESC, ADDRESS, CITY, PRICE, BEDS, BATHS, SQFT, LOT SIZE, YEAR BUILT, PROPERTY TYPE, KEY FEATURES, SWFL KEYWORDS, NEIGHBORHOOD, UNIQUE SELLING POINTS`

---

### 6.4 Email Blast Copy

**System:**
```
You are a real estate email marketing specialist for SWFL agents.

RULES:
- Subject lines: under 50 characters, curiosity/urgency/specificity. No ALL CAPS.
- Preview text: 40-90 characters, complements (not repeats) the subject.
- Body: 150-250 words. Scannable — bold key details. One primary CTA.
- CTA button text: 2-5 action words.
- NEVER fabricate. BANNED: nestled, boasts, stunning, dream home.

OUTPUT:
SUBJECT LINE 1/2/3 | PREVIEW TEXT | BODY (with **bold**) | CTA BUTTON TEXT
```

**User:** `EMAIL TYPE, ADDRESS, CITY, PRICE, BEDS, BATHS, SQFT, PROPERTY TYPE, KEY FEATURES, SWFL KEYWORDS, NEIGHBORHOOD, UNIQUE SELLING POINTS, AGENT, PHONE, EMAIL, BROKERAGE, OPEN HOUSE DATE, PRICE CHANGE, TONE, TARGET BUYER`

---

### 6.5 Reel Script

**System:**
```
You are a real estate video content strategist writing Reel/TikTok scripts for property tours (30-60 sec vertical video).

RULES:
- First 3 seconds MUST be a hook (bold statement, surprising fact, provocative question).
- Timed shot list format with visual direction + text overlay for every shot.
- Include music/vibe cue at top (genre/energy — no copyrighted songs).
- End with a CTA shot. NEVER fabricate.

OUTPUT: 2 variants separated by "---"
VARIANT 1 — WALKTHROUGH NARRATION | VARIANT 2 — FAST-CUT TRENDING

Format per variant:
SCRIPT TITLE | TOTAL RUNTIME | MUSIC CUE
| Shot # | Duration | Visual Direction | Voiceover / Text Overlay | Notes |
```

**User:** `ADDRESS, CITY, PRICE, BEDS, BATHS, SQFT, PROPERTY TYPE, KEY FEATURES, SWFL KEYWORDS, NEIGHBORHOOD, UNIQUE SELLING POINTS, PHOTO COUNT, AGENT, HANDLE, TONE, TARGET BUYER`

---

### 6.6 Hashtags

**System:**
```
You are an Instagram hashtag strategist for SWFL real estate agents.

RULES:
- Exactly 30 hashtags in 4 categories: LOCATION (7-8), PROPERTY TYPE (7-8), LIFESTYLE/BUYER INTENT (7-8), BROAD REACH (7-8).
- All lowercase, no spaces within tags.
- No shadowbanned/restricted Instagram hashtags.
- Always include when relevant: #capecoral #fortmyers #naplesfl #swfl #swflrealestate #gulfcoastliving #floridahomes #floridarealestate

OUTPUT:
MAIN SET (30): [copy-paste block]
FIRST COMMENT SET (15): [copy-paste block]
CATEGORIZED BREAKDOWN: LOCATION | PROPERTY TYPE | LIFESTYLE | BROAD REACH
```

**User:** `ADDRESS, CITY, PRICE, PROPERTY TYPE, KEY FEATURES, SWFL KEYWORDS, NEIGHBORHOOD, TARGET BUYER`

---

## 7. Variable Reference

| Variable | Source | Example |
|---|---|---|
| `{address}` | Scraper/Manual | 1234 Example St, Cape Coral, FL 33914 |
| `{city}` | Scraper/Manual | Cape Coral |
| `{county}` | Derived | Lee |
| `{zip}` | Scraper/Manual | 33914 |
| `{price}` | Scraper/Manual | 425,000 |
| `{beds}` | Scraper/Manual | 3 |
| `{baths}` | Scraper/Manual | 2 |
| `{sqft}` | Scraper/Manual | 1,850 |
| `{lot_size}` | Scraper/Manual | 0.25 acres |
| `{year_built}` | Scraper/Manual | 2005 |
| `{property_type}` | Scraper/Manual | Single Family |
| `{original_description}` | Scraper/Manual | Raw MLS text |
| `{key_features}` | Scraper/Manual | Pool, Gulf Access Canal, 2-Car Garage |
| `{swfl_keywords}` | Enrichment Layer | Gulf Access, Pool Home, Cape Coral Gulf Access |
| `{neighborhood}` | Scraper/Manual | Cape Coral Unit 64 |
| `{unique_selling_points}` | Manual Input | New AC 2024, rescreened lanai |
| `{photo_count}` | Scraper | 24 |
| `{agent_name}` | Agent Table | Jane Smith |
| `{agent_handle}` | Agent Table | @janesmithrealty |
| `{agent_phone}` | Agent Table | (239) 555-0100 |
| `{agent_email}` | Agent Table | jane@remax.com |
| `{brokerage}` | Agent Table | RE/MAX Realty Group |
| `{tone}` | User Selection | Luxury |
| `{target_buyer}` | User Selection | Relocator |
| `{email_type}` | User Selection | Just Listed |
| `{open_house_date}` | Manual Input | Saturday, April 5, 2026 — 11 AM to 2 PM |
| `{price_change_amount}` | Manual Input | Reduced $15,000 |
| `{special_notes}` | Manual Input | Free-text context |

---

## 8. Make.com Scenario Blueprints

### Scenario 1: Listing Intake

**Trigger:** Webhook (Zillow URL + agent context)

| Step | Module | Action |
|---|---|---|
| 1 | Custom Webhook | Receive: `zillow_url`, `agent_id`, `tone`, `target_buyer`, `special_notes`, `email_type` |
| 2 | HTTP Request | POST to Apify Zillow Scraper Actor |
| 3 | Sleep | Wait 15–30s for Apify |
| 4 | HTTP Request | Retrieve Apify results |
| 5 | JSON Parse | Extract listing fields |
| 6 | Text Parser | Run SWFL keyword matching |
| 7 | Airtable Create | Write to Listings table |
| 8 | Airtable Update | Set Content Status = "Generating" |
| 9 | HTTP Webhook | Trigger Scenario 2 with Listing ID |

**Error:** Apify fails → set "Scrape Failed" → email alert to Colby → manual entry fallback

### Scenario 2: Content Generation

**Trigger:** Webhook from Scenario 1 or manual trigger

| Step | Module | Action |
|---|---|---|
| 1 | Airtable Get | Pull full listing data |
| 2 | Airtable Search | Pull 6 active prompt templates |
| 3 | Iterator | Loop each of 6 content types |
| 4 | Text Aggregator | Merge variables into prompt |
| 5 | HTTP Request | POST to `https://api.anthropic.com/v1/messages` |
| 6 | JSON Parse | Extract `content[0].text` |
| 7 | Text Parser | Split on `---` delimiter |
| 8 | Airtable Create | Write each variant to Content table |
| 9 | Airtable Update | Set Content Status = "Content Ready" |
| 10 | Email/Slack | Notify Colby |

**API Request Body:**
```json
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 2000,
  "temperature": 0.7,
  "messages": [{"role": "user", "content": "{{merged_user_prompt}}"}],
  "system": "{{merged_system_prompt}}"
}
```
**Headers:** `x-api-key: {{anthropic_api_key}}` | `anthropic-version: 2023-06-01`

### Scenario 3: Export & Delivery

**Trigger:** Manual button (MVP) or auto on "Content Ready"

| Step | Action |
|---|---|
| 1 | Pull all Content records for listing |
| 2 | Pull agent data (branding, Drive folder ID) |
| 3 | Generate branded PDF (Documint) |
| 4 | Upload PDF to Google Drive (agent folder) |
| 5 | Send delivery email with Drive link |
| 6 | Set Content Status = "Delivered" + log to Delivery Log |

---

## 9. Project File Structure

```
framepostready/
├── .env.local / .env.example / .gitignore
├── next.config.js / tailwind.config.ts / tsconfig.json / package.json
├── src/
│   ├── app/
│   │   ├── layout.tsx / page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── dashboard/[listingId]/page.tsx
│   │   ├── generate/page.tsx
│   │   ├── settings/page.tsx
│   │   └── api/
│   │       ├── scrape/route.ts
│   │       ├── generate/route.ts
│   │       ├── generate/[contentType]/route.ts
│   │       ├── listings/route.ts + [id]/route.ts
│   │       ├── content/route.ts + [id]/route.ts
│   │       ├── agents/route.ts + [id]/route.ts
│   │       ├── export/pdf/route.ts + drive/route.ts
│   │       └── webhook/make/route.ts
│   ├── lib/
│   │   ├── airtable/client.ts + listings.ts + content.ts + agents.ts + prompts.ts + delivery.ts
│   │   ├── ai/client.ts + generate.ts + parser.ts
│   │   ├── ai/prompts/instagram.ts + facebook.ts + mls.ts + email.ts + reel.ts + hashtags.ts
│   │   ├── scraper/apify.ts + parser.ts + enrichment.ts
│   │   ├── compliance/scanner.ts + blocklist.ts
│   │   ├── export/pdf.ts + drive.ts
│   │   └── utils/formatting.ts + validation.ts + constants.ts
│   ├── components/
│   │   ├── ui/ (shadcn/ui)
│   │   ├── layout/Header.tsx + Sidebar.tsx + Footer.tsx
│   │   ├── listing/ListingInputForm.tsx + ListingSummaryCard.tsx + ListingHistoryTable.tsx
│   │   ├── content/ContentTabs.tsx + ContentCard.tsx + VariantSelector.tsx + ContentEditor.tsx + CopyButton.tsx + RegenerateButton.tsx
│   │   ├── agent/AgentForm.tsx + AgentSelector.tsx
│   │   ├── export/ExportBar.tsx
│   │   └── compliance/ComplianceFlags.tsx
│   ├── hooks/useListing.ts + useContent.ts + useGenerate.ts + useClipboard.ts
│   └── types/listing.ts + content.ts + agent.ts + prompt.ts + api.ts
├── public/logo.svg + favicon.ico
├── data/swfl-keywords.json + blocked-terms.json + shadowbanned-hashtags.json
└── scripts/
    test-connections.ts + test-scrape.ts + test-pipeline.ts +
    test-full-pipeline.ts + test-content-quality.ts + quality-report.ts
```

---

## 10. Sprint Roadmap

### Overview

| Phase | Sprints | Duration | Outcome |
|---|---|---|---|
| Phase 1 — MVP | 0–8 | 9 weeks | Internal tool, Colby generates for clients |
| Phase 2 — Client-Facing | 9–12 | 4 weeks | Agents self-serve via web UI |

---

### Sprint 0 — Environment & Scaffolding

**Exit Criteria:**
- [ ] All API keys working (Anthropic, Apify, Airtable, Google Drive, Make.com)
- [ ] Airtable base with all 5 tables + 6 prompt templates entered
- [ ] Next.js project runs locally
- [ ] Full folder structure + TypeScript types defined
- [ ] First commit pushed to GitHub

---

### Sprint 1 — Database Foundation & Scraper *(13 pts)*
**Stories:** FPR-101, FPR-102, FPR-108, FPR-1301
**Deliverable:** Paste Zillow URL → structured data in Airtable

- `validateZillowUrl()` + ZPID extraction
- Apify scraper class
- Apify response parser → Listing type
- SWFL keyword enrichment
- `POST /api/scrape` route end-to-end
- `data/blocked-terms.json`

---

### Sprint 2 — Data Pipeline & Enrichment *(15 pts)*
**Stories:** FPR-103, FPR-105, FPR-107, FPR-110, FPR-106

- `POST /api/listings` manual entry route
- Deduplication check (ZPID + address)
- Status lifecycle management
- Scraper error handling + retry + failure alerts
- Supplemental context fields storage
- `buildPromptVariables()` function

---

### Sprint 3 — AI Content Engine Core *(17 pts)*
**Stories:** FPR-201, FPR-202, FPR-203, FPR-204, FPR-205
**Deliverable:** `POST /api/generate` → 6 content types in Airtable

- Anthropic client singleton + `callClaude()`
- `mergeVariables()` + `buildPromptVariables()`
- `generateAllContent()` orchestrator (6 sequential API calls)
- Response parser: split on `---`, extract labels, store variants
- `GET /api/content?listingId=` route
- End-to-end test: scrape → generate → retrieve

---

### Sprint 4 — Content Modules: Instagram, Facebook, MLS *(20 pts)*
**Stories:** FPR-301, FPR-302, FPR-401, FPR-501, FPR-503

- Instagram prompt builder + tone injection (Luxury/Family-Friendly/Investor-Focused/First-Time Buyer/Neutral) + response parser
- Facebook prompt builder + response parser
- MLS prompt builder + short/long version parser + character counting
- Compliance scanner (`scanForCompliance()`) integrated post-MLS generation
- Quality test: 3 real SWFL listings, target 4.0+ avg score

---

### Sprint 5 — Content Modules: Email, Reel, Hashtags *(20 pts)*
**Stories:** FPR-601, FPR-602, FPR-701, FPR-801, FPR-802

- Email builder (Just Listed, Open House, Price Reduction, Back on Market) + parser
- Reel script builder + table-format parser + runtime validation
- Hashtag builder + category parser + shadowban filter
- `generateAllContent()` updated to use module-specific builders

---

### Sprint 6 — Make.com Orchestration *(19 pts)*
**Stories:** FPR-1501, FPR-1502, FPR-1504
**Deliverable:** Webhook trigger → full pipeline → notification (target: under 3 min)

- `POST /api/webhook/make` bridge endpoint with secret validation
- Make.com Scenario 1: Listing Intake
- Make.com Scenario 2: Content Generation (full + single regeneration)
- Scenarios documented in `docs/make-scenarios.md`

---

### Sprint 7 — Compliance, QA & 5-Listing Validation *(16 pts)*
**Stories:** FPR-1302, FPR-1303, FPR-2001, FPR-1304

**5 Test Listings:**
1. Gulf Access Pool Home — Cape Coral — $400K–$600K
2. Gated Community Condo — Naples — $250K–$400K
3. New Construction — Fort Myers — $350K–$500K
4. Vacant Canal Lot — Cape Coral — $100K–$200K
5. Luxury Waterfront — Naples — $1M+

- Compliance scanner on all 6 content types
- QA checklist auto-generation
- `scripts/quality-report.ts`
- Iterate prompts until 4.0+ average

---

### Sprint 8 — Client Pilot & MVP Lock *(14 pts)*
**Stories:** FPR-2002, FPR-2004, FPR-1101, FPR-206

- 3 real agent profiles created in Airtable
- Content generated + delivered for 3 real Frame & Form clients
- Feedback collected (target 4.0+ quality score)
- MVP declared stable for internal use

---

### Sprints 9–12 — Phase 2: Client-Facing UI

| Sprint | Goal |
|---|---|
| Sprint 9 | Content Dashboard UI (ListingSummaryHeader, ContentTabs, VariantSelector, ContentEditor, CopyButton, RegenerateButton) |
| Sprint 10 | Input, Settings & Agent Management UI |
| Sprint 11 | Export & Delivery (PDF + Google Drive + Make.com Scenario 3) |
| Sprint 12 | Client-Facing Launch & Polish — first 5 paying clients |

---

## 11. Epic Map & Backlog Summary

### Epic Map

```
PHASE 1 — MVP
├── Epic 1:  Listing Data Ingestion           (42 pts) — FPR-101 through FPR-110
├── Epic 2:  AI Content Generation Engine     (39 pts) — FPR-201 through FPR-211
├── Epic 3:  Instagram Caption Module         (24 pts) — FPR-301 through FPR-307
├── Epic 4:  Facebook Caption Module          (18 pts) — FPR-401 through FPR-405
├── Epic 5:  MLS Description Rewrite Module   (22 pts) — FPR-501 through FPR-506
├── Epic 6:  Email Blast Copy Module          (25 pts) — FPR-601 through FPR-608
├── Epic 7:  Reel Script Module               (23 pts) — FPR-701 through FPR-707
├── Epic 8:  Hashtag Generation Module        (18 pts) — FPR-801 through FPR-806
├── Epic 13: Compliance & Quality Control     — FPR-1301 through FPR-1305
├── Epic 15: Automation & Orchestration       — FPR-1501 through FPR-1505
├── Epic 16: Database Infrastructure          — FPR-1601 through FPR-1605
└── Epic 20: Testing & QA                     — FPR-2001 through FPR-2005

PHASE 2 — Client-Facing
├── Epic 9:  Content Dashboard UI             (34 pts) — FPR-901 through FPR-913
├── Epic 10: Export & Delivery System         — FPR-1001 through FPR-1007
├── Epic 11: Agent & Client Management        — FPR-1101 through FPR-1106
├── Epic 12: Settings & Configuration         — FPR-1201 through FPR-1206
└── Epic 17: Client-Facing Frontend           — FPR-1701 through FPR-1706

PHASE 3 — Scale
├── Epic 14: Analytics & Reporting
├── Epic 18: Agent Engine Integration
└── Epic 19: Batch Processing & Scale
```

### Priority Labels
- **P0 — Must Have:** MVP blocker
- **P1 — Should Have:** Phase 1 if time allows, else early Phase 2
- **P2 — Nice to Have:** Phase 2 or 3
- **P3 — Future:** Phase 3+ or Agent Engine

### Story Point Scale
- 1 pt = < 1 hr | 2 pts = 1–3 hrs | 3 pts = 3–6 hrs | 5 pts = 6–12 hrs | 8 pts = 2–4 days | 13 pts = 1–2 weeks

---

## 12. UI/UX Wireframes

### Screen 1: Listing Input

```
┌──────────────────────────────────────────┐
│  FRAMEPOSTREADY     [Settings] [Logout]  │
├──────────────────────────────────────────┤
│  ┌────────────────────────────────────┐  │
│  │ 🔗 https://zillow.com/homedetails/ │  │
│  │                        [Generate]  │  │
│  │ ─── OR [Expand Manual Entry ▼] ─── │  │
│  └────────────────────────────────────┘  │
│  Tone: [Luxury ▼]  Target: [Relocator ▼] │
│  Email Type: [Just Listed ▼]             │
│  Special Notes: [free text]              │
│  Agent: ● Jane Smith — RE/MAX            │
│         [ ★ GENERATE ALL CONTENT ]       │
└──────────────────────────────────────────┘
```

### Screen 2: Content Dashboard

```
┌──────────────────────────────────────────┐
│  📍 1234 Example St, Cape Coral FL 33914 │
│  $425,000 | 3 BD | 2 BA | 1,850 sqft    │
│  [📷]  Status: ✅ Content Ready          │
├──────────────────────────────────────────┤
│  [Instagram][Facebook][MLS][Email][Reel] │
│  ─────────────────────────────────────── │
│  Variant: [Hook-Driven ▼][Story][Direct] │
│  ┌──────────────────────────────────┐    │
│  │ This Cape Coral canal home just  │    │
│  │ changed the game. 🌴             │    │
│  │ 3 beds. 2 baths. Gulf access...  │    │
│  └──────────────────────────────────┘    │
│  [📋 Copy][🔄 Regen][✏️ Edit][245 words] │
├──────────────────────────────────────────┤
│  [Copy All][Export PDF][Drive][Email]    │
└──────────────────────────────────────────┘
```

### Screen 3: Settings

- Default Agent Profile (name, handle, brokerage, phone, email, default tone)
- MLS Limits: Short = 500 chars | Long = 1,000 chars
- Brand settings for PDF (logo upload, primary/accent colors)
- Custom seed hashtags (always included)

---

## 13. Export & Delivery System

### PDF Structure (7 Pages)

| Page | Content |
|---|---|
| 1 — Cover | Frame & Form logo, agent headshot, property hero photo, address/price/specs, date |
| 2 — Instagram | All 3 variants labeled + hashtag set |
| 3 — Facebook | Both variants labeled |
| 4 — MLS | Short version (with char count) + long version (with char count) |
| 5 — Email | Subject lines, preview text, body, CTA |
| 6 — Reel Script | Walkthrough + Fast-cut shot tables |
| 7 — Hashtags | Main set + first comment set + categorized breakdown |

### Google Drive Structure

```
Frame & Form Studio (Root)
  └── Client Deliveries
       └── {Agent Name}
            └── {Address} — {Date}
                 ├── FramePostReady_Content_Package.pdf
                 └── Raw/ (individual text files per content type)
```

---

## 14. Pricing & Revenue Model

| Tier | Price | API Cost | Margin |
|---|---|---|---|
| Bundled (with media package) | $0 value-add | ~$0.03 | Retention play |
| Single Listing | $49 | ~$0.03 | 99.9% |
| Monthly — 5 listings | $149/mo | ~$0.15 total | 99.9% |
| Monthly — 15 listings | $349/mo | ~$0.45 total | 99.9% |
| Agent Engine Integration | TBD (V2) | Varies | Target 85%+ |

### Revenue Projections (6 Months)

| Month | Revenue |
|---|---|
| 1 | $98 |
| 2 | $296 |
| 3 | $494 |
| 4 | $841 |
| 5 | $1,139 |
| 6 | $1,486 |
| **Total** | **~$4,354** |

---

## 15. Compliance & QA

### MLS Compliance Blocked Terms

| Category | Terms |
|---|---|
| Fair Housing | perfect for families, great school district (as selling point), walking distance to church, family neighborhood, bachelor pad, master bedroom (use "primary"), man cave |
| Unsubstantiated | best, most beautiful, greatest, #1, top-rated, guaranteed, will appreciate, investment opportunity (without disclosure), below market value |
| Overused / Low-Quality | nestled, boasts, stunning, dream home, must-see, won't last long, motivated seller, turnkey, move-in ready (unless substantiated), priced to sell |

### QA Checklist (Per Listing — 5–8 min)

- [ ] All property facts match source listing (address, price, bed/bath/sqft, features)
- [ ] No fabricated details added by AI
- [ ] MLS description character counts within limits
- [ ] MLS compliance scan passes (no blocked terms)
- [ ] Instagram hook lines are genuinely attention-grabbing
- [ ] Agent name, handle, and brokerage are correct
- [ ] Hashtags are relevant to this specific property and location
- [ ] Reel script timing adds up to 30–60 seconds
- [ ] Email subject lines are under 50 characters
- [ ] Tone consistency across all 6 content types

### SWFL Keyword Enrichment Rules

| If listing contains... | Tag with... |
|---|---|
| "canal" or "waterfront" | `Gulf Access`, `Canal Front`, or `Waterfront` |
| "pool" | `Pool Home` |
| "no HOA" or HOA = $0 | `No HOA` |
| "boat dock", "boat lift", "seawall" | `Boating`, `Dock`, `Seawall` |
| "impact windows" or "hurricane shutters" | `Storm Protection` |
| City = Cape Coral + waterfront tag | `Cape Coral Gulf Access` |
| City = Naples | `Naples Luxury` |
| Year built > 2020 | `New Construction` |
| "RV" | `RV Parking` |
| "short-term rental", "STR", "Airbnb" | `STR Eligible` |
| Lot > 0.5 acres | `Large Lot` |
| "preserve" or "lake view" | `Nature View` |

---

## 16. Testing Plan

### 5-Listing Validation (Sprint 7)

| # | Type | City | Price |
|---|---|---|---|
| 1 | Gulf Access Pool Home | Cape Coral | $400K–$600K |
| 2 | Gated Community Condo | Naples | $250K–$400K |
| 3 | New Construction | Fort Myers | $350K–$500K |
| 4 | Vacant Canal Lot | Cape Coral | $100K–$200K |
| 5 | Luxury Waterfront | Naples | $1M+ |

### Evaluation Criteria (Score 1–5, Target 4.0+)

- Factual accuracy (no hallucinated details)
- Platform appropriateness
- Hook quality
- SWFL keyword integration (natural, not stuffed)
- Tone consistency
- CTA clarity and strength
- MLS compliance (no blocked terms, within char limits)
- Reel script shootability
- Hashtag relevance and variety
- Overall: would you send this to a client as-is?

---

## 17. Launch Checklist

### Week 1: Foundation
- [ ] Airtable base with 5 tables + 6 prompt templates
- [ ] Apify account + Zillow Scraper Actor configured
- [ ] Anthropic API key + basic API call test
- [ ] Next.js project scaffolded with full folder structure
- [ ] TypeScript types from data model

### Week 2: Automation
- [ ] Make.com Scenario 1: Listing Intake
- [ ] Make.com Scenario 2: Content Generation
- [ ] End-to-end test with 1 real listing

### Week 3: Testing
- [ ] 5-listing validation test, iterate to 4.0+ avg score
- [ ] Make.com Scenario 3: Export & Delivery
- [ ] Documint PDF template designed

### Week 4: Soft Launch (MVP)
- [ ] Content generated for 3 real Frame & Form clients
- [ ] Feedback collected and incorporated
- [ ] Cost tracking dashboard in Airtable

### Weeks 5–8: Client-Facing
- [ ] Next.js frontend: input form + content dashboard
- [ ] Inline editing, multi-variant display, tone selection
- [ ] User testing with 2–3 agents
- [ ] Launch to first 5 paying clients

---

## 18. Maintenance SOP

### Weekly

| Task | Time |
|---|---|
| Review quality on 3 random listings | 20 min |
| Check Apify scraper health | 5 min |
| Review API cost dashboard | 5 min |
| Check Delivery Log client feedback | 10 min |
| Update prompt templates if quality issues | 30 min |

### Monthly

| Task | Time |
|---|---|
| Audit Instagram shadowban list | 30 min |
| Review MLS compliance blocklist | 15 min |
| Analyze which content variants get used most | 20 min |
| Update SWFL keyword list | 15 min |
| Prompt template version review | 30 min |
| Revenue and margin review | 15 min |

### Quarterly

| Task | Time |
|---|---|
| Competitive analysis | 1 hr |
| Client NPS survey + feature requests | 1 hr |
| Pricing review | 30 min |
| Roadmap reprioritization | 1 hr |
| API model evaluation (better/cheaper options?) | 30 min |

---

## 19. Cost Summary

| Item | MVP Monthly | Scale (60 listings/mo) |
|---|---|---|
| Anthropic Claude API | ~$1.56 | ~$6.24 |
| Apify (Zillow scraper) | ~$5 (free tier may cover) | ~$20 |
| Make.com | ~$9 (Core plan) | ~$16 (Pro plan) |
| Airtable | $0 (free tier) | ~$20 (Pro plan) |
| Documint (PDF) | ~$0 (free tier) | ~$15 |
| Google Drive | $0 (existing) | $0 |
| Wix (hosting, MVP) | $0 (existing site) | $0 |
| **Total Overhead** | **~$15.56/mo** | **~$77.24/mo** |

> A single Monthly-15 subscriber ($349/mo) covers all infrastructure costs.

---

## 20. Risks, Open Questions & Roadmap

### Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Zillow blocks scraping / changes structure | Use Apify (managed service); monitor weekly; fallback = manual entry |
| AI hallucination (incorrect property details) | Never let AI invent specs — pull all facts from scraped data; human review before delivery |
| MLS compliance violations | Compliance filter on all MLS output; blocklist + flagging; maintain blocklist |
| Low agent adoption | Free first listing demo; bundle with media packages; side-by-side time savings demo |
| API cost overruns at scale | Use claude-sonnet-4-6 (not Opus); cache results; monitor cost per listing; alert at $0.10/listing |

### Open Questions

1. **Direct MLS feed vs. Zillow scraping?** IDX feed more reliable/compliant but requires broker cooperation (Spark API, Bridge Interactive). Explore for Phase 3+.
2. **Direct social posting from V1?** No for MVP — keep simple. Core Agent Engine value prop for V2.
3. **Pricing validation needed.** Test willingness-to-pay with 5–10 agents before locking in.
4. **Content rights.** Clarify in TOS: client owns generated content on delivery; Frame & Form retains right to use anonymized outputs for training/portfolio.

### Phase Roadmap

| Phase | Timeframe | Focus |
|---|---|---|
| Phase 1 — MVP | Weeks 1–4 | Internal tool, Make.com orchestration, Airtable backend |
| Phase 2 — Client-Facing | Weeks 5–8 | Next.js frontend, inline editing, PDF export, Google Drive |
| Phase 3 — Scale | Weeks 9–16 | Batch input, email platform integration, Agent Engine pipeline |
| Phase 4 — Expansion | Months 5–6+ | Non-Zillow sources, multi-market, white-label, A/B testing, AI image captions |

---

*FramePostReady — Built by Frame & Form Studio. Consolidated master document. Last updated March 12, 2026.*
