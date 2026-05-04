# FramePostReady — Product Backlog

**Product:** FramePostReady — AI-Powered Listing Content Generator by Frame & Form Studio
**Author:** Colby Hollins
**Version:** 1.0
**Date:** March 12, 2026
**Methodology:** Agile / Kanban
**Tool:** Airtable (backlog tracking) or ClickUp

---

## Table of Contents

1. [Backlog Overview](#1-backlog-overview)
2. [Epic Map](#2-epic-map)
3. [Epic 1 — Listing Data Ingestion](#epic-1--listing-data-ingestion)
4. [Epic 2 — AI Content Generation Engine](#epic-2--ai-content-generation-engine)
5. [Epic 3 — Instagram Caption Module](#epic-3--instagram-caption-module)
6. [Epic 4 — Facebook Caption Module](#epic-4--facebook-caption-module)
7. [Epic 5 — MLS Description Rewrite Module](#epic-5--mls-description-rewrite-module)
8. [Epic 6 — Email Blast Copy Module](#epic-6--email-blast-copy-module)
9. [Epic 7 — Reel Script Module](#epic-7--reel-script-module)
10. [Epic 8 — Hashtag Generation Module](#epic-8--hashtag-generation-module)
11. [Epic 9 — Content Dashboard UI](#epic-9--content-dashboard-ui)
12. [Epic 10 — Export & Delivery System](#epic-10--export--delivery-system)
13. [Epic 11 — Agent & Client Management](#epic-11--agent--client-management)
14. [Epic 12 — Settings & Configuration](#epic-12--settings--configuration)
15. [Epic 13 — Compliance & Quality Control](#epic-13--compliance--quality-control)
16. [Epic 14 — Analytics & Reporting](#epic-14--analytics--reporting)
17. [Epic 15 — Automation & Orchestration (Make.com)](#epic-15--automation--orchestration-makecom)
18. [Epic 16 — Database Infrastructure (Airtable)](#epic-16--database-infrastructure-airtable)
19. [Epic 17 — Client-Facing Frontend](#epic-17--client-facing-frontend)
20. [Epic 18 — Agent Engine Integration](#epic-18--agent-engine-integration)
21. [Epic 19 — Batch Processing & Scale](#epic-19--batch-processing--scale)
22. [Epic 20 — Testing & QA](#epic-20--testing--qa)
23. [Backlog Priority Matrix](#backlog-priority-matrix)
24. [Sprint Planning Guide](#sprint-planning-guide)
25. [Definition of Done](#definition-of-done)
26. [Acceptance Criteria Standards](#acceptance-criteria-standards)

---

## 1. Backlog Overview

### Story Point Scale

| Points | Effort Level | Time Estimate (Solo Dev) |
|---|---|---|
| 1 | Trivial | < 1 hour |
| 2 | Small | 1–3 hours |
| 3 | Medium | 3–6 hours |
| 5 | Large | 6–12 hours (1–2 days) |
| 8 | Very Large | 2–4 days |
| 13 | Epic-level chunk | 1–2 weeks |

### Priority Labels

| Label | Meaning |
|---|---|
| **P0 — Must Have** | MVP blocker. Cannot launch without this. |
| **P1 — Should Have** | High value. Include in Phase 1 if time allows, otherwise early Phase 2. |
| **P2 — Nice to Have** | Enhances experience. Phase 2 or 3. |
| **P3 — Future** | Backlog for Phase 3+ or Agent Engine integration. |

### Status Labels

| Status | Meaning |
|---|---|
| `Backlog` | Not started, not assigned to a sprint |
| `Ready` | Groomed, acceptance criteria defined, ready to pull |
| `In Progress` | Actively being worked on |
| `In Review` | Built, awaiting QA or testing |
| `Done` | Meets Definition of Done, deployed |
| `Blocked` | Cannot proceed — dependency or issue noted |

### Tagging Convention

Each story is tagged with:
- **Epic:** Parent epic name
- **Phase:** 1 (MVP), 2 (Client-Facing), 3 (Scale), 4 (Expansion)
- **Component:** Frontend, Backend, AI, Database, Automation, Export, Compliance

---

## 2. Epic Map

```
FRAMEPOSTREADY — EPIC MAP
═══════════════════════════════════════════════════════════════

PHASE 1 — MVP (Internal Use)
├── Epic 1:  Listing Data Ingestion
├── Epic 2:  AI Content Generation Engine
├── Epic 3:  Instagram Caption Module
├── Epic 4:  Facebook Caption Module
├── Epic 5:  MLS Description Rewrite Module
├── Epic 6:  Email Blast Copy Module
├── Epic 7:  Reel Script Module
├── Epic 8:  Hashtag Generation Module
├── Epic 13: Compliance & Quality Control
├── Epic 15: Automation & Orchestration (Make.com)
├── Epic 16: Database Infrastructure (Airtable)
└── Epic 20: Testing & QA

PHASE 2 — Client-Facing
├── Epic 9:  Content Dashboard UI
├── Epic 10: Export & Delivery System
├── Epic 11: Agent & Client Management
├── Epic 12: Settings & Configuration
└── Epic 17: Client-Facing Frontend

PHASE 3 — Scale & Integrate
├── Epic 14: Analytics & Reporting
├── Epic 18: Agent Engine Integration
└── Epic 19: Batch Processing & Scale
```

---

## Epic 1 — Listing Data Ingestion

**Epic Description:** Enable the system to accept property listing data via Zillow URL scraping or manual entry, parse it into structured fields, enrich it with SWFL-specific keywords, and store it in the database for content generation.

**Business Value:** This is the data foundation. Every content output depends on accurate, structured listing data. Without this, nothing downstream works.

**Epic Owner:** Colby
**Phase:** 1 (MVP)
**Total Story Points:** 42

---

### Story 1.1 — Zillow URL Input & Validation

**ID:** FPR-101
**Priority:** P0
**Points:** 2
**Phase:** 1
**Component:** Backend, Automation

**As a** user (Colby),
**I want to** paste a Zillow listing URL into the system,
**So that** the system can automatically extract all property data without manual entry.

**Acceptance Criteria:**
- [ ] System accepts a full Zillow URL in the format `https://www.zillow.com/homedetails/...`
- [ ] System validates URL format before processing (rejects non-Zillow URLs with clear error message)
- [ ] System extracts the ZPID from the URL for deduplication
- [ ] System checks if this ZPID already exists in the database and warns the user if it does
- [ ] System provides a loading state while scraping is in progress
- [ ] System handles and displays errors gracefully if the URL is invalid, the listing is removed, or Zillow is unreachable

---

### Story 1.2 — Zillow Data Scraping via Apify

**ID:** FPR-102
**Priority:** P0
**Points:** 5
**Phase:** 1
**Component:** Backend, Automation

**As a** user (Colby),
**I want** the system to automatically scrape all relevant property data from a Zillow listing,
**So that** I don't have to manually copy-paste property details for every listing.

**Acceptance Criteria:**
- [ ] System sends the Zillow URL to Apify Zillow Scraper Actor via API
- [ ] System retrieves and parses the following fields: address (street, city, state, zip), price, beds, baths, sqft, lot size, year built, property type, listing description, key features/facts, photo URLs, listing agent info, days on Zillow, Zestimate, neighborhood/subdivision name
- [ ] All fields are mapped to the Airtable Listings table schema
- [ ] Scraper completes within 60 seconds for a single listing
- [ ] System handles partial data gracefully (e.g., if lot size is missing, field is left blank, not errored)
- [ ] System logs scraper run ID and cost for tracking

---

### Story 1.3 — Manual Listing Entry Form

**ID:** FPR-103
**Priority:** P1
**Points:** 5
**Phase:** 1
**Component:** Frontend, Database

**As a** user,
**I want to** manually enter listing details when a Zillow URL is unavailable or the listing is off-market,
**So that** I can still generate content for pre-list, off-market, or non-Zillow properties.

**Acceptance Criteria:**
- [ ] Form includes all required fields: address, city, zip, price, beds, baths, sqft, property type
- [ ] Form includes optional fields: lot size, year built, neighborhood, original MLS description, key features (multi-line), unique selling points, open house date, price change amount
- [ ] Form validates required fields before submission
- [ ] Form allows photo URL input (up to 10 URLs) or photo upload (up to 5 files)
- [ ] Submitted data writes to the same Airtable Listings table as scraped data
- [ ] Form pre-fills agent info from saved agent profile if one is selected

---

### Story 1.4 — SWFL Keyword Enrichment

**ID:** FPR-104
**Priority:** P0
**Points:** 3
**Phase:** 1
**Component:** Backend, Automation

**As a** content generation engine,
**I need** each listing to be automatically tagged with relevant Southwest Florida selling keywords,
**So that** generated content includes hyper-local, market-specific language that resonates with SWFL buyers.

**Acceptance Criteria:**
- [ ] System scans the listing description and key features against a master SWFL keyword list (40+ terms)
- [ ] Matching keywords are stored in the `SWFL Keywords Matched` field as a multi-select array
- [ ] Matching logic handles variations (e.g., "gulf access" matches "direct gulf access," "canal" matches "canal front")
- [ ] City-specific compound tags are generated (e.g., City = Cape Coral + waterfront = "Cape Coral Gulf Access")
- [ ] New construction flag triggered for year_built > 2020
- [ ] STR eligibility flag triggered for keywords: "short-term rental," "STR," "Airbnb," "VRBO"
- [ ] Keyword list is maintainable (stored in Airtable or config, not hardcoded)

---

### Story 1.5 — Listing Deduplication Check

**ID:** FPR-105
**Priority:** P1
**Points:** 2
**Phase:** 1
**Component:** Backend, Database

**As a** user,
**I want** the system to warn me if I'm submitting a listing that has already been processed,
**So that** I don't accidentally generate duplicate content packages or waste API credits.

**Acceptance Criteria:**
- [ ] System checks ZPID (for Zillow URLs) or address string (for manual entries) against existing Listings table records
- [ ] If a match is found, user sees a warning: "This listing was already processed on [date]. Regenerate content or view existing package?"
- [ ] User can choose to: view existing content, regenerate all content (new version), or cancel
- [ ] Regenerated content creates new Content records with incremented version numbers, preserving the originals

---

### Story 1.6 — Supplemental Context Input

**ID:** FPR-106
**Priority:** P1
**Points:** 3
**Phase:** 1
**Component:** Frontend, Backend

**As a** user,
**I want to** add supplemental context about a listing that the scraper won't capture,
**So that** the AI can produce more accurate and personalized content.

**Acceptance Criteria:**
- [ ] Input fields available alongside URL input: unique selling points (free text, 500 char max), special notes (free text, 500 char max), open house date (date picker), price reduction amount (currency field)
- [ ] Tone selection dropdown: Luxury, Family-Friendly, Investor-Focused, First-Time Buyer, Neutral
- [ ] Target buyer selection dropdown: Relocator, Snowbird/Seasonal, First-Time Buyer, Investor, Downsizer, Upsizer, Military/VA
- [ ] Email type selection: Just Listed, Open House, Price Reduction, Back on Market, Under Contract/Just Sold
- [ ] All supplemental fields are stored in the Listings table and passed as variables to content prompts
- [ ] Fields default to saved preferences from Settings if not overridden per listing

---

### Story 1.7 — Scraper Failure Handling & Alerts

**ID:** FPR-107
**Priority:** P0
**Points:** 3
**Phase:** 1
**Component:** Backend, Automation

**As a** system operator,
**I want** the system to gracefully handle scraping failures and notify me,
**So that** no listing gets stuck in a broken state and I can intervene quickly.

**Acceptance Criteria:**
- [ ] If Apify returns an error or empty result, listing status is set to "Scrape Failed"
- [ ] System sends an immediate notification (email or Slack) to Colby with the failed URL and error details
- [ ] User sees a clear error message: "Unable to scrape this listing. Please try again or enter details manually."
- [ ] Manual entry form is pre-populated with the URL so the user doesn't lose their place
- [ ] System retries once automatically before marking as failed
- [ ] All failures are logged in Airtable with timestamp, URL, and error type for pattern tracking

---

### Story 1.8 — Listing Data Storage

**ID:** FPR-108
**Priority:** P0
**Points:** 3
**Phase:** 1
**Component:** Database

**As a** system,
**I need** all listing data to be stored in a structured, queryable format,
**So that** it can be retrieved for content generation, regeneration, export, and analytics.

**Acceptance Criteria:**
- [ ] All fields from the Listings table schema (Section 3.1 of Implementation Guide) are created in Airtable
- [ ] Listing records are linked to Agent records via the Agent (Link) field
- [ ] Listing records are linked to Content records via the Content (Link) field
- [ ] Content Status field tracks the full lifecycle: Queued → Generating → Content Ready → Delivered → Archived
- [ ] Created Date and Last Modified fields auto-populate
- [ ] Photo URLs are stored as a JSON array in a Long Text field

---

### Story 1.9 — Listing Photo Handling

**ID:** FPR-109
**Priority:** P2
**Points:** 5
**Phase:** 2
**Component:** Backend, Database

**As a** user,
**I want** listing photos to be captured and stored alongside listing data,
**So that** they can be used in PDF exports, content dashboard previews, and future AI-powered image captioning.

**Acceptance Criteria:**
- [ ] Scraper captures up to 25 photo URLs from Zillow listing
- [ ] First photo is designated as the "hero image" for PDF cover and dashboard preview
- [ ] Photo URLs are validated (accessible, not broken)
- [ ] Manual entry supports photo upload (stored in Google Drive, URL referenced in Airtable)
- [ ] Photo count is stored as `{photo_count}` variable for Reel Script prompts

---

### Story 1.10 — Listing Status Lifecycle Management

**ID:** FPR-110
**Priority:** P1
**Points:** 2
**Phase:** 1
**Component:** Backend, Database

**As a** system operator,
**I want** every listing to have a clear status indicating where it is in the pipeline,
**So that** I can quickly see which listings need attention, which are ready for delivery, and which are complete.

**Acceptance Criteria:**
- [ ] Status transitions follow this flow: `Queued` → `Scraping` → `Scrape Complete` (or `Scrape Failed`) → `Generating` → `Content Ready` → `Delivered` → `Archived`
- [ ] Status updates are triggered automatically at each pipeline stage by Make.com
- [ ] Dashboard view in Airtable shows a Kanban-style board grouped by Content Status
- [ ] Listings in "Scrape Failed" or "Generating" for more than 10 minutes trigger an alert

---

## Epic 2 — AI Content Generation Engine

**Epic Description:** Build the core engine that takes structured listing data, merges it into prompt templates, calls the Claude API, parses the response, and stores the generated content.

**Business Value:** This is the product's brain. The quality and reliability of this engine determines whether FramePostReady produces content worth selling.

**Epic Owner:** Colby
**Phase:** 1 (MVP)
**Total Story Points:** 39

---

### Story 2.1 — Prompt Template Storage & Retrieval

**ID:** FPR-201
**Priority:** P0
**Points:** 3
**Phase:** 1
**Component:** Database, Backend

**As a** content generation engine,
**I need** to retrieve the correct, active prompt template for each content type,
**So that** prompts can be versioned, updated, and improved without changing code.

**Acceptance Criteria:**
- [ ] Prompt Templates table in Airtable stores all 6 content type templates
- [ ] Each template has: Template Name, Content Type, Variant, System Prompt, User Prompt Template, Version, Active (checkbox), Performance Score, Notes
- [ ] Only templates marked "Active" are used for generation
- [ ] System retrieves the active template for each content type at generation time
- [ ] Old template versions are preserved (not deleted) for rollback capability

---

### Story 2.2 — Variable Merging into Prompt Templates

**ID:** FPR-202
**Priority:** P0
**Points:** 3
**Phase:** 1
**Component:** Backend, Automation

**As a** content generation engine,
**I need** to replace all `{variable}` placeholders in prompt templates with actual listing data,
**So that** the AI receives complete, listing-specific prompts.

**Acceptance Criteria:**
- [ ] All variables from the Variable Reference (Appendix A of Implementation Guide) are supported
- [ ] Missing optional variables are replaced with "Not provided" (not left as raw `{variable}` text)
- [ ] Missing required variables (address, price, beds, baths, sqft) block generation and flag an error
- [ ] Currency values are formatted with commas ($425,000 not $425000)
- [ ] Array fields (key_features, swfl_keywords) are joined as comma-separated strings
- [ ] Merged prompts are logged for debugging (stored temporarily, purged after 7 days)

---

### Story 2.3 — Claude API Integration

**ID:** FPR-203
**Priority:** P0
**Points:** 5
**Phase:** 1
**Component:** Backend, Automation

**As a** content generation engine,
**I need** to send merged prompts to the Anthropic Claude API and receive generated content,
**So that** each listing gets AI-written marketing copy.

**Acceptance Criteria:**
- [ ] API calls use model `claude-sonnet-4-6` with `max_tokens: 2000`, `temperature: 0.7`
- [ ] System prompt and user prompt are sent as separate fields in the API request
- [ ] API key is stored securely (Make.com connection or environment variable, never hardcoded)
- [ ] Response is parsed to extract `content[0].text`
- [ ] API errors (rate limit, timeout, 500) are caught with retry logic (1 retry after 5-second delay)
- [ ] Token usage (input and output) is captured and stored per content generation for cost tracking
- [ ] Each content type is generated as a separate API call (6 calls per listing)

---

### Story 2.4 — Response Parsing & Variant Splitting

**ID:** FPR-204
**Priority:** P0
**Points:** 3
**Phase:** 1
**Component:** Backend, Automation

**As a** content generation engine,
**I need** to parse AI responses and split them into individual content variants,
**So that** each variant is stored as its own record and can be independently viewed, edited, and exported.

**Acceptance Criteria:**
- [ ] System splits multi-variant responses on the `---` delimiter
- [ ] Each variant is labeled with its type (e.g., "Hook-Driven," "Storytelling," "Direct CTA")
- [ ] Variant labels are extracted from the response header text (e.g., "VARIANT 1 — HOOK-DRIVEN")
- [ ] Each variant is written as a separate record in the Content table
- [ ] If parsing fails (no delimiters found), the entire response is stored as a single variant with a "Parse Warning" flag
- [ ] Leading/trailing whitespace and extra line breaks are cleaned from each variant

---

### Story 2.5 — Content Storage

**ID:** FPR-205
**Priority:** P0
**Points:** 3
**Phase:** 1
**Component:** Database

**As a** system,
**I need** all generated content stored in a structured, queryable format,
**So that** content can be retrieved for display, editing, export, and analytics.

**Acceptance Criteria:**
- [ ] Content table in Airtable stores each variant as a separate record
- [ ] Each record includes: Content Type, Variant Label, Generated Text, Version, Status (Draft/Approved/Exported/Archived), Prompt Template Used, Token Count (Input), Token Count (Output), API Cost, Generated Date, Edited (checkbox), Edit Notes
- [ ] Content records are linked to their parent Listing record
- [ ] Multiple versions of the same content type/variant are supported (version numbering)
- [ ] Content Status defaults to "Draft" on creation

---

### Story 2.6 — Single Content Block Regeneration

**ID:** FPR-206
**Priority:** P0
**Points:** 3
**Phase:** 1
**Component:** Backend, Automation

**As a** user,
**I want to** regenerate a single content block without regenerating all 6,
**So that** if one output is weak, I can get a new version without losing the others.

**Acceptance Criteria:**
- [ ] User can trigger regeneration for any individual content type or specific variant
- [ ] Regeneration uses the same listing data and prompt template (unless template was updated)
- [ ] New generation creates a new Content record with version number incremented (original is preserved)
- [ ] Regeneration completes within 15 seconds for a single content block
- [ ] User sees the new version alongside the original for comparison

---

### Story 2.7 — Full Listing Content Regeneration

**ID:** FPR-207
**Priority:** P1
**Points:** 3
**Phase:** 1
**Component:** Backend, Automation

**As a** user,
**I want to** regenerate all 6 content types for a listing at once,
**So that** if listing details change (price reduction, new features) or I want a fresh take, I can get a complete new content package.

**Acceptance Criteria:**
- [ ] "Regenerate All" triggers all 6 API calls in parallel
- [ ] Previous content records are preserved with their version numbers
- [ ] New records are created with incremented version numbers
- [ ] Listing `Content Status` updates to "Generating" during the process and "Content Ready" on completion
- [ ] User can optionally update supplemental context (tone, target buyer, special notes) before regenerating

---

### Story 2.8 — Generation Cost Tracking

**ID:** FPR-208
**Priority:** P1
**Points:** 2
**Phase:** 1
**Component:** Backend, Database

**As a** business operator,
**I want** every API call's token usage and cost tracked and stored,
**So that** I can monitor margins and identify cost optimization opportunities.

**Acceptance Criteria:**
- [ ] Input token count and output token count are captured from each API response
- [ ] Cost is calculated using current Claude Sonnet pricing and stored per content record
- [ ] Total cost per listing is calculable via Airtable rollup on the Listings table
- [ ] Monthly cost summary is viewable in an Airtable dashboard view
- [ ] Alerts trigger if per-listing cost exceeds $0.10 (indicates a prompt or parsing issue)

---

### Story 2.9 — Generation Status Notifications

**ID:** FPR-209
**Priority:** P1
**Points:** 2
**Phase:** 1
**Component:** Automation

**As a** user,
**I want to** be notified when content generation is complete for a listing,
**So that** I can review and deliver the content promptly.

**Acceptance Criteria:**
- [ ] On successful generation of all 6 content types, system sends a notification to Colby via email or Slack
- [ ] Notification includes: listing address, number of content blocks generated, and a link to the Airtable record
- [ ] On failure, notification includes the error type and which content block(s) failed
- [ ] Notifications do not fire for regeneration of individual blocks (only full-listing generation)

---

### Story 2.10 — Prompt Template Performance Tracking

**ID:** FPR-210
**Priority:** P2
**Points:** 3
**Phase:** 2
**Component:** Database, Backend

**As a** product operator,
**I want** to track which prompt template versions produce the best content,
**So that** I can continuously improve output quality through data-driven prompt iteration.

**Acceptance Criteria:**
- [ ] Each Content record stores the Prompt Template name and version used
- [ ] Content records that are manually edited have the "Edited" checkbox marked and "Edit Notes" filled in
- [ ] Prompt Templates table includes a Performance Score field (1–5, manually rated after review)
- [ ] Airtable dashboard shows: average performance score per template version, percentage of content that required manual editing per template version, most common edit types per content category

---

### Story 2.11 — Temperature & Parameter Tuning per Content Type

**ID:** FPR-211
**Priority:** P2
**Points:** 2
**Phase:** 2
**Component:** Backend, Database

**As a** product operator,
**I want** to set different AI parameters (temperature, max tokens) per content type,
**So that** I can fine-tune creativity vs. precision for each output.

**Acceptance Criteria:**
- [ ] Prompt Templates table includes fields for: temperature (decimal 0–1), max_tokens (integer), top_p (decimal 0–1)
- [ ] Generation engine reads these values from the template record and applies them to the API call
- [ ] Defaults are used if fields are empty: temperature 0.7, max_tokens 2000, top_p 0.9
- [ ] MLS Description uses lower temperature (0.4–0.5) for more controlled, factual output
- [ ] Instagram Captions use higher temperature (0.7–0.8) for more creative hooks

---

## Epic 3 — Instagram Caption Module

**Epic Description:** Generate high-quality, scroll-stopping Instagram captions with multiple variants, emoji integration, and platform-native formatting.

**Business Value:** Instagram is the #1 social platform for SWFL real estate agents. Compelling captions directly drive DMs, follows, and listing inquiries.

**Epic Owner:** Colby
**Phase:** 1 (MVP)
**Total Story Points:** 24

---

### Story 3.1 — Instagram Caption Generation (3 Variants)

**ID:** FPR-301
**Priority:** P0
**Points:** 5
**Phase:** 1
**Component:** AI

**As a** user,
**I want** 3 distinct Instagram caption variants generated for each listing,
**So that** I can choose the style that best fits the property and my posting strategy.

**Acceptance Criteria:**
- [ ] System generates exactly 3 variants: Hook-Driven, Storytelling, Direct CTA
- [ ] Each variant is 150–300 words
- [ ] Each variant opens with a strong first-line hook (bold claim, question, or pattern interrupt)
- [ ] Each variant ends with a clear CTA (DM, call, link in bio, or open house invite)
- [ ] Emojis are integrated naturally (3–6 per caption)
- [ ] Line breaks are used between every 1–2 sentences for mobile readability
- [ ] Agent handle is included where natural
- [ ] No fabricated property details appear in any variant
- [ ] Banned words ("nestled," "boasts," "stunning," "dream home") do not appear

---

### Story 3.2 — Instagram Tone Customization

**ID:** FPR-302
**Priority:** P1
**Points:** 3
**Phase:** 1
**Component:** AI

**As a** user,
**I want** to select a tone for my Instagram captions,
**So that** the voice matches the property's market positioning and my brand.

**Acceptance Criteria:**
- [ ] Tone options: Luxury, Family-Friendly, Investor-Focused, First-Time Buyer, Neutral
- [ ] Selected tone meaningfully changes vocabulary, sentence structure, and emotional appeal
- [ ] Luxury tone uses aspirational language, lifestyle imagery, exclusivity cues
- [ ] Family-Friendly tone emphasizes space, safety, schools, community, backyard living
- [ ] Investor-Focused tone highlights ROI, rental potential, cap rate, below-market pricing
- [ ] First-Time Buyer tone is approachable, explains value, avoids jargon
- [ ] Neutral tone is professional, balanced, no strong angle

---

### Story 3.3 — Instagram Hook Quality Validation

**ID:** FPR-303
**Priority:** P1
**Points:** 3
**Phase:** 1
**Component:** AI, Compliance

**As a** quality reviewer,
**I want** the first line of every Instagram caption to be genuinely attention-grabbing,
**So that** the content actually performs when posted.

**Acceptance Criteria:**
- [ ] First line of each variant is isolated and reviewable separately in the Content Dashboard
- [ ] Hook avoids generic openings ("Check out this listing," "New listing alert," "Just listed")
- [ ] Hook patterns include: provocative questions, surprising stats, bold claims, "what if" scenarios, controversy/contrarian takes, direct address ("You've been looking for this")
- [ ] System flags hooks that match a "generic hook" blocklist for regeneration

---

### Story 3.4 — Instagram Caption Character Count Display

**ID:** FPR-304
**Priority:** P1
**Points:** 1
**Phase:** 2
**Component:** Frontend

**As a** user,
**I want** to see the character and word count for each Instagram caption,
**So that** I can confirm it fits within Instagram's limits and my posting preferences.

**Acceptance Criteria:**
- [ ] Character count and word count displayed below each caption variant
- [ ] Warning indicator if caption exceeds 2,200 characters (Instagram's limit)
- [ ] Visual indicator of "ideal range" (150–300 words)

---

### Story 3.5 — Instagram Location Tag Suggestion

**ID:** FPR-305
**Priority:** P2
**Points:** 2
**Phase:** 2
**Component:** AI

**As a** user,
**I want** suggested Instagram location tags included with each caption,
**So that** I can maximize discoverability when posting.

**Acceptance Criteria:**
- [ ] System suggests 3–5 relevant Instagram location tags based on the listing's city and neighborhood
- [ ] Suggestions include: the specific city, broader SWFL region, neighborhood/subdivision (if it exists as an IG location), nearby landmarks
- [ ] Location tags are displayed as a separate, copy-able block below the caption

---

### Story 3.6 — Instagram Caption Preview Mock

**ID:** FPR-306
**Priority:** P2
**Points:** 5
**Phase:** 2
**Component:** Frontend

**As a** user,
**I want** to preview what my Instagram caption will look like in an Instagram-style format,
**So that** I can judge formatting, line breaks, and overall visual impact before posting.

**Acceptance Criteria:**
- [ ] Preview renders the caption in an Instagram post mock-up (profile pic placeholder, username, caption text with "more" truncation at 125 characters)
- [ ] Preview shows how the caption appears both collapsed (first 2 lines) and expanded
- [ ] Preview includes the hashtag block (if "first comment" strategy, shown separately)
- [ ] Preview is view-only (editing happens in the main content editor)

---

### Story 3.7 — Instagram Carousel Caption Support

**ID:** FPR-307
**Priority:** P3
**Points:** 5
**Phase:** 3
**Component:** AI

**As a** user,
**I want** the option to generate a carousel-specific Instagram caption,
**So that** the copy matches the multi-slide format (slide-by-slide references) when I'm posting photo carousels.

**Acceptance Criteria:**
- [ ] User can select "Carousel" as a post format option
- [ ] Carousel caption includes references to individual slides ("Swipe to see the kitchen →")
- [ ] Caption is structured to build curiosity across slides
- [ ] System suggests optimal slide count (7–10) and slide content order based on property features

---

## Epic 4 — Facebook Caption Module

**Epic Description:** Generate conversational, community-oriented Facebook captions optimized for the platform's algorithm and SWFL real estate market.

**Business Value:** Facebook remains the dominant platform for SWFL real estate — especially in community groups and for 35+ demographics. Strong Facebook copy drives shares, comments, and direct inquiries.

**Epic Owner:** Colby
**Phase:** 1 (MVP)
**Total Story Points:** 18

---

### Story 4.1 — Facebook Caption Generation (2 Variants)

**ID:** FPR-401
**Priority:** P0
**Points:** 5
**Phase:** 1
**Component:** AI

**As a** user,
**I want** 2 distinct Facebook caption variants generated for each listing,
**So that** I can choose a community-angle or feature-angle depending on the posting context.

**Acceptance Criteria:**
- [ ] System generates exactly 2 variants: Community-Focused, Feature-Focused
- [ ] Each variant is 200–500 words
- [ ] Community-Focused variant leads with neighborhood/lifestyle context and weaves property details in
- [ ] Feature-Focused variant leads with standout property features and adds community context secondarily
- [ ] Both variants use paragraph formatting (not short line breaks like Instagram)
- [ ] Both variants include an engagement hook (question, "tag someone," "share this")
- [ ] Both variants end with clear CTA including agent contact info
- [ ] No fabricated property details
- [ ] Banned words do not appear

---

### Story 4.2 — Facebook Algorithm Optimization

**ID:** FPR-402
**Priority:** P1
**Points:** 3
**Phase:** 1
**Component:** AI

**As a** user,
**I want** Facebook captions optimized for the platform's algorithm,
**So that** my posts get maximum organic reach.

**Acceptance Criteria:**
- [ ] Captions include engagement-driving elements: direct questions, opinion prompts, "tag a friend who..." hooks
- [ ] Captions avoid algorithm-penalized patterns: link-only posts (link is referenced but copy stands alone), engagement bait phrases flagged by Meta
- [ ] Captions are written to encourage comments (not just likes/shares)
- [ ] Local references increase shareability within SWFL community groups

---

### Story 4.3 — Facebook Group-Specific Version

**ID:** FPR-403
**Priority:** P2
**Points:** 3
**Phase:** 2
**Component:** AI

**As a** user,
**I want** an optional Facebook Group-specific caption version,
**So that** I can post in community groups without sounding overly promotional.

**Acceptance Criteria:**
- [ ] Group version uses a casual, "check this out" or "does anyone know someone looking for..." tone
- [ ] Group version avoids hard sales language and excessive agent branding
- [ ] Group version emphasizes community fit and neighborly tone
- [ ] Group version is shorter (100–200 words) than standard Facebook captions

---

### Story 4.4 — Facebook Caption with Event Details

**ID:** FPR-404
**Priority:** P1
**Points:** 2
**Phase:** 1
**Component:** AI

**As a** user,
**I want** Facebook captions to incorporate open house or event details when provided,
**So that** I can use the same content for event promotion posts.

**Acceptance Criteria:**
- [ ] If `{open_house_date}` is provided, both variants include the date, time, and a specific invitation CTA
- [ ] Event details are prominently placed (not buried at the end)
- [ ] Caption adds urgency cues appropriate for event promotion

---

### Story 4.5 — Facebook Marketplace Listing Copy

**ID:** FPR-405
**Priority:** P3
**Points:** 5
**Phase:** 3
**Component:** AI

**As a** user,
**I want** a Facebook Marketplace-optimized listing description,
**So that** I can post the property on Marketplace with copy that's formatted for that specific context.

**Acceptance Criteria:**
- [ ] Marketplace version is shorter (100–150 words), bullet-friendly, and price-forward
- [ ] Includes key specs in a scannable format
- [ ] Avoids long narrative paragraphs that don't work on Marketplace
- [ ] Includes location and contact info in a Marketplace-appropriate format

---

## Epic 5 — MLS Description Rewrite Module

**Epic Description:** Rewrite weak MLS descriptions into compelling, keyword-rich, compliant property descriptions that sell.

**Business Value:** The MLS description is the foundation of a listing's marketing. A strong description improves search ranking, buyer interest, and agent credibility. Most agents write terrible MLS descriptions — this solves that.

**Epic Owner:** Colby
**Phase:** 1 (MVP)
**Total Story Points:** 22

---

### Story 5.1 — MLS Description Rewrite (2 Versions)

**ID:** FPR-501
**Priority:** P0
**Points:** 5
**Phase:** 1
**Component:** AI

**As a** user,
**I want** the original MLS description rewritten into two versions (short and long),
**So that** I have options that fit different MLS character limits.

**Acceptance Criteria:**
- [ ] Short version is under 500 characters (including spaces)
- [ ] Long version is under 1,000 characters (including spaces)
- [ ] Both versions are complete rewrites (not edits of the original)
- [ ] Both versions lead with the property's strongest differentiator
- [ ] Exact character count is displayed after each version
- [ ] SWFL-specific keywords are naturally integrated
- [ ] Proximity callouts included where relevant (beaches, downtown, I-75, RSW, schools)
- [ ] No fabricated property details
- [ ] Banned words do not appear

---

### Story 5.2 — MLS Character Limit Configuration

**ID:** FPR-502
**Priority:** P1
**Points:** 2
**Phase:** 1
**Component:** Frontend, AI

**As a** user,
**I want** to configure the character limits for MLS descriptions,
**So that** the output matches my local MLS system's requirements.

**Acceptance Criteria:**
- [ ] Settings page allows configuring: short version limit (default 500), long version limit (default 1,000)
- [ ] Custom limits are passed to the prompt template as variables
- [ ] AI output respects the configured limits (within 5% tolerance)
- [ ] Character count display shows limit compliance (green if under, red if over)

---

### Story 5.3 — MLS Compliance Scanning

**ID:** FPR-503
**Priority:** P0
**Points:** 5
**Phase:** 1
**Component:** AI, Compliance

**As a** user,
**I want** the system to automatically scan MLS descriptions for compliance violations,
**So that** I never submit a description that violates fair housing laws or MLS rules.

**Acceptance Criteria:**
- [ ] System scans generated MLS text against the blocked terms list (fair housing violations, unsubstantiated claims, overused terms)
- [ ] Any flagged terms are highlighted in the output with a warning icon
- [ ] System suggests compliant replacement language for each flagged term
- [ ] Compliance scan runs automatically after generation and again after any manual edit
- [ ] Scan results are logged in the Content record for audit purposes

---

### Story 5.4 — MLS Keyword Density Check

**ID:** FPR-504
**Priority:** P2
**Points:** 3
**Phase:** 2
**Component:** AI, Backend

**As a** user,
**I want** to see which SWFL keywords are included in the MLS description and which were missed,
**So that** I can ensure maximum search discoverability.

**Acceptance Criteria:**
- [ ] After generation, system displays a keyword checklist showing which matched SWFL keywords appear in the description and which do not
- [ ] User can select missed keywords and trigger a regeneration with emphasis on including them
- [ ] Keyword density does not exceed natural readability (no keyword stuffing)

---

### Story 5.5 — MLS Description Comparison View

**ID:** FPR-505
**Priority:** P2
**Points:** 2
**Phase:** 2
**Component:** Frontend

**As a** user,
**I want** to see the original MLS description side-by-side with the rewritten versions,
**So that** I can evaluate the improvement and catch any missing details.

**Acceptance Criteria:**
- [ ] Dashboard shows a two-column layout: original on the left, rewrite on the right
- [ ] Key differences are visually highlighted (added details, improved language)
- [ ] Character counts displayed for both original and rewrite
- [ ] User can toggle between short and long rewrite versions

---

### Story 5.6 — MLS Description for New Listings (No Original)

**ID:** FPR-506
**Priority:** P1
**Points:** 3
**Phase:** 1
**Component:** AI

**As a** user,
**I want** the system to generate an MLS description from scratch when no original exists,
**So that** I can use FramePostReady for pre-list and new listing prep.

**Acceptance Criteria:**
- [ ] If `{original_description}` is empty or marked as "Not provided," the prompt switches to a "write from scratch" mode
- [ ] From-scratch descriptions are built entirely from property data fields and supplemental context
- [ ] Output quality is equivalent to rewrite quality (same keyword integration, compliance, formatting)
- [ ] Both short and long versions are still generated

---

## Epic 6 — Email Blast Copy Module

**Epic Description:** Generate complete, send-ready email marketing copy for listing announcements with multiple subject line options, preview text, body copy, and CTAs.

**Business Value:** Email remains the highest-ROI marketing channel in real estate. Most agents either don't email their database or send generic templates. FramePostReady makes every email feel custom.

**Epic Owner:** Colby
**Phase:** 1 (MVP)
**Total Story Points:** 25

---

### Story 6.1 — "Just Listed" Email Generation

**ID:** FPR-601
**Priority:** P0
**Points:** 5
**Phase:** 1
**Component:** AI

**As a** user,
**I want** a complete "Just Listed" email generated for each listing,
**So that** I can announce new listings to my database with compelling, professional copy.

**Acceptance Criteria:**
- [ ] Output includes: 3 subject line variants (each under 50 characters), preview text (40–90 characters), body copy (150–250 words), CTA button text (2–5 words)
- [ ] Subject lines use curiosity, urgency, or specificity (no ALL CAPS, no excessive punctuation)
- [ ] Preview text complements (does not repeat) the subject line
- [ ] Body is scannable with bold key details (price, beds/baths/sqft, address)
- [ ] Single primary CTA
- [ ] Tone matches selected preference
- [ ] No fabricated property details
- [ ] Banned words do not appear

---

### Story 6.2 — "Open House" Email Generation

**ID:** FPR-602
**Priority:** P0
**Points:** 3
**Phase:** 1
**Component:** AI

**As a** user,
**I want** a complete "Open House" email generated when an open house date is provided,
**So that** I can drive attendance with a dedicated email blast.

**Acceptance Criteria:**
- [ ] Generates when `{email_type}` = "Open House" and `{open_house_date}` is provided
- [ ] Subject lines emphasize the event/date/exclusivity
- [ ] Body prominently features: date, time, address, what attendees will experience
- [ ] CTA drives RSVP or "Add to Calendar" action
- [ ] Urgency cues appropriate for event promotion

---

### Story 6.3 — "Price Reduction" Email Generation

**ID:** FPR-603
**Priority:** P1
**Points:** 3
**Phase:** 1
**Component:** AI

**As a** user,
**I want** a "Price Reduction" email generated when a listing has a price change,
**So that** I can re-engage my database with a compelling reason to revisit the property.

**Acceptance Criteria:**
- [ ] Generates when `{email_type}` = "Price Reduction" and `{price_change_amount}` is provided
- [ ] Subject lines reference the reduction without being desperate ("Now $X less" not "PRICE SLASHED!")
- [ ] Body reframes the property at the new price point — what does this now buy/compare to?
- [ ] Includes both the new price and the reduction amount
- [ ] CTA drives scheduling a showing or viewing the listing

---

### Story 6.4 — "Back on Market" Email Generation

**ID:** FPR-604
**Priority:** P1
**Points:** 2
**Phase:** 1
**Component:** AI

**As a** user,
**I want** a "Back on Market" email generated for listings that return to active status,
**So that** I can create a second-chance urgency moment with my database.

**Acceptance Criteria:**
- [ ] Generates when `{email_type}` = "Back on Market"
- [ ] Subject lines create a "second chance" or "opportunity" frame
- [ ] Body addresses the natural question ("Why is it back?") without speculating — focuses on the opportunity
- [ ] CTA emphasizes acting fast ("This won't last twice")

---

### Story 6.5 — "Under Contract / Just Sold" Email Generation

**ID:** FPR-605
**Priority:** P2
**Points:** 2
**Phase:** 2
**Component:** AI

**As a** user,
**I want** an "Under Contract" or "Just Sold" email generated,
**So that** I can use sold listings as social proof and lead generation ("Thinking of selling? I just got this one done.").

**Acceptance Criteria:**
- [ ] Generates when `{email_type}` = "Under Contract" or "Just Sold"
- [ ] Subject lines frame the sold property as proof of agent competence
- [ ] Body includes key listing details, days on market, and a soft CTA for sellers ("Thinking about listing? Let's talk.")
- [ ] Does not disclose sale price unless explicitly provided

---

### Story 6.6 — Email HTML Output

**ID:** FPR-606
**Priority:** P1
**Points:** 5
**Phase:** 2
**Component:** Backend, Export

**As a** user,
**I want** email copy exported as clean HTML compatible with my email platform,
**So that** I can paste it directly into Mailchimp, HoneyBook, or Constant Contact without reformatting.

**Acceptance Criteria:**
- [ ] System generates a basic HTML email template with: inline CSS for compatibility, header with listing photo, body with formatted copy, CTA button with configurable link, footer with agent contact info and unsubscribe placeholder
- [ ] HTML passes Litmus or Email on Acid rendering test for top 5 email clients
- [ ] User can toggle between HTML view and plain text view
- [ ] Copy-to-clipboard works for both formats

---

### Story 6.7 — Subject Line A/B Test Suggestions

**ID:** FPR-607
**Priority:** P2
**Points:** 3
**Phase:** 2
**Component:** AI

**As a** user,
**I want** the 3 subject line variants labeled with their strategic approach,
**So that** I can make an informed choice or set up an A/B test.

**Acceptance Criteria:**
- [ ] Each subject line is labeled with its strategy: e.g., "Curiosity," "Urgency," "Specificity," "Question," "Benefit-Led"
- [ ] A brief note explains why each approach might work for this listing
- [ ] System suggests which subject line to use as the A/B test "control" based on general best practices

---

### Story 6.8 — Email Copy Personalization Tokens

**ID:** FPR-608
**Priority:** P2
**Points:** 2
**Phase:** 2
**Component:** AI

**As a** user,
**I want** email copy to include standard personalization tokens,
**So that** the email feels personalized when sent through my email platform.

**Acceptance Criteria:**
- [ ] Body copy includes `{first_name}` or `{name}` merge tags where natural ("Hi {first_name},")
- [ ] User can configure which merge tag format their email platform uses
- [ ] Tokens are clearly visible and not accidentally replaced during generation

---

## Epic 7 — Reel Script Module

**Epic Description:** Generate timed, shot-by-shot video scripts for Instagram Reels and TikTok property tours.

**Business Value:** Short-form video is the fastest-growing marketing format in real estate. Most agents want to make Reels but don't know what to say or how to structure a video. This removes the creative barrier entirely.

**Epic Owner:** Colby
**Phase:** 1 (MVP)
**Total Story Points:** 23

---

### Story 7.1 — Reel Script Generation (2 Styles)

**ID:** FPR-701
**Priority:** P0
**Points:** 5
**Phase:** 1
**Component:** AI

**As a** user,
**I want** 2 Reel script variants generated for each listing,
**So that** I can choose between a guided walkthrough style and a fast-cut trending style.

**Acceptance Criteria:**
- [ ] System generates exactly 2 script variants: Walkthrough Narration, Fast-Cut Trending
- [ ] Each script is 30–60 seconds total runtime
- [ ] Scripts use a timed shot list format: Shot #, Duration, Visual Direction, Voiceover/Text Overlay, Notes
- [ ] First shot (first 3 seconds) is a hook — bold statement, surprising fact, question, or visual pattern interrupt
- [ ] Final shot includes a CTA (follow, DM, link in bio, call)
- [ ] Music cue (genre/energy description) is included at the top of each script
- [ ] Text overlay copy is included for every shot
- [ ] No fabricated property details
- [ ] Shot durations add up to the total runtime stated

---

### Story 7.2 — Reel Script Hook Validation

**ID:** FPR-702
**Priority:** P1
**Points:** 2
**Phase:** 1
**Component:** AI, Compliance

**As a** quality reviewer,
**I want** the Reel hook (first 3 seconds) to be genuinely compelling,
**So that** agents don't post videos that get immediately scrolled past.

**Acceptance Criteria:**
- [ ] Hook is isolated and displayed prominently in the content dashboard
- [ ] Hook avoids generic openings ("Welcome to this beautiful home," "Check out this listing")
- [ ] Hook patterns include: "$X gets you THIS in Cape Coral," provocative question, "POV: you just found your next home," "Stop scrolling if you want Gulf access under $500K"
- [ ] System flags hooks that match a "weak hook" blocklist

---

### Story 7.3 — Reel Script Timing Validation

**ID:** FPR-703
**Priority:** P0
**Points:** 2
**Phase:** 1
**Component:** AI, Backend

**As a** user,
**I want** the total runtime of each Reel script to be verified,
**So that** I know the script will actually fit in a 30–60 second video.

**Acceptance Criteria:**
- [ ] System sums all shot durations and displays total runtime
- [ ] Warning if total exceeds 60 seconds or falls below 25 seconds
- [ ] Each individual shot duration is realistic (no "2-second" shots for complex scenes)

---

### Story 7.4 — Reel Script Text Overlay Export

**ID:** FPR-704
**Priority:** P1
**Points:** 3
**Phase:** 2
**Component:** Export

**As a** user,
**I want** to export just the text overlay copy from the Reel script,
**So that** I can quickly copy-paste overlay text into CapCut or my video editor without digging through the full script.

**Acceptance Criteria:**
- [ ] "Export Text Overlays" button generates a clean list: Shot 1: [text], Shot 2: [text], etc.
- [ ] Each overlay is concise (under 10 words) and formatted for on-screen readability
- [ ] Export is copy-to-clipboard or downloadable as a text file

---

### Story 7.5 — 15-Second Teaser Script

**ID:** FPR-705
**Priority:** P2
**Points:** 3
**Phase:** 2
**Component:** AI

**As a** user,
**I want** an optional 15-second teaser version of the Reel script,
**So that** I can create a short teaser to drive traffic to the full video or listing.

**Acceptance Criteria:**
- [ ] Teaser is exactly 4–5 shots totaling 15 seconds
- [ ] Teaser uses the strongest hook + 2–3 best feature shots + CTA
- [ ] Teaser ends with "Full tour → link in bio" or "Full video coming [day]"

---

### Story 7.6 — Reel Script Shot-to-Photo Mapping

**ID:** FPR-706
**Priority:** P3
**Points:** 5
**Phase:** 3
**Component:** AI, Backend

**As a** user,
**I want** each Reel script shot to be matched with a suggested listing photo,
**So that** I can plan my video shoot more efficiently by knowing which room/angle to capture for each shot.

**Acceptance Criteria:**
- [ ] System maps visual direction descriptions to listing photo categories (exterior, kitchen, pool, primary bedroom, etc.)
- [ ] If listing photos are available, system suggests the best-match photo for each shot
- [ ] Suggestions are displayed as thumbnails alongside each shot in the script table

---

### Story 7.7 — TikTok-Specific Script Variant

**ID:** FPR-707
**Priority:** P3
**Points:** 3
**Phase:** 3
**Component:** AI

**As a** user,
**I want** an optional TikTok-specific script variant,
**So that** I can tailor content for TikTok's slightly different audience and format conventions.

**Acceptance Criteria:**
- [ ] TikTok variant uses more casual, personality-driven language
- [ ] TikTok variant references trending audio concepts (without naming specific copyrighted songs)
- [ ] TikTok variant incorporates platform-specific hooks ("POV," "Day in the life," "Things that just make sense")
- [ ] TikTok variant is formatted identically to Reel scripts for consistency

---

## Epic 8 — Hashtag Generation Module

**Epic Description:** Generate optimized, categorized hashtag sets for Instagram that balance reach, discoverability, and hyper-local relevance for SWFL real estate.

**Business Value:** Hashtags are a low-effort, high-impact discoverability lever. Most agents either use the same 10 hashtags on every post or skip them entirely. Property-specific hashtag sets improve post reach by 30–50%.

**Epic Owner:** Colby
**Phase:** 1 (MVP)
**Total Story Points:** 18

---

### Story 8.1 — Hashtag Set Generation (30 Tags)

**ID:** FPR-801
**Priority:** P0
**Points:** 5
**Phase:** 1
**Component:** AI

**As a** user,
**I want** 30 property-specific hashtags generated for each listing,
**So that** I can maximize discoverability without spending time researching tags.

**Acceptance Criteria:**
- [ ] System generates exactly 30 hashtags
- [ ] Hashtags are organized into 4 categories: Location (7–8), Property Type (7–8), Lifestyle/Buyer Intent (7–8), Broad Reach (7–8)
- [ ] All hashtags are lowercase with no spaces within tags
- [ ] Hashtags are tailored to the specific property (Gulf access home gets different tags than a golf community condo)
- [ ] SWFL staple tags always included when relevant (#capecoral, #fortmyers, #naplesfl, #swfl, #swflrealestate, #gulfcoastliving, #floridahomes, #floridarealestate)
- [ ] Output includes a copy-paste block with all 30 hashtags separated by spaces

---

### Story 8.2 — First Comment Hashtag Set (15 Tags)

**ID:** FPR-802
**Priority:** P0
**Points:** 2
**Phase:** 1
**Component:** AI

**As a** user,
**I want** a separate "first comment" hashtag set of 15 supplemental tags,
**So that** I can use the Instagram strategy of posting additional hashtags as the first comment.

**Acceptance Criteria:**
- [ ] First comment set contains 15 broader, supplemental hashtags not included in the main set
- [ ] These tags are higher-volume/broader reach than the main set
- [ ] Output is a separate copy-paste block clearly labeled "First Comment Set"

---

### Story 8.3 — Categorized Hashtag Breakdown Display

**ID:** FPR-803
**Priority:** P1
**Points:** 2
**Phase:** 1
**Component:** Frontend, AI

**As a** user,
**I want** to see hashtags organized by category,
**So that** I can swap out individual tags or understand the strategy behind the selection.

**Acceptance Criteria:**
- [ ] Dashboard displays hashtags grouped under 4 category headers: Location, Property Type, Lifestyle, Broad Reach
- [ ] Each category is visually distinct (color-coded or grouped in cards)
- [ ] User can remove individual tags from any category
- [ ] Removing a tag from a category automatically adjusts the copy-paste block

---

### Story 8.4 — Shadowban/Restricted Hashtag Filtering

**ID:** FPR-804
**Priority:** P1
**Points:** 3
**Phase:** 1
**Component:** AI, Compliance

**As a** user,
**I want** the system to automatically exclude Instagram hashtags that are known to be shadowbanned or restricted,
**So that** my posts don't get penalized or suppressed.

**Acceptance Criteria:**
- [ ] System maintains a blocklist of shadowbanned/restricted Instagram hashtags (updated monthly)
- [ ] Generated hashtags are cross-checked against the blocklist before output
- [ ] Any matches are replaced with alternatives automatically
- [ ] Blocklist is stored in Airtable (not hardcoded) for easy maintenance

---

### Story 8.5 — Custom Seed Hashtags

**ID:** FPR-805
**Priority:** P1
**Points:** 2
**Phase:** 2
**Component:** Frontend, AI

**As a** user,
**I want** to add custom hashtags that are always included in my generated sets,
**So that** my brand tags and preferred local tags appear on every post.

**Acceptance Criteria:**
- [ ] Settings page includes a "Custom Seed Hashtags" field
- [ ] Seed hashtags are always included in the main set (count toward the 30)
- [ ] Agent-specific seed tags (from Agent table) override global seeds for that agent's listings
- [ ] System ensures no duplicate tags between seeds and generated tags

---

### Story 8.6 — Hashtag Performance Tracking

**ID:** FPR-806
**Priority:** P3
**Points:** 4
**Phase:** 3
**Component:** Analytics, Database

**As a** user,
**I want** to track which hashtag sets drive the most engagement over time,
**So that** I can refine my hashtag strategy with data.

**Acceptance Criteria:**
- [ ] System stores which hashtag set was used for each listing
- [ ] If engagement data is available (manual entry or API integration), it's linked to the hashtag set
- [ ] Dashboard shows: most frequently used tags, top-performing tags (by engagement), underperforming tags to consider replacing

---

## Epic 9 — Content Dashboard UI

**Epic Description:** Build the primary interface where users view, review, edit, and manage all generated content for a listing.

**Business Value:** The dashboard is the product experience. If it's fast, clear, and easy to use, agents will adopt it. If it's clunky, they'll go back to writing their own copy (badly).

**Epic Owner:** Colby
**Phase:** 2 (Client-Facing)
**Total Story Points:** 34

---

### Story 9.1 — Listing Summary Header

**ID:** FPR-901
**Priority:** P0
**Points:** 3
**Phase:** 2
**Component:** Frontend

**As a** user viewing a listing's content,
**I want** to see a summary of the property at the top of the dashboard,
**So that** I can confirm I'm looking at the right listing and quickly reference key details.

**Acceptance Criteria:**
- [ ] Header displays: hero photo thumbnail, full address, price, beds/baths/sqft, property type, content status badge
- [ ] Header is sticky (stays visible when scrolling through content)
- [ ] Price is formatted with commas and dollar sign
- [ ] Status badge is color-coded: Generating (yellow), Content Ready (green), Delivered (blue), Archived (gray)

---

### Story 9.2 — Content Type Tab Navigation

**ID:** FPR-902
**Priority:** P0
**Points:** 3
**Phase:** 2
**Component:** Frontend

**As a** user,
**I want** to navigate between the 6 content types via tabs,
**So that** I can quickly switch between Instagram, Facebook, MLS, Email, Reel, and Hashtag outputs.

**Acceptance Criteria:**
- [ ] Horizontal tab bar with 6 tabs: Instagram, Facebook, MLS, Email, Reel Script, Hashtags
- [ ] Active tab is visually highlighted
- [ ] Tab displays a checkmark if content has been approved, a warning icon if content has compliance flags
- [ ] Switching tabs does not reload the page
- [ ] Mobile: tabs are horizontally scrollable

---

### Story 9.3 — Variant Selector

**ID:** FPR-903
**Priority:** P0
**Points:** 3
**Phase:** 2
**Component:** Frontend

**As a** user,
**I want** to switch between content variants within a content type,
**So that** I can compare options and choose the best one.

**Acceptance Criteria:**
- [ ] Within each content type tab, variant labels are displayed as selectable pills/buttons
- [ ] Instagram shows 3 variants: Hook-Driven, Storytelling, Direct CTA
- [ ] Facebook shows 2 variants: Community-Focused, Feature-Focused
- [ ] MLS shows 2 versions: Short, Long
- [ ] Email shows type variants: Just Listed, Open House, Price Reduction, etc.
- [ ] Reel Script shows 2 styles: Walkthrough, Fast-Cut
- [ ] Hashtags shows: Main Set, First Comment Set, Categorized
- [ ] Selected variant content displays in the main content area

---

### Story 9.4 — Content Display Area

**ID:** FPR-904
**Priority:** P0
**Points:** 3
**Phase:** 2
**Component:** Frontend

**As a** user,
**I want** the generated content displayed in a clean, readable format,
**So that** I can easily read, review, and assess the quality before using it.

**Acceptance Criteria:**
- [ ] Content renders with proper formatting (line breaks, paragraphs, bold text, emoji)
- [ ] Reel scripts render as properly formatted tables
- [ ] Hashtag blocks render as tag-style pills or a formatted copy block
- [ ] Content area is scrollable for long outputs
- [ ] Word count and character count displayed below the content

---

### Story 9.5 — Copy to Clipboard (Per Block)

**ID:** FPR-905
**Priority:** P0
**Points:** 2
**Phase:** 2
**Component:** Frontend

**As a** user,
**I want** to copy any content block to my clipboard with one click,
**So that** I can immediately paste it into Instagram, Facebook, my MLS, or my email platform.

**Acceptance Criteria:**
- [ ] "Copy" button appears on every content block
- [ ] Click copies the content as plain text (formatted for the target platform)
- [ ] Button shows "Copied!" confirmation for 2 seconds after click
- [ ] Hashtag copy includes proper spacing between tags
- [ ] Email copy includes subject line, preview text, body, and CTA as a formatted block

---

### Story 9.6 — Inline Content Editing

**ID:** FPR-906
**Priority:** P0
**Points:** 5
**Phase:** 2
**Component:** Frontend, Backend

**As a** user,
**I want** to edit any generated content block directly in the dashboard,
**So that** I can make quick adjustments without leaving the tool.

**Acceptance Criteria:**
- [ ] "Edit" toggle switches the content display to an editable text area
- [ ] Edits are auto-saved (or saved on "Save" button click)
- [ ] Edited content updates the Airtable Content record
- [ ] "Edited" checkbox is automatically marked on the Content record
- [ ] User can add Edit Notes explaining what was changed
- [ ] "Revert to Original" button restores the AI-generated version
- [ ] Character count updates in real-time as the user edits

---

### Story 9.7 — Regenerate Button (Per Block)

**ID:** FPR-907
**Priority:** P0
**Points:** 3
**Phase:** 2
**Component:** Frontend, Backend

**As a** user,
**I want** to regenerate a single content block from the dashboard,
**So that** if one output is weak, I can get a fresh version without regenerating everything.

**Acceptance Criteria:**
- [ ] "Regenerate" button appears on every content block
- [ ] Regeneration creates a new version (old version is preserved)
- [ ] Loading indicator shows while regeneration is in progress
- [ ] New version appears in the content area with a "Version 2" badge
- [ ] User can toggle between versions to compare

---

### Story 9.8 — Copy All Content

**ID:** FPR-908
**Priority:** P1
**Points:** 2
**Phase:** 2
**Component:** Frontend

**As a** user,
**I want** to copy all 6 content types to my clipboard in a single click,
**So that** I can quickly paste the entire content package into a document or message.

**Acceptance Criteria:**
- [ ] "Copy All" button in the export bar copies all content types as a formatted text block
- [ ] Content is organized with clear headers: --- INSTAGRAM CAPTIONS ---, --- FACEBOOK CAPTIONS ---, etc.
- [ ] Each variant within a content type is included
- [ ] Hashtags are included at the end

---

### Story 9.9 — Content Approval Workflow

**ID:** FPR-909
**Priority:** P1
**Points:** 3
**Phase:** 2
**Component:** Frontend, Backend

**As a** user,
**I want** to mark individual content blocks as "Approved,"
**So that** I can track which outputs are finalized and ready for use or delivery.

**Acceptance Criteria:**
- [ ] Each content block has an "Approve" button
- [ ] Approved content shows a green checkmark badge
- [ ] Approved status is saved to the Content record in Airtable
- [ ] Content type tab shows a checkmark icon when all variants within it are approved
- [ ] "Approve All" button marks all content blocks as approved at once
- [ ] Approved content can still be edited (approval is cleared if edited, requiring re-approval)

---

### Story 9.10 — Listing History & Version Navigation

**ID:** FPR-910
**Priority:** P2
**Points:** 3
**Phase:** 2
**Component:** Frontend

**As a** user,
**I want** to view past content packages I've generated,
**So that** I can reference previous work, reuse content, or track what was delivered to which client.

**Acceptance Criteria:**
- [ ] Sidebar or top-level navigation shows a list of all processed listings
- [ ] Listings are sortable by: date generated, agent name, city, content status
- [ ] Clicking a listing loads its full content dashboard
- [ ] Search/filter by address, agent name, or city

---

### Story 9.11 — Mobile-Responsive Dashboard

**ID:** FPR-911
**Priority:** P1
**Points:** 4
**Phase:** 2
**Component:** Frontend

**As a** user on my phone or tablet,
**I want** the content dashboard to be fully functional on mobile,
**So that** I can review and copy content from anywhere.

**Acceptance Criteria:**
- [ ] Content tabs are horizontally scrollable on mobile
- [ ] Content blocks stack vertically
- [ ] Copy buttons are thumb-accessible
- [ ] Listing summary header collapses to essential info on mobile
- [ ] All interactive elements (edit, regenerate, approve, copy) function on mobile

---

## Epic 10 — Export & Delivery System

**Epic Description:** Enable content packages to be exported as branded PDFs, delivered to Google Drive, and sent via email to clients.

**Business Value:** Professional delivery separates FramePostReady from "just an AI tool." Branded PDF exports make the service feel premium and justify the price point.

**Epic Owner:** Colby
**Phase:** 2 (Client-Facing)
**Total Story Points:** 28

---

### Story 10.1 — Branded PDF Generation

**ID:** FPR-1001
**Priority:** P1
**Points:** 8
**Phase:** 2
**Component:** Export, Automation

**As a** user,
**I want** to export a listing's full content package as a branded PDF,
**So that** I can deliver a professional, polished document to my client.

**Acceptance Criteria:**
- [ ] PDF includes all 6 content types across 6–7 pages (cover + one per content type)
- [ ] Cover page includes: Frame & Form Studio logo, agent headshot/logo, property hero photo, address, price, beds/baths/sqft, date
- [ ] Each content page is cleanly formatted with clear headers, readable fonts, and appropriate spacing
- [ ] Reel script renders as a properly formatted table
- [ ] Hashtags render as a visual tag block
- [ ] PDF uses Frame & Form Studio branding (colors, fonts, logo) from Settings
- [ ] PDF file name format: `FramePostReady_[Address]_[Date].pdf`
- [ ] Generation completes within 30 seconds

---

### Story 10.2 — Google Drive Auto-Delivery

**ID:** FPR-1002
**Priority:** P1
**Points:** 5
**Phase:** 2
**Component:** Export, Automation

**As a** user,
**I want** the PDF content package automatically uploaded to the client's Google Drive folder,
**So that** delivery is seamless and organized.

**Acceptance Criteria:**
- [ ] System creates a listing-specific subfolder in the agent's Google Drive folder: `{Agent Name}/{Address} — {Date}/`
- [ ] PDF is uploaded to this subfolder
- [ ] Agent's Google Drive Folder ID is pulled from the Agents table
- [ ] If no folder ID is configured, system skips Drive upload and notifies the user
- [ ] Upload status is logged in the Delivery Log table

---

### Story 10.3 — Email Delivery Notification

**ID:** FPR-1003
**Priority:** P1
**Points:** 3
**Phase:** 2
**Component:** Export, Automation

**As a** user,
**I want** a delivery email sent to the client with a link to their content package,
**So that** the client knows their content is ready and where to find it.

**Acceptance Criteria:**
- [ ] Email includes: personalized greeting, listing address reference, Google Drive link to the content folder, brief instructions on how to use the content, Frame & Form Studio branding and contact info
- [ ] Email is sent via Gmail or HoneyBook API
- [ ] Email is logged in the Delivery Log table
- [ ] "Delivered" status is automatically set on the Listing record

---

### Story 10.4 — Individual Content Block Export

**ID:** FPR-1004
**Priority:** P2
**Points:** 3
**Phase:** 2
**Component:** Export

**As a** user,
**I want** to export individual content blocks as separate text files,
**So that** I can share specific outputs without the full PDF package.

**Acceptance Criteria:**
- [ ] Each content type tab has an "Export" button
- [ ] Export options: copy to clipboard (plain text), download as .txt file, download as .docx file
- [ ] Exported file is named: `[ContentType]_[Address]_[Date].[ext]`

---

### Story 10.5 — Delivery Log & Tracking

**ID:** FPR-1005
**Priority:** P1
**Points:** 3
**Phase:** 2
**Component:** Database, Backend

**As a** business operator,
**I want** every delivery tracked with date, method, and client feedback,
**So that** I can monitor service quality and client satisfaction.

**Acceptance Criteria:**
- [ ] Delivery Log table records: Listing, Agent, Delivery Method (PDF Email, Google Drive, Manual Handoff), PDF URL, Delivery Date, Opened (checkbox), Feedback (text), Rating (1–5)
- [ ] Log is auto-populated on delivery
- [ ] Feedback and rating fields are manually filled after client response
- [ ] Dashboard view shows: deliveries this week, average client rating, listings pending delivery

---

### Story 10.6 — Watermark / Attribution Toggle

**ID:** FPR-1006
**Priority:** P2
**Points:** 2
**Phase:** 2
**Component:** Settings, Export

**As a** user,
**I want** to toggle whether copied content includes a "Generated by FramePostReady" attribution line,
**So that** I can choose whether to credit the tool or keep it invisible.

**Acceptance Criteria:**
- [ ] Settings includes an "Include Attribution" toggle (default: off)
- [ ] When on, clipboard copies append: `--- Generated by FramePostReady | Frame & Form Studio`
- [ ] PDF footer includes Frame & Form branding regardless (this is a service, not white-labeled)

---

### Story 10.7 — Bulk Export (Multiple Listings)

**ID:** FPR-1007
**Priority:** P3
**Points:** 4
**Phase:** 3
**Component:** Export, Automation

**As a** user with multiple listings,
**I want** to export content packages for multiple listings at once,
**So that** I can deliver a batch of content to a team or process multiple listings efficiently.

**Acceptance Criteria:**
- [ ] User can select multiple listings from the listings view
- [ ] "Export Selected" generates individual PDFs for each and bundles them in a ZIP or uploads all to Google Drive
- [ ] Batch export handles up to 15 listings at once
- [ ] Progress indicator shows completion status

---

## Epic 11 — Agent & Client Management

**Epic Description:** Manage agent profiles, preferences, and client relationships within the system.

**Business Value:** Storing agent profiles eliminates repetitive data entry, ensures brand consistency across listings, and enables client-specific delivery workflows.

**Epic Owner:** Colby
**Phase:** 2 (Client-Facing)
**Total Story Points:** 16

---

### Story 11.1 — Agent Profile Creation

**ID:** FPR-1101
**Priority:** P0
**Points:** 3
**Phase:** 1
**Component:** Database, Frontend

**As a** user,
**I want** to create and save agent profiles with their contact info and preferences,
**So that** I don't have to re-enter agent details for every listing.

**Acceptance Criteria:**
- [ ] Agent profile includes: name, email, phone, Instagram handle, Facebook page URL, brokerage, preferred tone, default CTA, headshot URL, logo URL, Google Drive Folder ID
- [ ] Profile saves to the Agents table in Airtable
- [ ] Profile is selectable from a dropdown when generating content for a new listing
- [ ] Selected agent's info auto-populates into content prompts

---

### Story 11.2 — Agent Profile Editing

**ID:** FPR-1102
**Priority:** P1
**Points:** 2
**Phase:** 2
**Component:** Frontend, Database

**As a** user,
**I want** to edit existing agent profiles,
**So that** I can update contact info, preferences, or branding as agents change.

**Acceptance Criteria:**
- [ ] All agent profile fields are editable from the Settings page or a dedicated Agent Management view
- [ ] Changes are saved to Airtable
- [ ] Editing an agent profile does not retroactively change content already generated for that agent

---

### Story 11.3 — Agent Listing History

**ID:** FPR-1103
**Priority:** P2
**Points:** 3
**Phase:** 2
**Component:** Frontend, Database

**As a** user,
**I want** to see all listings and content packages associated with a specific agent,
**So that** I can track what I've delivered to each client.

**Acceptance Criteria:**
- [ ] Agent detail view shows a list of all linked listings with: address, date generated, content status, delivery status
- [ ] Clicking a listing navigates to its content dashboard
- [ ] Summary stats: total listings processed, total deliveries, average feedback rating

---

### Story 11.4 — Agent Tier & Billing Tracking

**ID:** FPR-1104
**Priority:** P2
**Points:** 3
**Phase:** 2
**Component:** Database

**As a** business operator,
**I want** to track each agent's pricing tier and usage,
**So that** I can manage billing and identify upsell opportunities.

**Acceptance Criteria:**
- [ ] Agent record includes Tier field: Bundled, Single, Monthly-5, Monthly-15
- [ ] Dashboard view shows: listings used this month vs. tier limit, revenue per agent, agents approaching their tier limit (upsell opportunity)

---

### Story 11.5 — Multi-Agent Support per Listing

**ID:** FPR-1105
**Priority:** P3
**Points:** 5
**Phase:** 3
**Component:** Backend, AI

**As a** user working with co-listing agents,
**I want** to generate content that references both agents,
**So that** co-listed properties have proper attribution for both agents.

**Acceptance Criteria:**
- [ ] Listing input supports selecting 2 agents
- [ ] Content prompts include both agent names, handles, and contact info
- [ ] CTA references both agents or the primary contact as configured
- [ ] PDF export includes both agents' branding

---

## Epic 12 — Settings & Configuration

**Epic Description:** Provide a settings interface for managing default preferences, branding, MLS configuration, and system-wide defaults.

**Business Value:** Settings reduce per-listing friction and ensure consistency. Good defaults mean less manual input and faster content generation.

**Epic Owner:** Colby
**Phase:** 2 (Client-Facing)
**Total Story Points:** 14

---

### Story 12.1 — Default Agent Profile Settings

**ID:** FPR-1201
**Priority:** P1
**Points:** 2
**Phase:** 2
**Component:** Frontend, Database

**As a** user,
**I want** to set a default agent profile that pre-fills when generating new content,
**So that** I don't have to select my profile every time.

**Acceptance Criteria:**
- [ ] Settings includes a "Default Agent" dropdown populated from the Agents table
- [ ] Default agent pre-fills on the listing input page
- [ ] User can override the default on any individual listing

---

### Story 12.2 — Default Tone & Target Buyer Settings

**ID:** FPR-1202
**Priority:** P1
**Points:** 1
**Phase:** 2
**Component:** Frontend, Database

**As a** user,
**I want** to set default tone and target buyer preferences,
**So that** these fields are pre-filled and I only change them when a listing requires a different approach.

**Acceptance Criteria:**
- [ ] Settings includes default Tone dropdown and default Target Buyer dropdown
- [ ] Defaults pre-fill on the listing input page
- [ ] Per-listing overrides are supported

---

### Story 12.3 — MLS Character Limit Settings

**ID:** FPR-1203
**Priority:** P1
**Points:** 1
**Phase:** 1
**Component:** Frontend, Database

**As a** user,
**I want** to configure MLS description character limits,
**So that** generated descriptions match my local MLS system's requirements.

**Acceptance Criteria:**
- [ ] Settings fields for: Short Version Limit (default 500), Long Version Limit (default 1,000)
- [ ] Values are passed to MLS prompt templates as variables
- [ ] Changes apply to all future generations (not retroactive)

---

### Story 12.4 — PDF Brand Settings

**ID:** FPR-1204
**Priority:** P1
**Points:** 3
**Phase:** 2
**Component:** Frontend, Export

**As a** user,
**I want** to configure branding for PDF exports,
**So that** every content package I deliver looks professional and on-brand.

**Acceptance Criteria:**
- [ ] Settings includes: logo upload, primary color (hex), accent color (hex)
- [ ] Logo appears on PDF cover page and footer
- [ ] Colors are applied to PDF headers, dividers, and accent elements
- [ ] Preview of branded PDF available before generation

---

### Story 12.5 — Custom Hashtag Seeds Settings

**ID:** FPR-1205
**Priority:** P1
**Points:** 2
**Phase:** 2
**Component:** Frontend, Database

**As a** user,
**I want** to configure hashtags that always appear in my generated sets,
**So that** my brand tags and preferred local tags are included automatically.

**Acceptance Criteria:**
- [ ] Settings field for seed hashtags (comma-separated input)
- [ ] Seed tags are always included in the main set
- [ ] Agent-level seed tags (from Agent profile) override global seeds for that agent
- [ ] Validation: must start with #, no spaces within tag, no duplicates

---

### Story 12.6 — Notification Preferences

**ID:** FPR-1206
**Priority:** P2
**Points:** 2
**Phase:** 2
**Component:** Frontend, Automation

**As a** user,
**I want** to configure how and when I receive notifications,
**So that** I'm informed without being overwhelmed.

**Acceptance Criteria:**
- [ ] Options: email notifications (on/off), Slack notifications (on/off, requires Slack webhook URL)
- [ ] Notification triggers: content generation complete, scraping failed, delivery confirmed
- [ ] User can disable notifications for individual trigger types

---

### Story 12.7 — API Key Management

**ID:** FPR-1207
**Priority:** P1
**Points:** 3
**Phase:** 2
**Component:** Settings, Backend

**As a** system operator,
**I want** API keys stored securely and manageable from one place,
**So that** I can rotate keys, monitor usage, and maintain security.

**Acceptance Criteria:**
- [ ] API keys (Anthropic, Apify, Google Drive) are stored in Make.com connections (not in Airtable or frontend)
- [ ] Settings page shows connection status for each API (connected/disconnected)
- [ ] Key rotation does not require code changes — only Make.com connection updates

---

## Epic 13 — Compliance & Quality Control

**Epic Description:** Ensure all generated content meets MLS compliance standards, fair housing laws, and quality benchmarks before delivery.

**Business Value:** A single compliance violation can cost an agent their listing, their reputation, or their license. This epic is a legal and trust necessity.

**Epic Owner:** Colby
**Phase:** 1 (MVP)
**Total Story Points:** 20

---

### Story 13.1 — MLS Blocked Terms List Management

**ID:** FPR-1301
**Priority:** P0
**Points:** 3
**Phase:** 1
**Component:** Database, Compliance

**As a** system operator,
**I want** a maintainable list of blocked MLS terms,
**So that** the compliance scanner can flag violations in generated content.

**Acceptance Criteria:**
- [ ] Blocked terms stored in Airtable (or config table) with categories: Fair Housing Violations, Unsubstantiated Claims, Overused/Low-Quality
- [ ] Each term includes: the term, the category, a suggested replacement
- [ ] List is editable without code changes
- [ ] Initial list includes all terms from Section 10.1 of the Implementation Guide

---

### Story 13.2 — Automated MLS Compliance Scan

**ID:** FPR-1302
**Priority:** P0
**Points:** 5
**Phase:** 1
**Component:** Backend, Compliance

**As a** user,
**I want** every MLS description automatically scanned for compliance violations after generation,
**So that** I never submit a non-compliant description to the MLS.

**Acceptance Criteria:**
- [ ] Scan runs automatically after MLS description generation
- [ ] Scan runs again after any manual edit to the MLS description
- [ ] Flagged terms are highlighted in the content display with a warning icon
- [ ] Each flag shows: the term, why it's blocked, suggested replacement
- [ ] Scan results are logged in the Content record
- [ ] If any flags exist, the MLS tab shows a warning icon in the tab navigation

---

### Story 13.3 — Factual Accuracy Verification Checklist

**ID:** FPR-1303
**Priority:** P0
**Points:** 3
**Phase:** 1
**Component:** Compliance

**As a** quality reviewer,
**I want** a checklist to verify that all property facts in generated content match the source data,
**So that** no AI-hallucinated details make it into client deliverables.

**Acceptance Criteria:**
- [ ] QA checklist is accessible from the content dashboard (per listing)
- [ ] Checklist items from Section 10.2 of the Implementation Guide are pre-populated
- [ ] Each item has a checkbox and optional notes field
- [ ] Checklist completion status is tracked on the Listing record
- [ ] Content cannot be marked "Approved" until the checklist is at least 80% complete (soft gate, overridable)

---

### Story 13.4 — Instagram Shadowban Hashtag List Management

**ID:** FPR-1304
**Priority:** P1
**Points:** 2
**Phase:** 1
**Component:** Database, Compliance

**As a** system operator,
**I want** a maintainable list of shadowbanned Instagram hashtags,
**So that** the hashtag generator never includes tags that would suppress post reach.

**Acceptance Criteria:**
- [ ] List stored in Airtable with: hashtag, date added, source/confirmation
- [ ] List is updated monthly (task in Maintenance SOP)
- [ ] Hashtag generation module cross-references this list before output

---

### Story 13.5 — Content Quality Scoring

**ID:** FPR-1305
**Priority:** P2
**Points:** 3
**Phase:** 2
**Component:** Backend, Database

**As a** product operator,
**I want** to rate the quality of generated content on a per-listing basis,
**So that** I can track quality trends and identify when prompts need iteration.

**Acceptance Criteria:**
- [ ] Each listing has a "Quality Score" field (1–5 rating)
- [ ] Score is manually assigned after QA review
- [ ] Airtable dashboard shows: average quality score over time, score distribution, listings scoring below 3 (prompt improvement needed)

---

### Story 13.6 — Banned Word Auto-Replacement

**ID:** FPR-1306
**Priority:** P2
**Points:** 4
**Phase:** 2
**Component:** AI, Backend

**As a** user,
**I want** the system to automatically replace banned words in generated content with better alternatives,
**So that** I spend less time manually fixing AI outputs.

**Acceptance Criteria:**
- [ ] System detects banned words across all 6 content types (not just MLS)
- [ ] Auto-replacement uses the suggested replacement from the blocked terms list
- [ ] Replacements are logged for prompt improvement (if the AI keeps generating banned words, the prompt needs updating)
- [ ] User sees a notification: "2 banned words were auto-replaced" with option to review changes

---

## Epic 14 — Analytics & Reporting

**Epic Description:** Track system usage, content performance, revenue, and operational metrics.

**Business Value:** Data-driven decisions on pricing, prompt quality, and feature prioritization.

**Epic Owner:** Colby
**Phase:** 3 (Scale)
**Total Story Points:** 18

---

### Story 14.1 — Usage Dashboard (Airtable)

**ID:** FPR-1401
**Priority:** P1
**Points:** 3
**Phase:** 2
**Component:** Database

**As a** business operator,
**I want** an at-a-glance dashboard showing key system metrics,
**So that** I can monitor the health and growth of FramePostReady.

**Acceptance Criteria:**
- [ ] Airtable dashboard view includes: listings processed (this week/month/all time), content blocks generated, API cost (this week/month), active agents, deliveries completed, average quality score

---

### Story 14.2 — Revenue Tracking Dashboard

**ID:** FPR-1402
**Priority:** P2
**Points:** 3
**Phase:** 2
**Component:** Database

**As a** business operator,
**I want** to track revenue and margins per agent and per tier,
**So that** I can validate pricing and identify my most profitable segments.

**Acceptance Criteria:**
- [ ] Dashboard shows: revenue by agent, revenue by tier, total monthly revenue, API cost as percentage of revenue, average revenue per listing

---

### Story 14.3 — Content Variant Usage Analytics

**ID:** FPR-1403
**Priority:** P2
**Points:** 3
**Phase:** 3
**Component:** Database, Backend

**As a** product operator,
**I want** to know which content variants are most frequently used (copied/approved),
**So that** I can prioritize the most valuable variants and potentially trim underperformers.

**Acceptance Criteria:**
- [ ] Track which variant was copied/approved per content type per listing
- [ ] Dashboard shows: most popular Instagram variant (Hook vs. Story vs. CTA), most popular Facebook variant, most popular Reel style, most popular email type

---

### Story 14.4 — Prompt Performance Report

**ID:** FPR-1404
**Priority:** P2
**Points:** 3
**Phase:** 3
**Component:** Database

**As a** product operator,
**I want** a monthly report on prompt template performance,
**So that** I know which prompts need iteration and which are performing well.

**Acceptance Criteria:**
- [ ] Report includes: quality score by prompt template version, edit rate by prompt template version (how often output needed manual editing), common edit types, top-performing and underperforming templates

---

### Story 14.5 — Client Satisfaction Report

**ID:** FPR-1405
**Priority:** P2
**Points:** 3
**Phase:** 3
**Component:** Database

**As a** business operator,
**I want** a summary of client feedback and satisfaction scores,
**So that** I can address issues proactively and use positive feedback for marketing.

**Acceptance Criteria:**
- [ ] Report aggregates: average rating from Delivery Log, feedback themes (common praise/complaints), NPS-style satisfaction trend over time

---

### Story 14.6 — Cost Optimization Alert

**ID:** FPR-1406
**Priority:** P2
**Points:** 3
**Phase:** 3
**Component:** Automation, Database

**As a** business operator,
**I want** automated alerts when API costs per listing exceed expected thresholds,
**So that** I can catch prompt issues or parsing errors before they impact margins.

**Acceptance Criteria:**
- [ ] Alert triggers if per-listing API cost exceeds $0.10
- [ ] Alert triggers if monthly API spend exceeds a configurable threshold
- [ ] Alert sent via email or Slack
- [ ] Alert includes: listing address, token counts, cost breakdown, possible cause

---

## Epic 15 — Automation & Orchestration (Make.com)

**Epic Description:** Build the Make.com scenarios that connect all system components — from listing intake to content generation to delivery.

**Business Value:** Make.com is the nervous system. Without reliable automation, FramePostReady requires manual orchestration for every listing, which defeats the purpose.

**Epic Owner:** Colby
**Phase:** 1 (MVP)
**Total Story Points:** 24

---

### Story 15.1 — Scenario 1: Listing Intake Pipeline

**ID:** FPR-1501
**Priority:** P0
**Points:** 8
**Phase:** 1
**Component:** Automation

**As a** system,
**I need** an automated pipeline that receives a listing URL, scrapes it, enriches it, and stores it in the database,
**So that** content generation can be triggered without manual data entry.

**Acceptance Criteria:**
- [ ] Make.com scenario includes: webhook trigger, HTTP request to Apify, sleep/wait for Apify completion, HTTP request to retrieve results, JSON parse, SWFL keyword matching, Airtable create record, status update, trigger to Scenario 2
- [ ] Entire pipeline completes within 90 seconds for a single listing
- [ ] Error handling routes failures to a "Scrape Failed" status with notification
- [ ] Scenario is documented with module-by-module description

---

### Story 15.2 — Scenario 2: Content Generation Pipeline

**ID:** FPR-1502
**Priority:** P0
**Points:** 8
**Phase:** 1
**Component:** Automation

**As a** system,
**I need** an automated pipeline that takes listing data, merges it into prompts, calls the Claude API, parses responses, and stores content,
**So that** all 6 content types are generated automatically.

**Acceptance Criteria:**
- [ ] Make.com scenario includes: webhook/trigger from Scenario 1, Airtable get listing record, Airtable search prompt templates, iterator for 6 content types, text aggregator for variable merging, HTTP request to Claude API, JSON parse response, text parser for variant splitting, Airtable create content records, status update, notification
- [ ] All 6 content types generate within 60 seconds total
- [ ] Failed API calls retry once after 5-second delay
- [ ] Token usage and cost are captured per call
- [ ] Scenario is documented with module-by-module description

---

### Story 15.3 — Scenario 3: Export & Delivery Pipeline

**ID:** FPR-1503
**Priority:** P1
**Points:** 5
**Phase:** 2
**Component:** Automation

**As a** system,
**I need** an automated pipeline that generates a PDF, uploads it to Google Drive, and emails the client,
**So that** content delivery requires no manual steps.

**Acceptance Criteria:**
- [ ] Make.com scenario includes: trigger (manual or status change), Airtable pull content, Airtable pull agent data, PDF generation (Documint or Make PDF module), Google Drive upload, email send, Airtable delivery log update, status update to "Delivered"
- [ ] PDF matches the branded template spec from Story 10.1
- [ ] Google Drive folder structure matches the spec from Section 8.2 of the Implementation Guide
- [ ] Scenario is documented

---

### Story 15.4 — Webhook Security

**ID:** FPR-1504
**Priority:** P1
**Points:** 3
**Phase:** 1
**Component:** Automation, Backend

**As a** system operator,
**I want** Make.com webhooks secured against unauthorized access,
**So that** no one can trigger content generation or access listing data without authorization.

**Acceptance Criteria:**
- [ ] Webhooks use unique, non-guessable URLs
- [ ] Webhook payloads include a secret token validated by Make.com
- [ ] Unauthorized requests return 401 and are logged
- [ ] Webhook URLs are not exposed in frontend code

---

## Epic 16 — Database Infrastructure (Airtable)

**Epic Description:** Set up and configure the Airtable base that stores all FramePostReady data.

**Business Value:** The database is the single source of truth. Every feature depends on it being correctly structured from day one.

**Epic Owner:** Colby
**Phase:** 1 (MVP)
**Total Story Points:** 13

---

### Story 16.1 — Airtable Base Setup

**ID:** FPR-1601
**Priority:** P0
**Points:** 5
**Phase:** 1
**Component:** Database

**As a** system operator,
**I need** the Airtable base created with all 5 tables and their fields,
**So that** all system components have a structured data store to read from and write to.

**Acceptance Criteria:**
- [ ] Listings table created per Section 3.1 schema
- [ ] Agents table created per Section 3.2 schema
- [ ] Content table created per Section 3.3 schema
- [ ] Prompt Templates table created per Section 3.4 schema
- [ ] Delivery Log table created per Section 3.5 schema
- [ ] All link fields properly connected between tables
- [ ] All single select fields populated with their option lists
- [ ] All auto-populated fields (Created Time, Last Modified) configured

---

### Story 16.2 — Airtable Dashboard Views

**ID:** FPR-1602
**Priority:** P1
**Points:** 3
**Phase:** 1
**Component:** Database

**As a** system operator,
**I want** preconfigured Airtable views for operational monitoring,
**So that** I can quickly see system status without building queries.

**Acceptance Criteria:**
- [ ] Listings table views: Kanban by Content Status, All Active Listings (grid), This Week's Listings (filtered)
- [ ] Content table views: By Listing (grouped), Needs Review (filtered to Draft status), Edited Content (filtered)
- [ ] Agents table views: Active Agents, By Tier
- [ ] Delivery Log views: This Week's Deliveries, Pending Feedback
- [ ] Prompt Templates views: Active Templates, By Content Type

---

### Story 16.3 — Airtable Automations (Internal)

**ID:** FPR-1603
**Priority:** P2
**Points:** 3
**Phase:** 2
**Component:** Database, Automation

**As a** system operator,
**I want** Airtable-native automations for housekeeping tasks,
**So that** routine data maintenance happens automatically.

**Acceptance Criteria:**
- [ ] Automation: when Content Status = "Delivered" for 30+ days, set to "Archived"
- [ ] Automation: when a new Agent record is created, send Colby a Slack/email notification
- [ ] Automation: when Quality Score < 3, flag the associated Prompt Template for review

---

### Story 16.4 — Prompt Template Seed Data

**ID:** FPR-1604
**Priority:** P0
**Points:** 2
**Phase:** 1
**Component:** Database

**As a** system,
**I need** all 6 prompt templates entered into the Prompt Templates table,
**So that** the content generation pipeline has prompts to work with from day one.

**Acceptance Criteria:**
- [ ] All 6 prompt templates from Section 5 of the Implementation Guide are entered
- [ ] Each template has: system prompt, user prompt template, content type, variant label, version = 1, active = true
- [ ] Templates are tested with at least 1 real listing before marking as active

---

## Epic 17 — Client-Facing Frontend

**Epic Description:** Build the web-based frontend where clients (agents) can input listings, view content, and manage their accounts.

**Business Value:** The frontend transforms FramePostReady from an internal tool into a scalable service. Without it, every listing requires Colby's manual involvement.

**Epic Owner:** Colby
**Phase:** 2 (Client-Facing)
**Total Story Points:** 26

---

### Story 17.1 — Landing Page / Login

**ID:** FPR-1701
**Priority:** P1
**Points:** 3
**Phase:** 2
**Component:** Frontend

**As a** potential client,
**I want** a professional landing page that explains what FramePostReady does and lets me log in,
**So that** I understand the value and can access the tool.

**Acceptance Criteria:**
- [ ] Landing page explains: what FramePostReady does, who it's for, how it works (3-step visual), pricing tiers, CTA to sign up or contact Frame & Form Studio
- [ ] Login/signup functionality (Wix Members or custom auth)
- [ ] Branded with Frame & Form Studio identity

---

### Story 17.2 — Listing Input Page (Client-Facing)

**ID:** FPR-1702
**Priority:** P1
**Points:** 5
**Phase:** 2
**Component:** Frontend

**As a** client (agent),
**I want** to paste a Zillow URL and set my preferences on a simple, guided page,
**So that** I can generate content without any technical knowledge.

**Acceptance Criteria:**
- [ ] Implements the wireframe from Section 7.1 of the Implementation Guide
- [ ] URL input, manual entry form (expandable), content preferences (tone, target buyer, email type, special notes), agent selection, generate button
- [ ] Form submission triggers Make.com Scenario 1 via webhook
- [ ] Loading state shown after submission with estimated wait time
- [ ] Redirects to Content Dashboard when generation is complete

---

### Story 17.3 — Content Dashboard Page (Client-Facing)

**ID:** FPR-1703
**Priority:** P1
**Points:** 8
**Phase:** 2
**Component:** Frontend

**As a** client (agent),
**I want** to view, copy, edit, and export my generated content on a clean dashboard,
**So that** I can use the content immediately with minimal friction.

**Acceptance Criteria:**
- [ ] Implements the wireframe from Section 7.2 of the Implementation Guide
- [ ] Includes all functionality from Epic 9 stories: listing summary header, content type tabs, variant selector, content display, copy button, edit toggle, regenerate button, export bar
- [ ] Data pulls from Airtable Content table via API
- [ ] Real-time updates when content is regenerated

---

### Story 17.4 — Client Settings Page

**ID:** FPR-1704
**Priority:** P1
**Points:** 3
**Phase:** 2
**Component:** Frontend

**As a** client (agent),
**I want** to manage my profile, preferences, and defaults,
**So that** the system works the way I want without per-listing configuration.

**Acceptance Criteria:**
- [ ] Implements the wireframe from Section 7.3 of the Implementation Guide
- [ ] Editable fields: name, handle, brokerage, phone, email, default tone, default CTA, MLS character limits, custom seed hashtags
- [ ] Changes save to the Agents table in Airtable

---

### Story 17.5 — Client Listing History Page

**ID:** FPR-1705
**Priority:** P2
**Points:** 3
**Phase:** 2
**Component:** Frontend

**As a** client (agent),
**I want** to view all my past listings and their content packages,
**So that** I can reference, reuse, or re-export content at any time.

**Acceptance Criteria:**
- [ ] List view of all listings associated with this agent
- [ ] Each listing shows: address, date, content status, quick actions (view, export, regenerate)
- [ ] Sortable by date, status, city
- [ ] Searchable by address

---

### Story 17.6 — Usage & Billing Page

**ID:** FPR-1706
**Priority:** P2
**Points:** 4
**Phase:** 2
**Component:** Frontend, Database

**As a** client (agent),
**I want** to see my usage against my tier limit and my billing status,
**So that** I know how many listings I have remaining and when my subscription renews.

**Acceptance Criteria:**
- [ ] Shows: current tier, listings used this month, listings remaining, renewal date
- [ ] Visual progress bar for usage against limit
- [ ] Upgrade CTA if approaching or at limit
- [ ] Links to Frame & Form Studio contact for billing questions (billing is manual in MVP; automated in V2)

---

## Epic 18 — Agent Engine Integration

**Epic Description:** Connect FramePostReady's content output to Agent Engine's automated social posting pipeline.

**Business Value:** This is the long-term play. FramePostReady generates the content; Agent Engine distributes it. Together, they create a full-service listing marketing automation platform.

**Epic Owner:** Colby
**Phase:** 3 (Scale)
**Total Story Points:** 21

---

### Story 18.1 — Content Queue for Agent Engine

**ID:** FPR-1801
**Priority:** P3
**Points:** 5
**Phase:** 3
**Component:** Backend, Database

**As a** system,
**I need** approved content to be queued for Agent Engine's posting scheduler,
**So that** content flows automatically from generation to distribution.

**Acceptance Criteria:**
- [ ] When content is marked "Approved" and the agent has Agent Engine enabled, content records are copied to an Agent Engine queue table
- [ ] Queue records include: content text, platform (Instagram/Facebook), suggested post date/time, associated listing, agent account info
- [ ] Queue is readable by Agent Engine's Make.com scenarios

---

### Story 18.2 — Multi-Week Campaign Mapping

**ID:** FPR-1802
**Priority:** P3
**Points:** 8
**Phase:** 3
**Component:** AI, Backend

**As a** user with Agent Engine,
**I want** FramePostReady content automatically mapped to a multi-week posting campaign,
**So that** a single listing generates 2–4 weeks of social content without manual scheduling.

**Acceptance Criteria:**
- [ ] System generates a posting calendar: Week 1 (Just Listed: IG Hook-Driven + FB Community-Focused + Email Just Listed), Week 2 (Feature highlight: IG Storytelling + FB Feature-Focused + Reel Walkthrough), Week 3 (Lifestyle angle: IG Direct CTA + Reel Fast-Cut), Week 4 (Open House or Price Update if applicable)
- [ ] Calendar is editable before activation
- [ ] Each post is linked to its source Content record

---

### Story 18.3 — Agent Engine Status Sync

**ID:** FPR-1803
**Priority:** P3
**Points:** 3
**Phase:** 3
**Component:** Backend, Automation

**As a** user,
**I want** to see in FramePostReady whether a content block has been posted via Agent Engine,
**So that** I have a complete view of content lifecycle from generation to publication.

**Acceptance Criteria:**
- [ ] Content records include a "Posted" status flag updated by Agent Engine
- [ ] Dashboard shows: posted date, platform posted to, engagement metrics (if available)
- [ ] Content that has been posted cannot be accidentally regenerated without warning

---

### Story 18.4 — Agent Engine Opt-In per Agent

**ID:** FPR-1804
**Priority:** P3
**Points:** 2
**Phase:** 3
**Component:** Database, Frontend

**As a** business operator,
**I want** to enable or disable Agent Engine integration per agent,
**So that** only agents who subscribe to the full automation service have their content auto-queued.

**Acceptance Criteria:**
- [ ] Agent profile includes "Agent Engine Enabled" checkbox
- [ ] Content is only queued for agents with this enabled
- [ ] Agent Engine pricing tier is tracked separately from FramePostReady tier

---

### Story 18.5 — Content Repurposing Suggestions

**ID:** FPR-1805
**Priority:** P3
**Points:** 3
**Phase:** 3
**Component:** AI

**As a** user,
**I want** the system to suggest ways to repurpose listing content for other platforms or formats,
**So that** I can maximize the value of each content package.

**Acceptance Criteria:**
- [ ] After generation, system suggests: "Turn this Instagram caption into a Pinterest pin description," "Adapt this Reel script for a YouTube Short," "Use this email copy as a blog post intro"
- [ ] Suggestions are clickable and trigger generation of the adapted content

---

## Epic 19 — Batch Processing & Scale

**Epic Description:** Enable processing multiple listings at once and support higher volume usage.

**Business Value:** As FramePostReady grows beyond Colby's internal use, team leads and brokerages will need to process 10–50 listings at a time.

**Epic Owner:** Colby
**Phase:** 3 (Scale)
**Total Story Points:** 16

---

### Story 19.1 — Multi-URL Input

**ID:** FPR-1901
**Priority:** P2
**Points:** 3
**Phase:** 3
**Component:** Frontend, Automation

**As a** user,
**I want** to paste multiple Zillow URLs at once,
**So that** I can batch-process several listings without submitting them one at a time.

**Acceptance Criteria:**
- [ ] Input accepts a multi-line text area with one URL per line
- [ ] System validates all URLs before processing
- [ ] Each URL is processed independently (one failure doesn't block others)
- [ ] Progress indicator shows: X of Y listings processed
- [ ] Maximum batch size: 15 URLs

---

### Story 19.2 — CSV Listing Upload

**ID:** FPR-1902
**Priority:** P2
**Points:** 5
**Phase:** 3
**Component:** Frontend, Backend

**As a** user,
**I want** to upload a CSV file with listing data for batch processing,
**So that** I can import listings from my CRM or MLS export without manual entry.

**Acceptance Criteria:**
- [ ] System accepts a CSV with columns matching the Listings table schema
- [ ] System provides a downloadable CSV template with correct headers
- [ ] System validates the CSV on upload: required fields present, data types correct, no duplicate addresses
- [ ] Preview screen shows parsed data before processing
- [ ] Each row creates a Listing record and triggers content generation

---

### Story 19.3 — Batch Content Generation Queue

**ID:** FPR-1903
**Priority:** P2
**Points:** 5
**Phase:** 3
**Component:** Automation, Backend

**As a** system processing multiple listings,
**I need** a queue that manages batch content generation without overwhelming the API,
**So that** rate limits are respected and all listings are processed reliably.

**Acceptance Criteria:**
- [ ] Batch listings are queued and processed sequentially (or with controlled concurrency of 3 max)
- [ ] Queue respects Anthropic API rate limits
- [ ] Each listing's status is independently tracked
- [ ] Estimated completion time is displayed to the user
- [ ] Failed listings are retried once, then flagged for manual review

---

### Story 19.4 — Non-Zillow Source Support

**ID:** FPR-1904
**Priority:** P3
**Points:** 3
**Phase:** 4
**Component:** Backend, Automation

**As a** user,
**I want** to input listings from Realtor.com, Redfin, or direct MLS feeds,
**So that** I'm not limited to Zillow as a data source.

**Acceptance Criteria:**
- [ ] System detects the URL source (Zillow, Realtor.com, Redfin) and routes to the appropriate scraper
- [ ] Output data is normalized to the same Listings table schema regardless of source
- [ ] At least one non-Zillow source is supported in addition to manual entry

---

## Epic 20 — Testing & QA

**Epic Description:** Validate the system end-to-end across multiple property types, ensure content quality meets benchmarks, and establish ongoing QA processes.

**Business Value:** Quality is the product. If content requires heavy manual editing, FramePostReady costs more time than it saves. Testing prevents that.

**Epic Owner:** Colby
**Phase:** 1 (MVP)
**Total Story Points:** 16

---

### Story 20.1 — 5-Listing Validation Test

**ID:** FPR-2001
**Priority:** P0
**Points:** 5
**Phase:** 1
**Component:** Testing

**As a** product owner,
**I need** to test the full pipeline with 5 real SWFL listings across different property types,
**So that** I can validate content quality, factual accuracy, and system reliability before any client delivery.

**Acceptance Criteria:**
- [ ] Test listings cover: single family Gulf access pool home (Cape Coral, $400K–$600K), condo in gated community (Naples, $250K–$400K), new construction (Fort Myers, $350K–$500K), vacant land canal lot (Cape Coral, $100K–$200K), luxury waterfront (Naples, $1M+)
- [ ] Each listing is processed end-to-end: URL input → scrape → enrich → generate → review
- [ ] All 6 content types are generated and scored per the evaluation criteria (Section 11.2 of Implementation Guide)
- [ ] Average quality score across all tests must be 4.0+ before launch
- [ ] All issues are documented with specific prompt iteration notes

---

### Story 20.2 — Prompt Iteration Cycle

**ID:** FPR-2002
**Priority:** P0
**Points:** 5
**Phase:** 1
**Component:** AI, Testing

**As a** product owner,
**I need** a structured process for iterating on prompts based on test results,
**So that** content quality improves systematically with each round of testing.

**Acceptance Criteria:**
- [ ] Process follows: run test → score output → identify weak spots → edit prompt → increment version → rerun same test → compare scores → repeat until target met
- [ ] At least 3 iteration cycles are completed per content type before launch
- [ ] Prompt changes are documented in the Prompt Templates table (version history, notes)
- [ ] Final prompt versions are marked "Active" for production use

---

### Story 20.3 — Edge Case Testing

**ID:** FPR-2003
**Priority:** P1
**Points:** 3
**Phase:** 1
**Component:** Testing

**As a** product owner,
**I need** to test edge cases that might break the system or produce poor content,
**So that** I can handle them gracefully before clients encounter them.

**Acceptance Criteria:**
- [ ] Test cases include: listing with minimal features (vacant land — no beds, baths, pool, etc.), listing with very long description (2,000+ characters), listing with no photos, listing in a city outside the primary SWFL area, listing with special characters in the address, duplicate listing submission, Zillow URL that is no longer active
- [ ] Each edge case is documented with the expected behavior and actual result
- [ ] System handles all edge cases without crashing or producing nonsensical content

---

### Story 20.4 — Client Pilot Test

**ID:** FPR-2004
**Priority:** P0
**Points:** 3
**Phase:** 1
**Component:** Testing

**As a** product owner,
**I need** to generate content for 3 real Frame & Form client listings and collect feedback,
**So that** I have real-world validation before scaling to more clients.

**Acceptance Criteria:**
- [ ] 3 client listings are processed through the full pipeline
- [ ] Content is delivered to clients using the standard delivery workflow (PDF + Google Drive)
- [ ] Feedback is collected: overall satisfaction (1–5), specific content they used/didn't use, suggestions for improvement
- [ ] At least 2 of 3 clients rate the content 4+ out of 5
- [ ] Feedback is incorporated into prompt iterations before wider launch

---

## Backlog Priority Matrix

### P0 — Must Have (MVP Blockers)

| Story ID | Story Name | Points |
|---|---|---|
| FPR-101 | Zillow URL Input & Validation | 2 |
| FPR-102 | Zillow Data Scraping via Apify | 5 |
| FPR-104 | SWFL Keyword Enrichment | 3 |
| FPR-107 | Scraper Failure Handling & Alerts | 3 |
| FPR-108 | Listing Data Storage | 3 |
| FPR-201 | Prompt Template Storage & Retrieval | 3 |
| FPR-202 | Variable Merging into Prompt Templates | 3 |
| FPR-203 | Claude API Integration | 5 |
| FPR-204 | Response Parsing & Variant Splitting | 3 |
| FPR-205 | Content Storage | 3 |
| FPR-206 | Single Content Block Regeneration | 3 |
| FPR-301 | Instagram Caption Generation (3 Variants) | 5 |
| FPR-401 | Facebook Caption Generation (2 Variants) | 5 |
| FPR-501 | MLS Description Rewrite (2 Versions) | 5 |
| FPR-503 | MLS Compliance Scanning | 5 |
| FPR-601 | "Just Listed" Email Generation | 5 |
| FPR-602 | "Open House" Email Generation | 3 |
| FPR-701 | Reel Script Generation (2 Styles) | 5 |
| FPR-801 | Hashtag Set Generation (30 Tags) | 5 |
| FPR-802 | First Comment Hashtag Set (15 Tags) | 2 |
| FPR-1101 | Agent Profile Creation | 3 |
| FPR-1301 | MLS Blocked Terms List Management | 3 |
| FPR-1302 | Automated MLS Compliance Scan | 5 |
| FPR-1303 | Factual Accuracy Verification Checklist | 3 |
| FPR-1501 | Scenario 1: Listing Intake Pipeline | 8 |
| FPR-1502 | Scenario 2: Content Generation Pipeline | 8 |
| FPR-1601 | Airtable Base Setup | 5 |
| FPR-1604 | Prompt Template Seed Data | 2 |
| FPR-2001 | 5-Listing Validation Test | 5 |
| FPR-2002 | Prompt Iteration Cycle | 5 |
| FPR-2004 | Client Pilot Test | 3 |
| **TOTAL** | | **133** |

### P1 — Should Have

| Story ID | Story Name | Points |
|---|---|---|
| FPR-103 | Manual Listing Entry Form | 5 |
| FPR-105 | Listing Deduplication Check | 2 |
| FPR-106 | Supplemental Context Input | 3 |
| FPR-110 | Listing Status Lifecycle Management | 2 |
| FPR-207 | Full Listing Content Regeneration | 3 |
| FPR-208 | Generation Cost Tracking | 2 |
| FPR-209 | Generation Status Notifications | 2 |
| FPR-302 | Instagram Tone Customization | 3 |
| FPR-303 | Instagram Hook Quality Validation | 3 |
| FPR-402 | Facebook Algorithm Optimization | 3 |
| FPR-404 | Facebook Caption with Event Details | 2 |
| FPR-502 | MLS Character Limit Configuration | 2 |
| FPR-506 | MLS Description for New Listings | 3 |
| FPR-603 | "Price Reduction" Email Generation | 3 |
| FPR-604 | "Back on Market" Email Generation | 2 |
| FPR-702 | Reel Script Hook Validation | 2 |
| FPR-703 | Reel Script Timing Validation | 2 |
| FPR-803 | Categorized Hashtag Breakdown Display | 2 |
| FPR-804 | Shadowban Hashtag Filtering | 3 |
| FPR-1203 | MLS Character Limit Settings | 1 |
| FPR-1304 | Shadowban Hashtag List Management | 2 |
| FPR-1401 | Usage Dashboard (Airtable) | 3 |
| FPR-1504 | Webhook Security | 3 |
| FPR-1602 | Airtable Dashboard Views | 3 |
| FPR-2003 | Edge Case Testing | 3 |
| **TOTAL** | | **64** |

### P2 — Nice to Have

| Story ID | Story Name | Points |
|---|---|---|
| FPR-109 | Listing Photo Handling | 5 |
| FPR-210 | Prompt Template Performance Tracking | 3 |
| FPR-211 | Temperature & Parameter Tuning per Content Type | 2 |
| FPR-304 | Instagram Caption Character Count Display | 1 |
| FPR-305 | Instagram Location Tag Suggestion | 2 |
| FPR-306 | Instagram Caption Preview Mock | 5 |
| FPR-403 | Facebook Group-Specific Version | 3 |
| FPR-504 | MLS Keyword Density Check | 3 |
| FPR-505 | MLS Description Comparison View | 2 |
| FPR-605 | "Under Contract / Just Sold" Email Generation | 2 |
| FPR-606 | Email HTML Output | 5 |
| FPR-607 | Subject Line A/B Test Suggestions | 3 |
| FPR-608 | Email Copy Personalization Tokens | 2 |
| FPR-704 | Reel Script Text Overlay Export | 3 |
| FPR-705 | 15-Second Teaser Script | 3 |
| FPR-805 | Custom Seed Hashtags | 2 |
| FPR-1001 | Branded PDF Generation | 8 |
| FPR-1002 | Google Drive Auto-Delivery | 5 |
| FPR-1003 | Email Delivery Notification | 3 |
| FPR-1004 | Individual Content Block Export | 3 |
| FPR-1005 | Delivery Log & Tracking | 3 |
| FPR-1006 | Watermark / Attribution Toggle | 2 |
| FPR-1102 | Agent Profile Editing | 2 |
| FPR-1103 | Agent Listing History | 3 |
| FPR-1104 | Agent Tier & Billing Tracking | 3 |
| FPR-1201 | Default Agent Profile Settings | 2 |
| FPR-1202 | Default Tone & Target Buyer Settings | 1 |
| FPR-1204 | PDF Brand Settings | 3 |
| FPR-1205 | Custom Hashtag Seeds Settings | 2 |
| FPR-1206 | Notification Preferences | 2 |
| FPR-1207 | API Key Management | 3 |
| FPR-1305 | Content Quality Scoring | 3 |
| FPR-1306 | Banned Word Auto-Replacement | 4 |
| FPR-1402 | Revenue Tracking Dashboard | 3 |
| FPR-1503 | Scenario 3: Export & Delivery Pipeline | 5 |
| FPR-1603 | Airtable Automations (Internal) | 3 |
| FPR-1701 | Landing Page / Login | 3 |
| FPR-1702 | Listing Input Page (Client-Facing) | 5 |
| FPR-1703 | Content Dashboard Page (Client-Facing) | 8 |
| FPR-1704 | Client Settings Page | 3 |
| FPR-1705 | Client Listing History Page | 3 |
| FPR-1706 | Usage & Billing Page | 4 |
| FPR-1901 | Multi-URL Input | 3 |
| FPR-1902 | CSV Listing Upload | 5 |
| FPR-1903 | Batch Content Generation Queue | 5 |
| **TOTAL** | | **143** |

### P3 — Future

| Story ID | Story Name | Points |
|---|---|---|
| FPR-307 | Instagram Carousel Caption Support | 5 |
| FPR-405 | Facebook Marketplace Listing Copy | 5 |
| FPR-706 | Reel Script Shot-to-Photo Mapping | 5 |
| FPR-707 | TikTok-Specific Script Variant | 3 |
| FPR-806 | Hashtag Performance Tracking | 4 |
| FPR-1007 | Bulk Export (Multiple Listings) | 4 |
| FPR-1105 | Multi-Agent Support per Listing | 5 |
| FPR-1403 | Content Variant Usage Analytics | 3 |
| FPR-1404 | Prompt Performance Report | 3 |
| FPR-1405 | Client Satisfaction Report | 3 |
| FPR-1406 | Cost Optimization Alert | 3 |
| FPR-1801 | Content Queue for Agent Engine | 5 |
| FPR-1802 | Multi-Week Campaign Mapping | 8 |
| FPR-1803 | Agent Engine Status Sync | 3 |
| FPR-1804 | Agent Engine Opt-In per Agent | 2 |
| FPR-1805 | Content Repurposing Suggestions | 3 |
| FPR-1904 | Non-Zillow Source Support | 3 |
| **TOTAL** | | **67** |

---

## Sprint Planning Guide

### Recommended Sprint Structure

| Parameter | Value |
|---|---|
| Sprint Length | 1 week |
| Velocity Target (Solo) | 15–20 story points/sprint |
| Work Window | 7:00 AM – 2:00 PM (before server shift) |
| Standup | Daily self-check (5 min, logged in Airtable or Notion) |
| Sprint Review | End of each week — review completed stories, demo outputs |

### Suggested Sprint Sequence (Phase 1 MVP)

**Sprint 1 — Foundation (Points: 17)**
- FPR-1601: Airtable Base Setup (5)
- FPR-1604: Prompt Template Seed Data (2)
- FPR-101: Zillow URL Input & Validation (2)
- FPR-102: Zillow Data Scraping via Apify (5)
- FPR-1301: MLS Blocked Terms List Management (3)

**Sprint 2 — Data Pipeline (Points: 17)**
- FPR-104: SWFL Keyword Enrichment (3)
- FPR-108: Listing Data Storage (3)
- FPR-107: Scraper Failure Handling & Alerts (3)
- FPR-1501: Scenario 1: Listing Intake Pipeline (8)

**Sprint 3 — Content Engine (Points: 17)**
- FPR-201: Prompt Template Storage & Retrieval (3)
- FPR-202: Variable Merging (3)
- FPR-203: Claude API Integration (5)
- FPR-204: Response Parsing & Variant Splitting (3)
- FPR-205: Content Storage (3)

**Sprint 4 — Content Generation (Points: 18)**
- FPR-301: Instagram Caption Generation (5)
- FPR-401: Facebook Caption Generation (5)
- FPR-501: MLS Description Rewrite (5)
- FPR-206: Single Content Block Regeneration (3)

**Sprint 5 — Content Generation Continued (Points: 18)**
- FPR-601: "Just Listed" Email Generation (5)
- FPR-701: Reel Script Generation (5)
- FPR-801: Hashtag Set Generation (5)
- FPR-602: "Open House" Email (3)

**Sprint 6 — Orchestration (Points: 15)**
- FPR-1502: Scenario 2: Content Generation Pipeline (8)
- FPR-802: First Comment Hashtag Set (2)
- FPR-503: MLS Compliance Scanning (5)

**Sprint 7 — QA & Compliance (Points: 16)**
- FPR-1302: Automated MLS Compliance Scan (5)
- FPR-1303: Factual Accuracy Checklist (3)
- FPR-2001: 5-Listing Validation Test (5)
- FPR-1101: Agent Profile Creation (3)

**Sprint 8 — Testing & Launch (Points: 8)**
- FPR-2002: Prompt Iteration Cycle (5)
- FPR-2004: Client Pilot Test (3)

**MVP Total: 8 sprints = ~8 weeks at 1 sprint/week**

---

## Definition of Done

A story is "Done" when ALL of the following are true:

- [ ] All acceptance criteria are met and verified
- [ ] Code/configuration is complete and deployed to production environment
- [ ] Make.com scenario is active (if applicable)
- [ ] Airtable fields/views are configured (if applicable)
- [ ] Error handling is implemented and tested
- [ ] At least 1 real listing has been processed through the feature without errors
- [ ] Feature is documented (what it does, how to use it, where the config lives)
- [ ] No known bugs that impact core functionality

---

## Acceptance Criteria Standards

Every user story's acceptance criteria must follow the INVEST model:

- **I**ndependent — completable without other unfinished stories (where possible)
- **N**egotiable — criteria can be adjusted during sprint with justification
- **V**aluable — delivers clear user or business value
- **E**stimable — can be estimated in story points
- **S**mall — completable within one sprint
- **T**estable — has clear pass/fail conditions

**Criteria format:**
Each criterion is written as a testable checklist item starting with "System," "User," or a clear subject, followed by a specific, observable behavior.

**Good:** "System generates exactly 3 variants: Hook-Driven, Storytelling, Direct CTA"
**Bad:** "System generates good Instagram captions"

---

*FramePostReady Product Backlog — Frame & Form Studio. Maintained by Colby Hollins. Last updated March 12, 2026.*
