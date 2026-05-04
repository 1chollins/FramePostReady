# FramePostReady — Detailed Implementation Guide

**Product:** FramePostReady — AI-Powered Listing Content Generator by Frame & Form Studio
**Author:** Colby Hollins
**Version:** 1.0
**Date:** March 12, 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Airtable Database Schema](#3-airtable-database-schema)
4. [Zillow Data Scraping Specification](#4-zillow-data-scraping-specification)
5. [AI Prompt Templates (All 6 Content Types)](#5-ai-prompt-templates)
6. [Make.com Scenario Blueprints](#6-makecom-scenario-blueprints)
7. [UI/UX Wireframe Specifications](#7-uiux-wireframe-specifications)
8. [Export & Delivery System](#8-export--delivery-system)
9. [Pricing & Packaging Logic](#9-pricing--packaging-logic)
10. [Compliance & Quality Control](#10-compliance--quality-control)
11. [Testing Plan](#11-testing-plan)
12. [Launch Checklist](#12-launch-checklist)
13. [Maintenance & Iteration SOP](#13-maintenance--iteration-sop)

---

## 1. Project Overview

### 1.1 What FramePostReady Does

FramePostReady takes a single Zillow listing URL (or manual listing data) and generates six platform-specific marketing content outputs:

1. **Instagram Captions** — 3 variants (hook-driven, storytelling, direct CTA)
2. **Facebook Captions** — 2 variants (community-focused, feature-focused)
3. **MLS Description Rewrite** — short (500 char) and long (1,000 char) versions
4. **Email Blast Copy** — subject lines, preview text, body, CTA for "Just Listed" and "Open House" types
5. **Reel Script** — 30–60 second timed shot-by-shot script in 2 styles (walkthrough, fast-cut)
6. **Hashtags** — 25–30 tags organized by category with a separate "first comment" set

### 1.2 Service Model

| Delivery Mode | Description |
|---|---|
| **Internal Generation** | Colby generates content for Frame & Form clients as part of media package delivery |
| **Client Self-Serve (Phase 2)** | Agents log in, paste a URL, receive content |
| **Agent Engine Feed (Phase 3)** | Content auto-flows into scheduled social posting campaigns |

### 1.3 Market Context — Southwest Florida

**Primary Service Area:**
- Cape Coral
- Fort Myers
- Naples
- Bonita Springs
- Estero
- Lehigh Acres
- Sanibel / Fort Myers Beach (recovery market)

**Regional Selling Points to Leverage in Content:**
- Gulf access / canal-front properties
- No state income tax
- Year-round outdoor lifestyle
- Snowbird / seasonal buyer market
- Post-Hurricane Ian rebuild and new construction
- Proximity to RSW Airport
- Growing population and job market
- Resort-style amenities (pools, lanais, golf)

**Common SWFL Property Keywords:**
Gulf access, canal front, direct access, sailboat access, pool home, lanai, screened cage, hurricane shutters, impact windows, no HOA, deed restricted, waterfront, preserve view, lake view, golf community, gated community, new construction, CBS construction, tile roof, metal roof, split floor plan, great room, chef's kitchen, outdoor kitchen, boat dock, boat lift, seawall, RV parking, circular driveway, mother-in-law suite, income property, short-term rental eligible, STR approved, flood zone X, elevation certificate

---

## 2. System Architecture

### 2.1 Technology Stack

| Component | Tool | Role |
|---|---|---|
| **Listing Scraper** | Apify — Zillow Scraper Actor | Extracts structured listing data from Zillow URLs |
| **Orchestration Engine** | Make.com | Routes data between scraper, AI, database, and exports |
| **AI Content Engine** | Anthropic Claude API (claude-sonnet-4-6) | Generates all 6 content outputs |
| **Database** | Airtable | Stores listings, generated content, client records, prompt templates |
| **Frontend (MVP)** | Wix Velo (embedded on Frame & Form site) | Client-facing input form and content dashboard |
| **Frontend (V2)** | Next.js standalone app | Scalable, standalone SaaS interface |
| **File Storage** | Google Drive API | Stores exported PDFs and content packages per client |
| **PDF Generator** | Make.com PDF module or Documint | Creates branded PDF exports |
| **Email Platform** | HoneyBook / Mailchimp | Receives formatted email blast copy for sending |

### 2.2 End-to-End Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                     USER INPUT LAYER                         │
│                                                              │
│   [Zillow URL]  OR  [Manual Entry Form]                      │
│   + Agent Info (name, handle, brokerage)                     │
│   + Preferences (tone, target buyer, special notes)          │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│                   MAKE.COM SCENARIO 1                         │
│                   "Listing Intake"                            │
│                                                              │
│   1. Receive webhook trigger (URL + agent context)           │
│   2. Send URL to Apify Zillow Scraper Actor                  │
│   3. Receive structured JSON (address, price, beds,          │
│      baths, sqft, features, description, photos)             │
│   4. Enrich with SWFL keyword matching                       │
│   5. Write raw listing data to Airtable [Listings] table     │
│   6. Trigger Scenario 2                                      │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│                   MAKE.COM SCENARIO 2                         │
│                   "Content Generation"                        │
│                                                              │
│   1. Pull listing data from Airtable                         │
│   2. Pull prompt templates from Airtable [Prompts] table     │
│   3. Merge listing variables into each prompt template        │
│   4. Send 6 parallel API calls to Claude (sonnet-4-6)        │
│      ├── Instagram Caption prompt                            │
│      ├── Facebook Caption prompt                             │
│      ├── MLS Description prompt                              │
│      ├── Email Blast prompt                                  │
│      ├── Reel Script prompt                                  │
│      └── Hashtag prompt                                      │
│   5. Parse responses                                         │
│   6. Write generated content to Airtable [Content] table     │
│   7. Update listing status to "Content Ready"                │
│   8. Trigger notification (email or Slack to Colby)          │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│                   MAKE.COM SCENARIO 3                         │
│                   "Export & Delivery"                         │
│                                                              │
│   1. Pull content from Airtable [Content] table              │
│   2. Generate branded PDF (Documint or Make PDF module)      │
│   3. Upload PDF to Google Drive (client folder)              │
│   4. Send delivery email via HoneyBook or Gmail              │
│   5. Update Airtable status to "Delivered"                   │
│   6. (Phase 3) Push content to Agent Engine queue            │
└──────────────────────────────────────────────────────────────┘
```

### 2.3 API Configuration

**Anthropic Claude API Settings:**

| Parameter | Value |
|---|---|
| Model | claude-sonnet-4-6 |
| Max Tokens | 2,000 per content type (12,000 total per listing) |
| Temperature | 0.7 (creative but controlled) |
| Top P | 0.9 |
| Stop Sequences | None |

**Estimated API Cost Per Listing:**

| Content Type | Est. Input Tokens | Est. Output Tokens | Est. Cost |
|---|---|---|---|
| Instagram Captions (3 variants) | ~800 | ~1,200 | ~$0.006 |
| Facebook Captions (2 variants) | ~800 | ~1,000 | ~$0.005 |
| MLS Description (2 versions) | ~700 | ~600 | ~$0.003 |
| Email Blast Copy | ~800 | ~800 | ~$0.004 |
| Reel Script (2 styles) | ~900 | ~1,200 | ~$0.006 |
| Hashtags | ~500 | ~400 | ~$0.002 |
| **Total per listing** | **~4,500** | **~5,200** | **~$0.026** |

At 15 listings/week = ~$0.39/week, ~$1.56/month in API costs. Margin is extremely healthy at any price point above $10/listing.

---

## 3. Airtable Database Schema

### 3.1 Table: Listings

| Field Name | Field Type | Description |
|---|---|---|
| Listing ID | Auto Number | Primary key |
| Zillow URL | URL | Source listing URL |
| Address | Single Line Text | Full property address |
| City | Single Line Text | City name |
| County | Single Line Text | Lee, Collier, Charlotte |
| Zip Code | Single Line Text | 5-digit zip |
| Price | Currency | Listing price |
| Beds | Number | Bedroom count |
| Baths | Number | Bathroom count (supports .5) |
| Sqft | Number | Living square footage |
| Lot Size | Single Line Text | Lot size (acres or sqft) |
| Year Built | Number | Year of construction |
| Property Type | Single Select | Single Family, Condo, Townhome, Villa, Multi-Family, Vacant Land |
| Original MLS Description | Long Text | Raw MLS description from Zillow |
| Key Features | Long Text | Parsed feature list (JSON array) |
| Photo URLs | Long Text | JSON array of listing photo URLs |
| Neighborhood | Single Line Text | Subdivision or neighborhood name |
| SWFL Keywords Matched | Multiple Select | Auto-tagged keywords from the regional keyword list |
| Listing Status | Single Select | Active, Pending, Sold, Price Reduced, Back on Market |
| Content Status | Single Select | Queued, Generating, Content Ready, Delivered, Archived |
| Agent (Link) | Link to Agents table | Associated agent record |
| Content (Link) | Link to Content table | Generated content records |
| Created Date | Created Time | Auto-populated |
| Last Modified | Last Modified Time | Auto-populated |

### 3.2 Table: Agents

| Field Name | Field Type | Description |
|---|---|---|
| Agent ID | Auto Number | Primary key |
| Agent Name | Single Line Text | Full name |
| Email | Email | Primary email |
| Phone | Phone | Contact phone |
| Instagram Handle | Single Line Text | @handle |
| Facebook Page URL | URL | Business page link |
| Brokerage | Single Line Text | Brokerage name |
| Preferred Tone | Single Select | Luxury, Family-Friendly, Investor-Focused, First-Time Buyer, Neutral |
| Default CTA | Single Line Text | Default call-to-action text |
| Headshot URL | URL | Agent headshot for PDF exports |
| Logo URL | URL | Brokerage or personal logo |
| Google Drive Folder ID | Single Line Text | Client-specific delivery folder |
| Listings (Link) | Link to Listings table | All associated listings |
| Tier | Single Select | Bundled, Single, Monthly-5, Monthly-15 |
| Active | Checkbox | Active client flag |
| Notes | Long Text | Internal notes |

### 3.3 Table: Content

| Field Name | Field Type | Description |
|---|---|---|
| Content ID | Auto Number | Primary key |
| Listing (Link) | Link to Listings table | Associated listing |
| Content Type | Single Select | Instagram, Facebook, MLS, Email, Reel Script, Hashtags |
| Variant Label | Single Line Text | e.g., "Hook-Driven," "Storytelling," "Direct CTA" |
| Generated Text | Long Text | The actual generated content |
| Version | Number | Version number (for regenerations) |
| Status | Single Select | Draft, Approved, Exported, Archived |
| Prompt Template Used | Single Line Text | Name/ID of the prompt template version |
| Token Count (Input) | Number | Tokens sent to API |
| Token Count (Output) | Number | Tokens received from API |
| API Cost | Currency | Calculated cost for this generation |
| Generated Date | Created Time | Auto-populated |
| Edited | Checkbox | Was this content manually edited? |
| Edit Notes | Long Text | What was changed and why (for prompt improvement tracking) |

### 3.4 Table: Prompt Templates

| Field Name | Field Type | Description |
|---|---|---|
| Template ID | Auto Number | Primary key |
| Template Name | Single Line Text | e.g., "Instagram — Hook-Driven v3" |
| Content Type | Single Select | Instagram, Facebook, MLS, Email, Reel Script, Hashtags |
| Variant | Single Line Text | Which variant this template produces |
| System Prompt | Long Text | Full system prompt text |
| User Prompt Template | Long Text | User prompt with {variable} placeholders |
| Version | Number | Template version |
| Active | Checkbox | Is this the currently active version? |
| Performance Score | Number (1–5) | Manual quality rating based on output review |
| Notes | Long Text | Iteration notes, what changed from prior version |
| Last Updated | Last Modified Time | Auto-populated |

### 3.5 Table: Delivery Log

| Field Name | Field Type | Description |
|---|---|---|
| Delivery ID | Auto Number | Primary key |
| Listing (Link) | Link to Listings table | Associated listing |
| Agent (Link) | Link to Agents table | Receiving agent |
| Delivery Method | Single Select | PDF Email, Google Drive, Manual Handoff, Agent Engine |
| PDF URL | URL | Link to generated PDF in Google Drive |
| Delivery Date | Date | When content was delivered |
| Opened | Checkbox | Did the client open/access it? |
| Feedback | Long Text | Client feedback on the content |
| Rating | Rating (1–5) | Client satisfaction score |

---

## 4. Zillow Data Scraping Specification

### 4.1 Apify Actor Configuration

**Actor:** Zillow Scraper (community or custom actor on Apify)

**Input Schema:**

```json
{
  "urls": [
    "https://www.zillow.com/homedetails/1234-Example-St-Cape-Coral-FL-33914/12345678_zpid/"
  ],
  "maxItems": 1,
  "proxy": {
    "useApifyProxy": true,
    "apifyProxyGroups": ["RESIDENTIAL"]
  }
}
```

**Expected Output Fields (Mapped to Airtable):**

```json
{
  "zpid": "12345678",
  "address": {
    "streetAddress": "1234 Example St",
    "city": "Cape Coral",
    "state": "FL",
    "zipcode": "33914"
  },
  "price": 425000,
  "bedrooms": 3,
  "bathrooms": 2,
  "livingArea": 1850,
  "lotSize": "0.25 acres",
  "yearBuilt": 2005,
  "homeType": "SINGLE_FAMILY",
  "description": "Original MLS description text...",
  "listingStatus": "FOR_SALE",
  "daysOnZillow": 12,
  "photos": [
    "https://photos.zillowstatic.com/...",
    "https://photos.zillowstatic.com/..."
  ],
  "facts": [
    "Pool: Yes",
    "Waterfront: Gulf Access Canal",
    "Parking: 2 Car Garage",
    "Cooling: Central AC",
    "Roof: Tile",
    "Construction: CBS"
  ],
  "listingAgent": {
    "name": "Agent Name",
    "phone": "(239) 555-0100"
  },
  "zestimate": 440000,
  "neighborhood": "Cape Coral Unit 64"
}
```

### 4.2 SWFL Keyword Enrichment Logic

After scraping, run the listing data through a keyword matcher. This tags the listing with relevant SWFL-specific selling points for use in content prompts.

**Matching Rules:**

| If listing data contains... | Tag with... |
|---|---|
| "canal" or "waterfront" in facts/description | `Gulf Access`, `Canal Front`, or `Waterfront` (based on specificity) |
| "pool" in facts | `Pool Home` |
| "no HOA" in description or HOA fee = $0 | `No HOA` |
| "boat dock" or "boat lift" or "seawall" in facts | `Boating`, `Dock`, `Seawall` |
| "impact windows" or "hurricane shutters" in facts | `Storm Protection` |
| City = "Cape Coral" and waterfront tag present | `Cape Coral Gulf Access` |
| City = "Naples" | `Naples Luxury` |
| Year built > 2020 | `New Construction` |
| "RV" in facts or description | `RV Parking` |
| "short-term rental" or "STR" or "Airbnb" in description | `STR Eligible` |
| Lot size > 0.5 acres | `Large Lot` |
| "preserve" or "lake view" in description | `Nature View` |

These tags are stored in the `SWFL Keywords Matched` field and passed into content prompts as `{swfl_keywords}`.

### 4.3 Fallback: Manual Entry Form

When scraping fails or the listing is off-market/pre-list, the user fills out a form:

**Required Fields:**
- Address, City, Zip
- Price
- Beds, Baths, Sqft
- Property Type
- Key Features (free text)
- Unique Selling Points (free text)

**Optional Fields:**
- Lot Size, Year Built
- Neighborhood Name
- Original MLS Description
- Photo Upload (up to 5)
- Open House Date
- Price Change Amount

---

## 5. AI Prompt Templates

All prompts follow a consistent structure: System Prompt (defines role, rules, format) + User Prompt (delivers listing data and specific instructions). Variables wrapped in `{curly_braces}` are merged from listing and agent data.

### 5.1 Instagram Caption Prompt

**System Prompt:**

```
You are a top-performing real estate social media copywriter specializing in Southwest Florida luxury and lifestyle properties. You write Instagram captions that stop the scroll, build emotional connection, and drive DMs and inquiries.

RULES:
- Write in a conversational, confident, aspirational tone.
- Every caption must open with a hook on its own line — a bold claim, question, or pattern interrupt that makes someone stop scrolling.
- Use line breaks between every 1-2 sentences for mobile readability.
- Integrate emojis naturally (3-6 per caption, never forced).
- Always include the property's city and state.
- End with a specific CTA (DM, call, link in bio, or open house invite).
- Include the agent's handle where natural.
- NEVER fabricate property details. Only reference facts from the provided listing data.
- NEVER use the words "nestled," "boasts," "stunning," or "dream home" — find fresher language.
- Keep each caption between 150-300 words.

OUTPUT FORMAT:
Return exactly 3 caption variants with the following labels:
VARIANT 1 — HOOK-DRIVEN (leads with a bold, attention-grabbing statement)
VARIANT 2 — STORYTELLING (paints a lifestyle picture, "imagine yourself" angle)
VARIANT 3 — DIRECT CTA (leads with the key selling point and drives action fast)

Separate each variant with "---"
```

**User Prompt:**

```
Generate 3 Instagram caption variants for this listing:

ADDRESS: {address}
CITY: {city}, FL
PRICE: ${price}
BEDS: {beds} | BATHS: {baths} | SQFT: {sqft}
LOT SIZE: {lot_size}
YEAR BUILT: {year_built}
PROPERTY TYPE: {property_type}
KEY FEATURES: {key_features}
SWFL KEYWORDS: {swfl_keywords}
NEIGHBORHOOD: {neighborhood}
UNIQUE SELLING POINTS: {unique_selling_points}

AGENT: {agent_name}
HANDLE: {agent_handle}
BROKERAGE: {brokerage}

TONE: {tone}
TARGET BUYER: {target_buyer}

SPECIAL NOTES: {special_notes}
```

### 5.2 Facebook Caption Prompt

**System Prompt:**

```
You are a real estate marketing specialist who writes high-performing Facebook posts for agents in Southwest Florida. Your posts feel like a knowledgeable friend sharing a great find — not a salesy ad.

RULES:
- Write in a warm, conversational, community-oriented tone.
- Use paragraph formatting (not short Instagram-style line breaks).
- Reference the neighborhood, local landmarks, or lifestyle perks naturally.
- Include key property details inline (don't just list specs).
- Include an engagement hook — a question, a "tag someone," or a "share this" prompt.
- End with a clear CTA including contact info.
- NEVER fabricate property details.
- Avoid overused phrases: "nestled," "boasts," "won't last long," "dream home."
- Each caption should be 200-500 words.

OUTPUT FORMAT:
Return exactly 2 caption variants:
VARIANT 1 — COMMUNITY-FOCUSED (leads with neighborhood/lifestyle, property details woven in)
VARIANT 2 — FEATURE-FOCUSED (leads with the property's standout features, community context secondary)

Separate each variant with "---"
```

**User Prompt:**

```
Generate 2 Facebook caption variants for this listing:

ADDRESS: {address}
CITY: {city}, FL
PRICE: ${price}
BEDS: {beds} | BATHS: {baths} | SQFT: {sqft}
LOT SIZE: {lot_size}
YEAR BUILT: {year_built}
PROPERTY TYPE: {property_type}
KEY FEATURES: {key_features}
SWFL KEYWORDS: {swfl_keywords}
NEIGHBORHOOD: {neighborhood}
ORIGINAL MLS DESCRIPTION: {original_description}
UNIQUE SELLING POINTS: {unique_selling_points}

AGENT: {agent_name}
PHONE: {agent_phone}
BROKERAGE: {brokerage}

TONE: {tone}
TARGET BUYER: {target_buyer}

SPECIAL NOTES: {special_notes}
```

### 5.3 MLS Description Rewrite Prompt

**System Prompt:**

```
You are an MLS listing description specialist for Southwest Florida real estate. You rewrite generic, poorly written MLS descriptions into compelling, keyword-rich, compliant property descriptions that sell.

RULES:
- Rewrite the description completely — do not copy phrases from the original.
- Lead with the property's strongest differentiator.
- Use keywords that SWFL buyers search for (Gulf access, canal front, pool home, no HOA, etc.) — but only if they apply to this property.
- Include proximity callouts where relevant: beaches, downtown, schools, I-75, RSW airport, dining/shopping.
- Use professional, descriptive language without being flowery.
- COMPLIANCE: Do not use subjective superlatives ("best," "most beautiful") without qualification. Do not reference race, religion, familial status, disability, sex, national origin, or any protected class. Do not make promises about investment returns or appreciation.
- BANNED WORDS: nestled, boasts, stunning, dream home, must-see, won't last, motivated seller.

OUTPUT FORMAT:
Return exactly 2 versions:
SHORT VERSION (under 500 characters, including spaces)
LONG VERSION (under 1,000 characters, including spaces)

Label each clearly. Include the exact character count after each version.
```

**User Prompt:**

```
Rewrite this MLS description:

ORIGINAL: {original_description}

PROPERTY DATA:
ADDRESS: {address}
CITY: {city}, FL
PRICE: ${price}
BEDS: {beds} | BATHS: {baths} | SQFT: {sqft}
LOT SIZE: {lot_size}
YEAR BUILT: {year_built}
PROPERTY TYPE: {property_type}
KEY FEATURES: {key_features}
SWFL KEYWORDS: {swfl_keywords}
NEIGHBORHOOD: {neighborhood}
UNIQUE SELLING POINTS: {unique_selling_points}
```

### 5.4 Email Blast Copy Prompt

**System Prompt:**

```
You are a real estate email marketing specialist. You write high-open-rate, high-click-through listing emails for Southwest Florida agents. Your emails are scannable, benefit-driven, and designed to get one click — to the listing page or to contact the agent.

RULES:
- Subject lines: under 50 characters, use curiosity, urgency, or specificity. No ALL CAPS. No excessive punctuation.
- Preview text: 40-90 characters, complements (not repeats) the subject line.
- Body: 150-250 words. Scannable — use bold for key details (price, beds/baths/sqft, address). One primary CTA.
- CTA button text: action-oriented, 2-5 words ("View This Home," "Schedule a Showing," "See Full Details").
- Tone: professional but warm, confident, not pushy.
- NEVER fabricate property details.
- BANNED WORDS: nestled, boasts, stunning, dream home.

OUTPUT FORMAT:
Return content for the requested email type with:
SUBJECT LINE 1: (under 50 chars)
SUBJECT LINE 2: (under 50 chars)
SUBJECT LINE 3: (under 50 chars)
PREVIEW TEXT: (40-90 chars)
BODY: (150-250 words, indicate where bold formatting applies with **bold**)
CTA BUTTON TEXT: (2-5 words)
```

**User Prompt:**

```
Generate a {email_type} email for this listing:

EMAIL TYPE: {email_type} (Just Listed / Open House / Price Reduction / Back on Market / Under Contract)

ADDRESS: {address}
CITY: {city}, FL
PRICE: ${price}
BEDS: {beds} | BATHS: {baths} | SQFT: {sqft}
PROPERTY TYPE: {property_type}
KEY FEATURES: {key_features}
SWFL KEYWORDS: {swfl_keywords}
NEIGHBORHOOD: {neighborhood}
UNIQUE SELLING POINTS: {unique_selling_points}

AGENT: {agent_name}
PHONE: {agent_phone}
EMAIL: {agent_email}
BROKERAGE: {brokerage}

OPEN HOUSE DATE: {open_house_date} (if applicable)
PRICE CHANGE: {price_change_amount} (if applicable)

TONE: {tone}
TARGET BUYER: {target_buyer}
```

### 5.5 Reel Script Prompt

**System Prompt:**

```
You are a real estate video content strategist who writes Reel and TikTok scripts for property tours. Your scripts are designed for 30-60 second vertical video, optimized for watch time and saves.

RULES:
- The first 3 seconds MUST be a hook — a bold statement, surprising fact, provocative question, or visual pattern interrupt. The hook determines whether anyone watches the rest.
- Structure every script as a timed shot list with visual direction.
- Include text overlay copy for every shot (many agents use text overlays instead of voiceover).
- Include a music/vibe cue at the top (genre, energy level — not a specific copyrighted song).
- End every script with a CTA shot.
- Keep total runtime between 30-60 seconds.
- NEVER fabricate property details.

OUTPUT FORMAT:
Return exactly 2 script variants:

VARIANT 1 — WALKTHROUGH NARRATION (smooth, guided tour feel with voiceover)
VARIANT 2 — FAST-CUT TRENDING (quick cuts, text-heavy, trending audio style)

For each variant use this shot format:

SCRIPT TITLE: [Title]
TOTAL RUNTIME: [XX seconds]
MUSIC CUE: [genre/energy description]

| Shot # | Duration | Visual Direction | Voiceover / Text Overlay | Notes |
|--------|----------|-----------------|--------------------------|-------|
| 1      | 3s       | ...             | ...                      | HOOK  |
| 2      | 5s       | ...             | ...                      |       |
| ...    | ...      | ...             | ...                      |       |
| Final  | 4s       | ...             | ...                      | CTA   |

Separate variants with "---"
```

**User Prompt:**

```
Generate 2 Reel scripts for this listing:

ADDRESS: {address}
CITY: {city}, FL
PRICE: ${price}
BEDS: {beds} | BATHS: {baths} | SQFT: {sqft}
PROPERTY TYPE: {property_type}
KEY FEATURES: {key_features}
SWFL KEYWORDS: {swfl_keywords}
NEIGHBORHOOD: {neighborhood}
UNIQUE SELLING POINTS: {unique_selling_points}
LISTING PHOTOS AVAILABLE: {photo_count} photos (for visual direction reference)

AGENT: {agent_name}
HANDLE: {agent_handle}

TONE: {tone}
TARGET BUYER: {target_buyer}
```

### 5.6 Hashtag Prompt

**System Prompt:**

```
You are a real estate social media strategist specializing in Instagram hashtag strategy for Southwest Florida agents. You build hashtag sets that balance reach, discoverability, and relevance.

RULES:
- Generate exactly 30 hashtags total.
- Organize into 4 categories:
  1. LOCATION (7-8 tags): hyper-local city, county, neighborhood, and regional tags
  2. PROPERTY TYPE (7-8 tags): specific to this listing's features and property category
  3. LIFESTYLE / BUYER INTENT (7-8 tags): who the buyer is, what lifestyle they want
  4. BROAD REACH (7-8 tags): high-volume real estate and homebuying tags
- All hashtags lowercase, no spaces within tags.
- Do NOT include any hashtags known to be shadowbanned or restricted on Instagram.
- Always include these SWFL staples when relevant: #capecoral, #fortmyers, #naplesfl, #swfl, #swflrealestate, #gulfcoastliving, #floridahomes, #floridarealestate
- Tailor tags to the specific property — a Gulf access canal home gets different tags than a gated golf community condo.

OUTPUT FORMAT:
MAIN SET (30 hashtags):
[Copy-paste block with all 30 hashtags, each starting with #, separated by spaces]

FIRST COMMENT SET (15 hashtags — broader/supplemental, designed to be posted as a first comment):
[Copy-paste block with 15 hashtags]

CATEGORIZED BREAKDOWN:
LOCATION: #tag1 #tag2 ...
PROPERTY TYPE: #tag1 #tag2 ...
LIFESTYLE: #tag1 #tag2 ...
BROAD REACH: #tag1 #tag2 ...
```

**User Prompt:**

```
Generate hashtags for this listing:

ADDRESS: {address}
CITY: {city}, FL
PRICE: ${price}
PROPERTY TYPE: {property_type}
KEY FEATURES: {key_features}
SWFL KEYWORDS: {swfl_keywords}
NEIGHBORHOOD: {neighborhood}
TARGET BUYER: {target_buyer}
```

---

## 6. Make.com Scenario Blueprints

### 6.1 Scenario 1: Listing Intake

**Trigger:** Webhook (receives Zillow URL + agent ID + preferences from frontend form)

**Module Sequence:**

| Step | Module | Action |
|---|---|---|
| 1 | **Webhook** | Receive POST with `zillow_url`, `agent_id`, `tone`, `target_buyer`, `special_notes`, `email_type` |
| 2 | **HTTP Request** | Send URL to Apify Zillow Scraper Actor run endpoint |
| 3 | **Sleep** | Wait 15–30 seconds for Apify to complete |
| 4 | **HTTP Request** | Retrieve Apify run results (JSON) |
| 5 | **JSON Parse** | Extract structured listing fields |
| 6 | **Tools / Text Parser** | Run SWFL keyword matching logic against description + facts |
| 7 | **Airtable — Create Record** | Write to `Listings` table with all parsed data, linked to Agent record |
| 8 | **Airtable — Update Record** | Set `Content Status` = "Generating" |
| 9 | **HTTP Request (Webhook)** | Trigger Scenario 2 with Listing ID |

**Error Handling:**
- If Apify returns empty/error → set status to "Scrape Failed," send Slack/email alert to Colby, prompt manual entry fallback.

### 6.2 Scenario 2: Content Generation

**Trigger:** Webhook from Scenario 1 (or manual trigger with Listing ID)

**Module Sequence:**

| Step | Module | Action |
|---|---|---|
| 1 | **Airtable — Get Record** | Pull full listing data from `Listings` table |
| 2 | **Airtable — Search Records** | Pull active prompt templates from `Prompt Templates` table (6 templates) |
| 3 | **Iterator** | Loop through each of the 6 content types |
| 4 | **Text Aggregator** | Merge listing variables into prompt template (`{address}` → actual address, etc.) |
| 5 | **HTTP Request** | POST to `https://api.anthropic.com/v1/messages` with merged system prompt + user prompt |
| 6 | **JSON Parse** | Extract `content[0].text` from API response |
| 7 | **Text Parser** | Split response into variants (split on "---" delimiter) |
| 8 | **Airtable — Create Record(s)** | Write each variant to `Content` table, linked to Listing |
| 9 | **Airtable — Update Record** | Set listing `Content Status` = "Content Ready" |
| 10 | **Email / Slack** | Notify Colby: "Content ready for [address]" |

**API Request Body Template (for Make.com HTTP module):**

```json
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 2000,
  "temperature": 0.7,
  "messages": [
    {
      "role": "user",
      "content": "{{merged_user_prompt}}"
    }
  ],
  "system": "{{merged_system_prompt}}"
}
```

**Headers:**

```
Content-Type: application/json
x-api-key: {{anthropic_api_key}}
anthropic-version: 2023-06-01
```

### 6.3 Scenario 3: Export & Delivery

**Trigger:** Manual button click (MVP) or automated on "Content Ready" status change

**Module Sequence:**

| Step | Module | Action |
|---|---|---|
| 1 | **Airtable — Search Records** | Pull all content records for this listing |
| 2 | **Airtable — Get Record** | Pull agent data (name, branding, Drive folder ID) |
| 3 | **Documint / PDF Module** | Generate branded PDF from content data + Frame & Form template |
| 4 | **Google Drive — Upload File** | Upload PDF to agent's client folder |
| 5 | **Gmail / HoneyBook** | Send delivery email with Drive link |
| 6 | **Airtable — Update Record** | Set `Content Status` = "Delivered," log to `Delivery Log` |

---

## 7. UI/UX Wireframe Specifications

### 7.1 Screen 1: Listing Input Page

```
┌─────────────────────────────────────────────────────────────┐
│  FRAMEPOSTREADY                         [Settings] [Logout] │
│  by Frame & Form Studio                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  🔗 Paste Zillow URL                                │    │
│  │  ┌─────────────────────────────────────┐ [Generate] │    │
│  │  │ https://zillow.com/homedetails/...  │            │    │
│  │  └─────────────────────────────────────┘            │    │
│  │                                                     │    │
│  │  ─── OR enter listing details manually ───          │    │
│  │  [Expand Manual Entry Form ▼]                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌── CONTENT PREFERENCES ──────────────────────────────┐    │
│  │                                                     │    │
│  │  Tone:  [Luxury ▼]    Target Buyer: [Relocator ▼]  │    │
│  │                                                     │    │
│  │  Email Type: [Just Listed ▼]                        │    │
│  │                                                     │    │
│  │  Special Notes:                                     │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │ Seller is motivated. Lanai was just          │    │    │
│  │  │ rescreened. New AC unit 2024.                 │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌── SAVED AGENTS ─────────────────────────────────────┐    │
│  │  ● Jane Smith — RE/MAX        ○ Add New Agent       │    │
│  │  ○ Mike Torres — Keller Williams                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│         [ ★ GENERATE ALL CONTENT ]                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Screen 2: Content Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  FRAMEPOSTREADY                         [Settings] [Logout] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📍 1234 Example St, Cape Coral, FL 33914                   │
│  $425,000 | 3 BD | 2 BA | 1,850 sqft | Pool | Gulf Access  │
│  ┌──────┐                                                   │
│  │ 📷   │  Status: ✅ Content Ready                         │
│  └──────┘                                                   │
│                                                             │
│  [Instagram] [Facebook] [MLS] [Email] [Reel] [Hashtags]    │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  ┌── INSTAGRAM CAPTIONS ───────────────────────────────┐    │
│  │                                                     │    │
│  │  Variant: [Hook-Driven ▼] [Storytelling] [Direct]   │    │
│  │                                                     │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │ This Cape Coral canal home just changed      │    │    │
│  │  │ the game. 🌴                                 │    │    │
│  │  │                                              │    │    │
│  │  │ 3 beds. 2 baths. 1,850 sqft of Gulf-access  │    │    │
│  │  │ living — and yes, that pool is heated. 🏊    │    │    │
│  │  │                                              │    │    │
│  │  │ You're 15 minutes from Sanibel by boat...    │    │    │
│  │  │ ...                                          │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  │                                                     │    │
│  │  [📋 Copy] [🔄 Regenerate] [✏️ Edit] [📊 245 words] │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ───────────────────────────────────────────────────────    │
│  [📋 Copy All] [📄 Export PDF] [📁 Send to Drive] [📧 Email]│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7.3 Screen 3: Settings

```
┌─────────────────────────────────────────────────────────────┐
│  SETTINGS                                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌── DEFAULT AGENT PROFILE ────────────────────────────┐    │
│  │  Name: [Colby Hollins          ]                    │    │
│  │  Handle: [@frameandformstudio  ]                    │    │
│  │  Brokerage: [                  ]                    │    │
│  │  Phone: [(239) 555-0100        ]                    │    │
│  │  Email: [colby@frameandform.com]                    │    │
│  │  Default Tone: [Neutral ▼      ]                    │    │
│  │  Default CTA: [DM for details  ]                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌── MLS SETTINGS ─────────────────────────────────────┐    │
│  │  Short Version Limit: [500  ] characters            │    │
│  │  Long Version Limit:  [1000 ] characters            │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌── BRAND SETTINGS (PDF Export) ──────────────────────┐    │
│  │  Logo: [Upload ▲] frame_and_form_logo.png           │    │
│  │  Primary Color: [#2C3E50]                           │    │
│  │  Accent Color:  [#E67E22]                           │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌── CUSTOM HASHTAG SEEDS ─────────────────────────────┐    │
│  │  Always include: #frameandformstudio #swflhomes     │    │
│  │  [Add tag +]                                        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  [Save Settings]                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Export & Delivery System

### 8.1 PDF Export Specification

**Template Layout:**

```
Page 1 — Cover
  - Frame & Form Studio logo (top left)
  - Agent headshot + logo (top right)
  - Property hero photo (center)
  - Address, Price, Bed/Bath/Sqft
  - "Content Package — Prepared by Frame & Form Studio"
  - Date generated

Page 2 — Instagram Captions
  - All 3 variants, clearly labeled
  - Hashtag set included below captions

Page 3 — Facebook Captions
  - Both variants, clearly labeled

Page 4 — MLS Description
  - Short version with character count
  - Long version with character count

Page 5 — Email Blast Copy
  - Subject line options
  - Preview text
  - Full body copy
  - CTA button text

Page 6 — Reel Script
  - Walkthrough variant (full shot table)
  - Fast-cut variant (full shot table)

Page 7 — Hashtags
  - Main set (copy-paste block)
  - First comment set (copy-paste block)
  - Categorized breakdown
```

### 8.2 Google Drive Delivery Structure

```
Frame & Form Studio (Root)
  └── Client Deliveries
       └── {Agent Name}
            └── {Address} — {Date}
                 ├── FramePostReady_Content_Package.pdf
                 ├── Photos/ (if media was also delivered)
                 └── Raw/ (optional: individual text files per content type)
```

### 8.3 Clipboard Copy Format

Each content block copies with this format:

```
[Content text here]

---
Generated by FramePostReady | Frame & Form Studio
```

The attribution line is optional and can be toggled off in Settings.

---

## 9. Pricing & Packaging Logic

### 9.1 Pricing Tiers

| Tier | Listings/Month | Price | Per-Listing Cost | API Cost/Listing | Margin |
|---|---|---|---|---|---|
| **Bundled** | Included with media package | $0 | $0 (value-add) | ~$0.03 | N/A (retention play) |
| **Single Listing** | 1 | $49 | $49.00 | ~$0.03 | 99.9% |
| **Monthly — 5** | Up to 5 | $149/mo | $29.80 | ~$0.15 | 99.9% |
| **Monthly — 15** | Up to 15 | $349/mo | $23.27 | ~$0.45 | 99.9% |
| **Enterprise (V2)** | Custom | Custom | Negotiated | Varies | Target 85%+ |

### 9.2 Revenue Projections (First 6 Months)

| Month | Bundled Clients | Single Sales | Monthly Subs | Revenue |
|---|---|---|---|---|
| Month 1 | 3 | 2 | 0 | $98 |
| Month 2 | 5 | 3 | 1 | $296 |
| Month 3 | 7 | 4 | 2 | $494 |
| Month 4 | 8 | 5 | 4 | $841 |
| Month 5 | 10 | 5 | 6 | $1,139 |
| Month 6 | 12 | 6 | 8 | $1,486 |

**6-Month Total (Conservative):** ~$4,354
**Annualized Run Rate at Month 6:** ~$17,832/year

This is conservative. The real revenue unlock comes when this feeds into Agent Engine subscriptions.

---

## 10. Compliance & Quality Control

### 10.1 MLS Compliance Filter

Before delivering any MLS description, run it through a compliance check:

**Blocked Terms List:**

| Category | Blocked Terms |
|---|---|
| **Fair Housing Violations** | perfect for families, great school district (as selling point), walking distance to church, family neighborhood, bachelor pad, master bedroom (use "primary" instead), man cave |
| **Unsubstantiated Claims** | best, most beautiful, greatest, #1, top-rated, guaranteed, will appreciate, investment opportunity (without disclosure), below market value |
| **Overused / Low-Quality** | nestled, boasts, stunning, dream home, must-see, won't last long, motivated seller, turnkey, move-in ready (unless substantiated), priced to sell |

**Compliance Check Logic:**
1. Scan generated MLS text against blocked terms list.
2. If a match is found, flag the term and auto-replace or highlight for manual review.
3. Log all flags in Airtable for prompt improvement tracking.

### 10.2 Quality Assurance SOP

**For every listing content package before delivery:**

- [ ] Verify all property facts match the source listing (address, price, bed/bath/sqft, features)
- [ ] Confirm no fabricated details were added by the AI
- [ ] Check MLS description character counts are within limits
- [ ] Scan MLS description for compliance blocklist
- [ ] Read Instagram hook lines — do they actually stop the scroll?
- [ ] Verify agent name, handle, and brokerage are correct
- [ ] Confirm hashtags are relevant to this specific property and location
- [ ] Check reel script timing adds up to 30–60 seconds
- [ ] Verify email subject lines are under 50 characters
- [ ] Review tone consistency across all 6 content types

Estimated QA time per listing: 5–8 minutes.

---

## 11. Testing Plan

### 11.1 MVP Test: 5-Listing Validation

Before launch, generate content for 5 real SWFL listings across different property types:

| Test # | Property Type | City | Price Range | Purpose |
|---|---|---|---|---|
| 1 | Single Family — Gulf Access Pool Home | Cape Coral | $400K–$600K | Core use case |
| 2 | Condo — Gated Community | Naples | $250K–$400K | Different tone/buyer persona |
| 3 | New Construction | Fort Myers | $350K–$500K | Test new construction keywords |
| 4 | Vacant Land — Canal Lot | Cape Coral | $100K–$200K | Minimal features challenge |
| 5 | Luxury Waterfront | Naples | $1M+ | Luxury tone calibration |

### 11.2 Evaluation Criteria Per Test

| Criteria | Score (1–5) | Notes |
|---|---|---|
| Factual accuracy (no hallucinated details) | | |
| Platform appropriateness (IG feels like IG, email feels like email) | | |
| Hook quality (would this stop a scroll / get an open?) | | |
| SWFL keyword integration (natural, not stuffed) | | |
| Tone consistency with selected preference | | |
| CTA clarity and strength | | |
| MLS compliance (no blocked terms, within char limits) | | |
| Reel script shootability (could an agent actually film this?) | | |
| Hashtag relevance and variety | | |
| Overall — would you send this to a client as-is? | | |

**Target:** Average score of 4.0+ across all criteria before launch.

### 11.3 Prompt Iteration Process

1. Run test listing through all 6 prompts.
2. Score each output using the evaluation criteria.
3. Identify weak spots (e.g., "hooks are generic," "MLS description uses blocked words").
4. Edit the relevant prompt template.
5. Increment the template version number in Airtable.
6. Rerun the same test listing.
7. Compare scores.
8. Repeat until target score achieved.
9. Move to next test listing.

---

## 12. Launch Checklist

### Phase 1 — MVP Launch (Internal Use)

**Week 1: Foundation**
- [ ] Set up Airtable base with all 5 tables (Listings, Agents, Content, Prompt Templates, Delivery Log)
- [ ] Create Apify account and configure Zillow Scraper Actor
- [ ] Obtain Anthropic API key and test basic API call
- [ ] Write v1 of all 6 prompt templates and enter into Airtable

**Week 2: Automation**
- [ ] Build Make.com Scenario 1: Listing Intake (webhook → Apify → Airtable)
- [ ] Build Make.com Scenario 2: Content Generation (Airtable → Claude API → Airtable)
- [ ] Test end-to-end flow with 1 real listing
- [ ] Debug and refine error handling

**Week 3: Testing & Refinement**
- [ ] Run 5-listing validation test
- [ ] Score all outputs, iterate prompts to target 4.0+ average
- [ ] Build Make.com Scenario 3: Export & Delivery (Airtable → PDF → Google Drive → Email)
- [ ] Design PDF template in Documint or equivalent

**Week 4: Soft Launch**
- [ ] Generate content for 3 real Frame & Form client listings
- [ ] Deliver and collect feedback
- [ ] Refine based on feedback
- [ ] Document SOP for ongoing use
- [ ] Set up cost tracking dashboard in Airtable

### Phase 2 — Client-Facing (Weeks 5–8)

- [ ] Build Wix frontend: input form + content dashboard
- [ ] Connect frontend to Make.com webhook
- [ ] Add inline editing capability
- [ ] Add multi-variant display and selection
- [ ] Implement tone/persona selection UI
- [ ] User testing with 2–3 agents
- [ ] Launch to first 5 paying clients

### Phase 3 — Scale (Weeks 9–16)

- [ ] Add batch input (CSV upload)
- [ ] Email platform integration
- [ ] Agent Engine pipeline connection
- [ ] Analytics: track content usage and performance
- [ ] Prompt template library with version control UI

---

## 13. Maintenance & Iteration SOP

### 13.1 Weekly Tasks

| Task | Time | Owner |
|---|---|---|
| Review content quality for 3 random listings delivered that week | 20 min | Colby |
| Check Apify scraper health (any failures?) | 5 min | Colby |
| Review API cost dashboard in Airtable | 5 min | Colby |
| Check client feedback in Delivery Log | 10 min | Colby |
| Update prompt templates if quality issues found | 30 min | Colby |

### 13.2 Monthly Tasks

| Task | Time | Owner |
|---|---|---|
| Audit Instagram shadowban list — update blocked hashtags | 30 min | Colby |
| Review MLS compliance blocklist — add any new flagged terms | 15 min | Colby |
| Analyze which content variants get used most (track in Airtable) | 20 min | Colby |
| Update SWFL keyword list based on market trends | 15 min | Colby |
| Prompt template version review — archive underperformers | 30 min | Colby |
| Revenue and margin review | 15 min | Colby |

### 13.3 Quarterly Tasks

| Task | Time | Owner |
|---|---|---|
| Competitive analysis — what are other listing content tools doing? | 1 hr | Colby |
| Client survey — NPS and feature requests | 1 hr | Colby |
| Pricing review — is the current model working? | 30 min | Colby |
| Roadmap review — reprioritize Phase 3/4 features | 1 hr | Colby |
| API model evaluation — is there a better/cheaper model available? | 30 min | Colby |

---

## Appendix A: Variable Reference

Complete list of all template variables used across prompts:

| Variable | Source | Example |
|---|---|---|
| `{address}` | Scraper / Manual | 1234 Example St, Cape Coral, FL 33914 |
| `{city}` | Scraper / Manual | Cape Coral |
| `{county}` | Derived from city | Lee |
| `{zip}` | Scraper / Manual | 33914 |
| `{price}` | Scraper / Manual | 425,000 |
| `{beds}` | Scraper / Manual | 3 |
| `{baths}` | Scraper / Manual | 2 |
| `{sqft}` | Scraper / Manual | 1,850 |
| `{lot_size}` | Scraper / Manual | 0.25 acres |
| `{year_built}` | Scraper / Manual | 2005 |
| `{property_type}` | Scraper / Manual | Single Family |
| `{original_description}` | Scraper / Manual | Raw MLS text |
| `{key_features}` | Scraper / Manual | Pool, Gulf Access Canal, 2-Car Garage, Tile Roof |
| `{swfl_keywords}` | Enrichment Layer | Gulf Access, Pool Home, Cape Coral Gulf Access |
| `{neighborhood}` | Scraper / Manual | Cape Coral Unit 64 |
| `{unique_selling_points}` | Manual Input | New AC 2024, rescreened lanai, seller motivated |
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

## Appendix B: Cost Summary

| Item | Monthly Cost (MVP) | Monthly Cost (Scale — 60 listings/mo) |
|---|---|---|
| Anthropic Claude API | ~$1.56 | ~$6.24 |
| Apify (Zillow scraper runs) | ~$5 (free tier may cover) | ~$20 |
| Make.com (operations) | ~$9 (Core plan) | ~$16 (Pro plan) |
| Airtable | $0 (free tier) | ~$20 (Pro plan) |
| Documint (PDF generation) | ~$0 (free tier) | ~$15 |
| Google Drive | $0 (existing) | $0 |
| Wix (hosting) | $0 (existing site) | $0 |
| **Total Overhead** | **~$15.56/mo** | **~$77.24/mo** |

At $349/mo for a single Monthly-15 subscriber, you cover all infrastructure costs with one client.

---

*FramePostReady — Built by Frame & Form Studio. Document maintained by Colby Hollins. Last updated March 12, 2026.*
