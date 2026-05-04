# Product Requirements Document: Listing Content Generator

**Product Name:** FramePostReady — AI-Powered Listing Content Generator by Frame & Form Studio
**Author:** Colby Hollins / Frame & Form Studio
**Version:** 1.0
**Date:** March 12, 2026
**Status:** Draft

---

## 1. Executive Summary

FramePostReady is an internal and client-facing application that ingests active Zillow property listings in the Southwest Florida corridor (Cape Coral, Fort Myers, Naples, Bonita Springs, Lehigh Acres, Estero) and auto-generates a full suite of marketing content per listing. The tool eliminates the repetitive copywriting bottleneck for realtors and media partners by producing platform-ready content in seconds — Instagram captions, Facebook captions, MLS description rewrites, email blast copy, reel scripts, and optimized hashtag sets.

This product serves two purposes:

1. **Service add-on** for Frame & Form Studio's real estate media packages (photography, drone, 3D tours).
2. **Foundation module** for Agent Engine, the planned SaaS platform automating multi-week social campaigns from a single listing.

---

## 2. Problem Statement

Real estate agents in Southwest Florida consistently underperform on listing marketing because:

- They lack the time or skill to write compelling, platform-specific copy for every listing.
- MLS descriptions are often generic, keyword-poor, and fail to differentiate the property.
- Social media captions are an afterthought — posted late, poorly formatted, or skipped entirely.
- Email marketing for new listings is either nonexistent or templated and low-converting.
- Video content (Reels/TikTok) is growing fast in real estate marketing, but agents have no scripting process.

The result: listings sit longer, agents get fewer leads, and media assets (photos, drone, tours) go underutilized.

---

## 3. Target Users

| User Persona | Description | Primary Need |
|---|---|---|
| **Solo Agent** | Individual realtor handling 3–15 active listings | Fast, done-for-you content they can copy-paste and post |
| **Team Lead / Broker** | Manages a team of 5–20 agents | Consistent brand voice across all agent listings |
| **Frame & Form Client** | Agent who hired Frame & Form for media | Bundled content delivery alongside photo/video assets |
| **Colby (Internal)** | Frame & Form Studio operator | Streamlined content production to scale service delivery |

---

## 4. Product Goals & Success Metrics

### Goals

1. Reduce per-listing content creation time from 45–90 minutes to under 5 minutes.
2. Deliver content that is platform-native (not one-size-fits-all paragraphs).
3. Generate SEO/algorithm-friendly copy that increases listing visibility.
4. Create a defensible value-add for Frame & Form Studio's media packages.
5. Build the content engine that feeds directly into Agent Engine's automation pipeline.

### Success Metrics (MVP — First 90 Days)

| Metric | Target |
|---|---|
| Avg. content generation time per listing | < 2 minutes |
| Client adoption rate (offered to clients) | 60%+ opt-in |
| Content quality score (client feedback, 1–5) | 4.0+ avg |
| Listings processed per week | 15+ |
| Revenue contribution (as upsell or bundled add-on) | $500+/month |

---

## 5. Functional Requirements

### 5.1 Listing Data Ingestion

| ID | Requirement | Priority |
|---|---|---|
| F-01 | Accept a Zillow listing URL as primary input | P0 |
| F-02 | Scrape or parse the following fields from the listing: address, price, beds, baths, sqft, lot size, year built, property type, listing description, key features, neighborhood/city, listing photos (URLs), listing agent info | P0 |
| F-03 | Support manual data entry as a fallback (form-based input for off-market or pre-list properties) | P1 |
| F-04 | Accept supplemental context from the user: unique selling points, agent voice/tone preferences, target buyer persona, open house dates, price reduction notes | P1 |
| F-05 | Support batch input (multiple Zillow URLs or CSV upload with listing data) | P2 |
| F-06 | Cache parsed listing data to avoid redundant scraping on regeneration | P1 |

### 5.2 Content Generation Outputs

Each listing generates the following six content types. All outputs must be editable before export.

#### 5.2.1 Instagram Caption

| ID | Requirement | Priority |
|---|---|---|
| G-01 | Generate 3 caption variants per listing (hook-driven, storytelling, direct CTA) | P0 |
| G-02 | Each caption: 150–300 words, emoji-integrated, line-break formatted for readability | P0 |
| G-03 | Include a strong opening hook (first line must stop the scroll) | P0 |
| G-04 | End with a clear CTA (DM, link in bio, call, open house invite) | P0 |
| G-05 | Tone options: luxury, family-friendly, investor-focused, first-time buyer | P1 |
| G-06 | Auto-insert agent handle placeholder and location tags | P1 |

#### 5.2.2 Facebook Caption

| ID | Requirement | Priority |
|---|---|---|
| G-07 | Generate 2 caption variants per listing (community-focused, feature-focused) | P0 |
| G-08 | Each caption: 200–500 words, conversational tone, paragraph-formatted | P0 |
| G-09 | Optimize for Facebook's algorithm: engagement questions, shareability hooks, local community references | P0 |
| G-10 | Include property details inline (not just a link dump) | P0 |
| G-11 | Optional: generate a Facebook Group-specific version (less salesy, more "check this out" tone) | P2 |

#### 5.2.3 MLS Description Rewrite

| ID | Requirement | Priority |
|---|---|---|
| G-12 | Rewrite the original MLS description into a compelling, keyword-rich version | P0 |
| G-13 | Output must comply with MLS character limits (configurable, default 1,000 characters) | P0 |
| G-14 | Prioritize: neighborhood selling points, lifestyle language, property differentiators, proximity callouts (beaches, schools, downtown, I-75, RSW airport) | P0 |
| G-15 | Avoid restricted MLS language (no fair housing violations, no subjective claims like "best" without qualification) | P0 |
| G-16 | Generate a short version (500 char) and a long version (1,000 char) | P1 |
| G-17 | Include relevant SWFL-specific keywords (Gulf access, canal front, lanai, pool home, no HOA, hurricane shutters, etc.) | P0 |

#### 5.2.4 Email Blast Copy

| ID | Requirement | Priority |
|---|---|---|
| G-18 | Generate a complete email template: subject line (3 variants), preview text, body copy, CTA button text | P0 |
| G-19 | Subject lines: under 50 characters, curiosity or urgency driven | P0 |
| G-20 | Body copy: 150–250 words, scannable layout with bold key details, single primary CTA | P0 |
| G-21 | Support two email types: "Just Listed" and "Open House Invite" | P0 |
| G-22 | Support additional types: "Price Reduction," "Back on Market," "Under Contract / Just Sold" | P1 |
| G-23 | Output compatible with common email platforms (Mailchimp, Constant Contact, HoneyBook) — clean HTML or plain text toggle | P1 |

#### 5.2.5 Reel Script

| ID | Requirement | Priority |
|---|---|---|
| G-24 | Generate a 30–60 second video script with timed shot-by-shot breakdown | P0 |
| G-25 | Script format: Shot # / Duration / Visual Direction / Voiceover or Text Overlay / Music Cue | P0 |
| G-26 | Include a hook in the first 3 seconds (pattern interrupt, bold claim, or question) | P0 |
| G-27 | Generate 2 script styles: walkthrough narration and trending/fast-cut style | P0 |
| G-28 | Include suggested text overlay copy for each shot (for agents who won't do voiceover) | P1 |
| G-29 | Include a CTA in the final shot | P0 |
| G-30 | Optional: generate a 15-second "teaser" cut version | P2 |

#### 5.2.6 Hashtags

| ID | Requirement | Priority |
|---|---|---|
| G-31 | Generate a set of 25–30 hashtags per listing | P0 |
| G-32 | Hashtag categories: location-specific (5–8), property-type (5–8), lifestyle/buyer-intent (5–8), trending/broad reach (5–8) | P0 |
| G-33 | Auto-include hyper-local tags: #CapeCoral, #FortMyersFL, #NaplesFL, #SWFLRealEstate, #GulfCoastLiving, etc., based on listing location | P0 |
| G-34 | Exclude banned or shadowbanned Instagram hashtags | P1 |
| G-35 | Output as a copy-paste block and as a comma-separated list | P0 |
| G-36 | Generate a separate "first comment" hashtag set for Instagram strategy | P1 |

### 5.3 Output & Export

| ID | Requirement | Priority |
|---|---|---|
| E-01 | Display all 6 content types on a single listing dashboard view | P0 |
| E-02 | One-click copy to clipboard per content block | P0 |
| E-03 | Export full content package as a branded PDF (Frame & Form Studio branding) | P1 |
| E-04 | Export as a Google Doc (auto-created in a client-specific Google Drive folder) | P1 |
| E-05 | Regenerate any individual content block without affecting others | P0 |
| E-06 | Edit any content block inline before export | P0 |
| E-07 | Save content packages per listing with version history | P2 |

---

## 6. Non-Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| NF-01 | Content generation must complete within 30 seconds for all 6 outputs | P0 |
| NF-02 | System must handle 50+ listings/day without degradation | P1 |
| NF-03 | All AI-generated content must be reviewed/editable before delivery — no auto-publish | P0 |
| NF-04 | Responsive UI — must work on desktop and mobile (tablet optional) | P1 |
| NF-05 | Data privacy: listing data and generated content stored per-user, not shared across accounts | P0 |
| NF-06 | Uptime target: 99.5% during business hours (8 AM – 10 PM ET) | P1 |

---

## 7. Technical Architecture (Proposed)

### 7.1 Stack Overview

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | React (Next.js) or Wix Velo | Aligns with existing Wix ecosystem; Next.js if standalone |
| **Backend / Orchestration** | Make.com (MVP) → Node.js API (V2) | Make.com for rapid prototyping; migrate to custom backend at scale |
| **AI Content Engine** | Anthropic Claude API (claude-sonnet-4-6) | Best balance of quality, speed, and cost for structured content generation |
| **Data Scraping** | Apify (Zillow scraper actor) or BrightData | Reliable Zillow data extraction without direct scraping risk |
| **Database** | Airtable (MVP) → PostgreSQL (V2) | Airtable for fast iteration; Postgres for Agent Engine integration |
| **File Storage** | Google Drive API | Integrates with existing client delivery workflow |
| **Email Export** | HoneyBook API / Mailchimp API | Matches existing Frame & Form tooling |

### 7.2 Data Flow

```
[Zillow URL Input]
       |
       v
[Scraper Module] ──► Parse listing data into structured JSON
       |
       v
[Enrichment Layer] ──► Add neighborhood data, SWFL keywords, agent context
       |
       v
[AI Content Engine] ──► 6 parallel prompts (one per content type)
       |
       v
[Output Dashboard] ──► Review, edit, copy, export
       |
       v
[Export Module] ──► PDF / Google Drive / Clipboard / Email Platform
```

### 7.3 AI Prompt Architecture

Each content type uses a dedicated system prompt template. Prompt variables include:

- `{address}`, `{price}`, `{beds}`, `{baths}`, `{sqft}`, `{lot_size}`
- `{property_type}`, `{year_built}`, `{key_features}`
- `{neighborhood}`, `{city}`, `{county}`
- `{original_description}`, `{unique_selling_points}`
- `{agent_name}`, `{agent_handle}`, `{brokerage}`
- `{tone}`, `{target_buyer}`, `{listing_status}`
- `{open_house_date}`, `{price_change_amount}`

Prompts are stored as versioned templates in the database, not hardcoded — enabling iteration without redeployment.

---

## 8. User Interface (Key Screens)

### Screen 1: Listing Input

- URL input field (primary)
- Manual entry form (expandable)
- Supplemental context fields (tone, target buyer, agent info, special notes)
- "Generate Content" button

### Screen 2: Content Dashboard

- Tabbed or card-based layout showing all 6 content types
- Each card shows: content preview, variant selector (if multiple), copy button, regenerate button, inline edit toggle
- Top bar: listing summary (address, price, photo thumbnail)
- Export bar: "Copy All," "Export PDF," "Send to Google Drive"

### Screen 3: Settings / Defaults

- Default agent info (name, handle, brokerage, phone)
- Default tone preference
- Default hashtag seed list
- MLS character limit configuration
- Branding settings (logo, colors for PDF export)

---

## 9. Pricing Model (As a Frame & Form Service Add-On)

| Tier | Description | Price |
|---|---|---|
| **Bundled** | Included with any Frame & Form media package ($250+) | $0 (value-add) |
| **Standalone — Single Listing** | Content package for one listing, no media booking | $49 |
| **Standalone — Monthly (5 listings)** | Up to 5 listings/month | $149/month |
| **Standalone — Monthly (15 listings)** | Up to 15 listings/month | $349/month |
| **Agent Engine Integration** | Auto-posts generated content on a scheduled campaign | TBD (V2 pricing) |

---

## 10. Roadmap

### Phase 1 — MVP (Weeks 1–4)

- Single Zillow URL input
- All 6 content outputs (single variant each)
- Copy-to-clipboard export
- Make.com orchestration + Airtable storage
- Manual trigger (no automation)
- Internal use only (Colby generates for clients)

### Phase 2 — Client-Facing (Weeks 5–8)

- Multi-variant generation (2–3 options per content type)
- Inline editing
- PDF export with Frame & Form branding
- Google Drive auto-delivery
- Client-facing UI (Wix-hosted or standalone)
- Tone/persona selection

### Phase 3 — Scale & Integrate (Weeks 9–16)

- Batch listing input (CSV or multi-URL)
- Email platform integration (Mailchimp / HoneyBook)
- Agent Engine pipeline: content flows into scheduled posting automation
- Analytics: track which content variants get used most
- Template library: save and reuse high-performing prompts

### Phase 4 — Expansion (Months 5–6+)

- Support for non-Zillow sources (Realtor.com, Redfin, direct MLS feed)
- Multi-market expansion beyond SWFL
- White-label option for brokerages
- AI-generated image captions (pair specific photos with specific copy)
- A/B testing framework for subject lines and hooks

---

## 11. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Zillow blocks scraping or changes page structure | Content pipeline breaks | Use a third-party scraper service (Apify) with fallback to manual entry; monitor for structure changes weekly |
| AI hallucination (incorrect property details in copy) | Client trust damage, legal risk | Always pull property facts from scraped data — never let the AI invent specs; human review step before delivery |
| MLS compliance violations in generated descriptions | Listing rejection, fair housing issues | Build a compliance filter into the MLS prompt; maintain a blocklist of restricted terms; flag output for review |
| Low adoption by agents ("I'll just write it myself") | Revenue miss | Demonstrate time savings with a side-by-side demo; offer the first listing free; bundle with media packages |
| API cost overruns at scale | Margin compression | Use claude-sonnet-4-6 (not Opus) for generation; cache results; batch prompts where possible; monitor cost per listing |

---

## 12. Open Questions

1. **Direct MLS feed vs. Zillow scraping?** — A direct MLS IDX feed would be more reliable and compliant, but requires broker cooperation or a data provider (Spark API, Bridge Interactive). Worth exploring for Phase 3+.
2. **Should the agent be able to connect their own social accounts for direct posting from V1?** — Likely no for MVP (keep it simple), but this is the core Agent Engine value prop for V2.
3. **Pricing validation needed.** — The standalone pricing above is hypothetical. Need to test willingness-to-pay with 5–10 agents before locking in.
4. **Content rights.** — Clarify in TOS: who owns the generated content? (Recommendation: the client owns it upon delivery, Frame & Form retains the right to use anonymized outputs for training/portfolio.)

---

## 13. Approval & Next Steps

- [ ] Colby: Review and finalize PRD
- [ ] Validate pricing assumptions with 3–5 target agents
- [ ] Build prompt templates for all 6 content types (test with 5 real listings)
- [ ] Set up Make.com scenario: Zillow URL → Scraper → Claude API → Airtable
- [ ] Design UI wireframe for Content Dashboard
- [ ] Target MVP launch: 4 weeks from approval

---

*Document maintained by Frame & Form Studio. Last updated March 12, 2026.*
