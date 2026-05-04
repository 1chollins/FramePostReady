# FramePostReady — LLM Handoff Document
**Last Updated:** May 2, 2026  
**Project Root:** `c:\Users\colby\Downloads\FramePostReady-main\FramePostReady-main\`  
**Owner:** Colby Hollins / Frame & Form Studio

---

## What This Project Does

Ingests a Zillow URL → scrapes listing data via Apify → generates 6 types of real estate marketing content via Claude API → stores everything in Airtable → (future) exports as branded PDF delivered via Google Drive / Resend email.

**6 Content Types Per Listing:**
1. Instagram Captions — 3 variants (Hook-Driven, Storytelling, Direct CTA)
2. Facebook Captions — 2 variants (Community-Focused, Feature-Focused)
3. MLS Description Rewrite — Short (500 char) + Long (1,000 char)
4. Email Blast Copy — 3 subject lines, preview text, body, CTA
5. Reel Script — 2 styles (Walkthrough, Fast-Cut), timed shot table
6. Hashtags — 30 main + 15 first-comment tags, categorized

**Service Area:** Southwest Florida (Cape Coral, Fort Myers, Naples, Bonita Springs, Estero, Lehigh Acres)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS |
| Database | Airtable (`airtable` npm), Base: "FramePostReady" |
| AI | Anthropic Claude (`@anthropic-ai/sdk`), model: `claude-sonnet-4-6` |
| Scraper | Apify (`apify-client`), actor: `petr_cermak~zillow-api-scraper` |
| Orchestration | Make.com (planned — Sprints 6+) |
| File Storage | Google Drive API (`googleapis`) |
| Email | Resend (`resend` npm) |
| Deployment | Vercel (planned — Sprint 8+) |

**Claude config:** temp=0.7, top_p=0.9, max_tokens=2000/type  
**Cost per listing:** ~$0.026 in Claude tokens

---

## Environment Variables (`.env.local`)

All variables are defined. File exists at project root as `.env.local` (gitignored).  
Example template: `.env.local.example`

```
ANTHROPIC_API_KEY        # Anthropic console
AIRTABLE_PAT             # Airtable Personal Access Token (starts with "pat")
AIRTABLE_BASE_ID         # Airtable base ID (starts with "app")
APIFY_TOKEN              # Apify API token
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY       # Must keep \n escapes, wrapped in double quotes
GOOGLE_DRIVE_ROOT_FOLDER_ID
MAKE_WEBHOOK_SECRET
RESEND_API_KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
NOTIFICATION_EMAIL=colby@frameandformstudio.com
```

---

## Complete File Structure (All Files Created)

```
src/
├── app/
│   ├── layout.tsx                        # Root layout with Tailwind
│   ├── globals.css                       # Global styles
│   ├── page.tsx                          # Homepage — test UI with ScrapeForm
│   └── api/
│       ├── scrape/route.ts               # POST — Zillow URL → Apify → Airtable
│       ├── generate/route.ts             # POST — listingId → Claude → Airtable
│       ├── listings/route.ts             # GET — list all listings
│       ├── listings/[id]/route.ts        # GET + PATCH — single listing
│       ├── agents/route.ts               # GET + POST — agents
│       └── webhook/make/route.ts         # POST — Make.com webhook bridge
│
├── components/
│   └── ScrapeForm.tsx                    # Client component: URL form → scrape → generate
│
├── lib/
│   ├── airtable/
│   │   ├── client.ts                     # Airtable singleton + TABLES constants
│   │   ├── listings.ts                   # Full CRUD for Listings table
│   │   ├── content.ts                    # Full CRUD for Content table
│   │   ├── agents.ts                     # Full CRUD for Agents table
│   │   ├── prompts.ts                    # Full CRUD + getActivePromptsMap()
│   │   └── delivery.ts                   # Full CRUD for Delivery Log table
│   │
│   ├── ai/
│   │   ├── client.ts                     # callClaude() with retry + calculateCost()
│   │   ├── generate.ts                   # generateAllContent() — full orchestration
│   │   └── parser.ts                     # parseVariants(), countWords(), extractSection()
│   │
│   ├── scraper/
│   │   ├── apify.ts                      # scrapeZillowListing() — calls Apify actor
│   │   ├── parser.ts                     # parseApifyResponse() + mapPropertyType()
│   │   └── enrichment.ts                 # enrichWithSwflKeywords() + deriveCounty()
│   │
│   ├── compliance/
│   │   ├── scanner.ts                    # scanContent() — Fair Housing + blocked terms
│   │   └── blocklist.ts                  # loadBlockedTerms() + loadShadowbannedHashtags()
│   │
│   ├── export/
│   │   ├── pdf.ts                        # STUB — Sprint 9
│   │   └── drive.ts                      # STUB — Sprint 9
│   │
│   └── utils/
│       ├── validation.ts                 # validateZillowUrl() — extracts ZPID
│       ├── constants.ts                  # SWFL cities, compliance terms, defaults
│       └── formatting.ts                 # formatPrice(), formatAddress(), etc.
│
└── types/
    ├── listing.ts                        # Listing, ListingInput, ScrapedListingData, ListingInputSchema (Zod)
    ├── content.ts                        # ContentBlock, ComplianceFlag, GenerationResult, all variant types
    ├── agent.ts                          # Agent interface
    ├── prompt.ts                         # PromptTemplate interface
    └── api.ts                            # ApiResponse, ScrapeRequest/Response, GenerateRequest/Response

data/
├── blocked-terms.json                    # Fair Housing + unsubstantiated + overused terms (~50)
├── swfl-keywords.json                    # 15 SWFL enrichment rules (waterfront, pool, STR, cities, etc.)
└── shadowbanned-hashtags.json            # 48 shadowbanned + 14 restricted hashtags

scripts/
└── test-setup.ts                         # Tests all 5 API connections — run with: npx tsx scripts/test-setup.ts
```

---

## Airtable Schema (5 Tables — Must Be Created Manually)

The code references these exact table and field names. They must match exactly.

### Table 1: `Listings`
| Field Name | Type |
|---|---|
| Zillow URL | URL |
| ZPID | Single line text |
| Address | Single line text |
| City | Single line text |
| County | Single line text |
| Zip Code | Single line text |
| Price | Number |
| Beds | Number |
| Baths | Number (decimal) |
| Sqft | Number |
| Lot Size | Single line text |
| Year Built | Number |
| Property Type | Single select: Single Family, Condo, Townhome, Villa, Multi-Family, Vacant Land |
| Original MLS Description | Long text |
| Key Features | Long text (stored as JSON string array) |
| Photo URLs | Long text (stored as JSON string array) |
| Neighborhood | Single line text |
| SWFL Keywords Matched | Multiple select |
| Tone | Single select: Luxury, Family-Friendly, Investor-Focused, First-Time Buyer, Neutral |
| Target Buyer | Single select: Relocator, Snowbird, First-Time Buyer, Investor, Downsizer, Upsizer, Military/VA |
| Email Type | Single select: Just Listed, Open House, Price Reduction, Back on Market, Under Contract |
| Unique Selling Points | Long text |
| Special Notes | Long text |
| Open House Date | Single line text |
| Price Change Amount | Number |
| Listing Status | Single select: Active, Pending, Sold, Price Reduced, Back on Market |
| Content Status | Single select: Queued, Scraping, Scrape Complete, Scrape Failed, Generating, Content Ready, Delivered, Archived |
| Created Date | Created time |
| Last Modified | Last modified time |

> ⚠️ Do NOT add an "Agent" linked record field until you are ready to use it. The code skips it when no agentId is provided.

### Table 2: `Agents`
| Field Name | Type |
|---|---|
| Name | Single line text |
| Email | Email |
| Phone | Phone number |
| Instagram Handle | Single line text |
| Brokerage | Single line text |
| Preferred Tone | Single select (same options as Listings.Tone) |
| Default CTA | Single line text |
| Google Drive Folder ID | Single line text |
| Tier | Single select: Bundled, Single, Monthly-5, Monthly-15 |

### Table 3: `Content`
| Field Name | Type |
|---|---|
| Listing | Linked record → Listings |
| Content Type | Single select: Instagram, Facebook, MLS, Email, Reel Script, Hashtags |
| Variant Label | Single line text |
| Generated Text | Long text |
| Version | Number |
| Status | Single select: Draft, Approved, Exported, Archived |
| Prompt Template Used | Single line text |
| Token Count Input | Number |
| Token Count Output | Number |
| API Cost | Number (currency) |
| Generated At | Created time |
| Edited | Checkbox |
| Edit Notes | Long text |

### Table 4: `Prompt Templates`
| Field Name | Type |
|---|---|
| Template Name | Single line text |
| Content Type | Single select: Instagram, Facebook, MLS, Email, Reel Script, Hashtags |
| Variant | Single line text |
| System Prompt | Long text |
| User Prompt Template | Long text (uses {variable} placeholders) |
| Version | Number |
| Active | Checkbox |
| Temperature | Number (0.0–1.0) |
| Max Tokens | Number |
| Performance Score | Number |
| Notes | Long text |
| Last Updated | Last modified time |

### Table 5: `Delivery Log`
| Field Name | Type |
|---|---|
| Listing | Linked record → Listings |
| Agent | Linked record → Agents |
| Delivery Method | Single select: PDF, Drive, Email |
| PDF URL | URL |
| Delivered At | Date |
| Client Feedback | Long text |
| Rating | Number (1–5) |

---

## Prompt Template Variables

When writing prompt templates in Airtable, use `{variable_name}` placeholders. Available variables:

```
{address}              {city}                 {county}
{zip}                  {price}                {beds}
{baths}                {sqft}                 {lot_size}
{year_built}           {property_type}        {original_description}
{key_features}         {swfl_keywords}        {neighborhood}
{unique_selling_points} {photo_count}         {agent_name}
{agent_handle}         {agent_phone}          {agent_email}
{brokerage}            {tone}                 {target_buyer}
{email_type}           {open_house_date}      {price_change_amount}
{special_notes}
```

**Variant separator:** Claude responses must use `---` on its own line to separate variants. The parser splits on this.

---

## API Endpoints (All Live)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/scrape` | Body: `{ zillowUrl, tone?, targetBuyer?, emailType?, specialNotes?, uniqueSellingPoints?, agentId? }` |
| POST | `/api/generate` | Body: `{ listingId, contentType? }` — omit contentType to generate all 6 |
| GET | `/api/listings` | Query: `?contentStatus=&agentId=&maxRecords=` |
| GET | `/api/listings/[id]` | Returns single listing |
| PATCH | `/api/listings/[id]` | Partial update |
| GET | `/api/agents` | List all agents |
| POST | `/api/agents` | Create agent |
| POST | `/api/webhook/make` | Make.com bridge — requires `secret` in body matching `MAKE_WEBHOOK_SECRET` |

---

## Sprint Status

### ✅ Sprint 0 — Complete
- Next.js 14 project scaffolded (TypeScript, Tailwind, App Router)
- All npm dependencies installed (514 packages)
- Full TypeScript type definitions (5 type files)
- All Airtable CRUD modules (5 table modules)
- AI client, generate orchestrator, response parser
- Apify scraper, response parser, SWFL enrichment
- Compliance scanner + blocklist loader
- All API routes stubbed and functional
- Data JSON files (blocked-terms, swfl-keywords, shadowbanned-hashtags)
- Test connection script (`scripts/test-setup.ts`)

### 🔄 Sprint 1 — In Progress (backend mostly done, testing underway)

**Done:**
- `scrapeZillowListing()` — calls Apify actor, polls for completion, returns raw data
- `parseApifyResponse()` — maps Apify fields to internal `ScrapedListingData` type
- `enrichWithSwflKeywords()` — matches 15 SWFL keyword rules, derives county from city
- `createListing()` / `updateListing()` — full field mapping to Airtable
- `getListingByZpid()` — deduplication check before creating new record
- `/api/scrape` route — full pipeline: validate → deduplicate → create → scrape → enrich → update
- ZPID extraction — supports both `/address/ZPID` and `/ZPID_zpid/` URL formats
- Error recovery — sets `contentStatus: 'Scrape Failed'` in Airtable if Apify throws

**Bugs Fixed This Session:**
1. `updateListing()` only mapped status fields, not data fields — now maps all 20+ fields
2. ZPID regex only matched `_zpid` suffix format — now handles bare trailing ZPID format
3. `createListing()` sent `'Agent': []` when no agentId — Airtable rejected unknown empty linked-record field — now conditionally omits Agent field
4. Error catch block swallowed non-Error Airtable exceptions — now extracts `.message` from plain objects

**Still Needed for Sprint 1:**
- [ ] Run end-to-end test with real Zillow URL to confirm full scrape → Airtable pipeline works
- [ ] Verify Apify actor returns data in expected shape (may need parser tweaks)
- [ ] Confirm SWFL keyword matching works correctly on real data

### ⏳ Sprint 2 — Not Started
- [ ] Manual entry route (POST `/api/listings` with full field body, no scrape)
- [ ] Retry logic for failed scrapes (re-scrape endpoint)
- [ ] Status lifecycle management (prevent re-scraping an already-complete listing)
- [ ] Better deduplication (check by address string if no ZPID)

### ⏳ Sprint 3 — Not Started (code written, not tested)
- `generateAllContent()` is fully implemented in `src/lib/ai/generate.ts`
- Calls `getActivePromptsMap()` → fetches active prompts from Airtable per content type
- Merges listing variables into prompt templates
- Calls Claude for each of 6 content types
- Parses variants via `---` separator
- Stores each variant as a `ContentBlock` in Airtable
- **Blocker:** Prompt Templates table must be populated in Airtable with at least 1 active prompt per content type before generation will work

### ⏳ Sprints 4–5 — Not Started
- Refine individual content modules (Instagram, Facebook, MLS, Email, Reel, Hashtags)
- Compliance scanner integration into content pipeline
- Shadowban hashtag filtering

### ⏳ Sprint 6 — Not Started
- Make.com webhook integration (3 scenarios: Intake, Generation, Export)
- Webhook bridge endpoint exists at `/api/webhook/make` — needs Make.com scenarios built

### ⏳ Sprint 7 — Not Started
- 5-listing validation run
- QA checklist + compliance pass
- Performance scoring

### ⏳ Sprint 8 — Not Started
- 3 real client pilots
- Feedback loop
- MVP lock

### ⏳ Sprints 9–12 — Not Started
- Next.js frontend dashboard (full UI — listings list, content viewer, approval flow)
- PDF export (`src/lib/export/pdf.ts` is a stub)
- Google Drive upload (`src/lib/export/drive.ts` is a stub)
- Vercel deployment
- Client-facing launch

---

## Known Issues / Gotchas

1. **Airtable `SWFL Keywords Matched` field** — code sends a `string[]`. In Airtable this should be a **Multiple Select** field. The select options must exist in Airtable before records can be created with those values, OR set the field to accept new options automatically.

2. **Prompt Templates required before generation** — `generateAllContent()` calls `getActivePromptsMap()` which queries Airtable. If no active prompts exist for a content type, that type is skipped. You must add prompts to Airtable manually (or via a seed script) before testing Sprint 3.

3. **`SWFL Keywords Matched` multi-select** — the enrichment module returns keyword strings (e.g. `"Waterfront"`, `"Pool"`, `"Cape Coral"`). These values must exist as select options in your Airtable field, or the create/update will fail with an unknown option error.

4. **Apify actor response shape** — `parseApifyResponse()` in `src/lib/scraper/parser.ts` maps common Zillow fields. If the Apify actor returns differently named fields, this parser may need tweaking. Check the actual Apify dataset output on first run.

5. **`Agent` linked-record field** — currently omitted from all Airtable calls when no agentId is provided. Do not add an "Agent" field to the Listings table until the Agents table is also set up and you're ready to link records.

6. **Module-level env checks** — `src/lib/airtable/client.ts` and `src/lib/scraper/apify.ts` throw at load time if env vars are missing. In Next.js App Router, these errors surface as 500s, not the module's own error message.

---

## How to Run

```bash
# Start dev server
cmd /c npm run dev
# → http://localhost:3000

# Test all API connections (requires .env.local filled in)
npx tsx scripts/test-setup.ts
```

---

## Next Immediate Actions (In Order)

1. **Verify Airtable tables exist** with exact field names above — especially `Content Status` as a Single Select with all status values listed
2. **Add SWFL keyword options** to the `SWFL Keywords Matched` Multiple Select field in Airtable: Waterfront, Gulf Access, Canal, Pool, Spa, Screened Lanai, Short-Term Rental, STR, Boat Dock, Boat Lift, Cul-de-sac, Cape Coral, Fort Myers, Naples, Bonita Springs, Estero, Lehigh Acres, New Construction, Impact Windows, Solar
3. **Test the scrape pipeline** — paste a SWFL Zillow URL in the UI at `http://localhost:3000` — should scrape and store in ~60–90 seconds
4. **Add prompt templates to Airtable** — one per content type (Instagram, Facebook, MLS, Email, Reel Script, Hashtags), mark Active = true
5. **Test content generation** — click "Generate All Content" after a successful scrape
