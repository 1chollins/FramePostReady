# FramePostReady — Make.com Scenario Setup Guide

## Overview

Two Make.com scenarios power the automated pipeline:

| Scenario | Trigger | Action |
|---|---|---|
| **Scenario 1** | Manual or Form trigger | Scrape + Generate (full pipeline) |
| **Scenario 2** | Webhook from Scenario 1 | Generate only (re-run for existing listing) |

**Webhook URL (local dev):** `http://localhost:3000/api/webhook/make`  
**Webhook URL (production):** `https://your-vercel-domain.vercel.app/api/webhook/make`  
**Webhook Secret:** Value of `MAKE_WEBHOOK_SECRET` in `.env.local`

---

## Scenario 1 — Full Pipeline (Scrape + Generate)

**Trigger:** Manual button, Google Form, or Airtable form submission

### Module 1: HTTP Request (Trigger scrape + generate)

| Field | Value |
|---|---|
| URL | `{WEBHOOK_URL}` |
| Method | POST |
| Body Type | JSON |
| Headers | `Content-Type: application/json` |

**JSON Body:**
```json
{
  "action": "scrape_and_generate",
  "secret": "YOUR_MAKE_WEBHOOK_SECRET",
  "payload": {
    "zillowUrl": "{{zillowUrl}}",
    "agentId": "{{agentId}}",
    "tone": "{{tone}}",
    "targetBuyer": "{{targetBuyer}}",
    "emailType": "{{emailType}}",
    "specialNotes": "{{specialNotes}}"
  }
}
```

> The `scrape_and_generate` action scrapes the Zillow URL, saves to Airtable, generates all 6 content types, and sends a notification email — all in one call.

### Module 2: Error Handler (Optional)

If the HTTP request returns `success: false`, trigger a Slack or email alert:
- Check `{{1.success}}` equals `false`
- Send notification with `{{1.error}}`

---

## Scenario 2 — Generate Only (Existing Listing)

Use this when a listing is already in Airtable but needs fresh content (re-run or first-time generate after manual entry).

### Module 1: HTTP Request

| Field | Value |
|---|---|
| URL | `{WEBHOOK_URL}` |
| Method | POST |

**JSON Body:**
```json
{
  "action": "generate",
  "secret": "YOUR_MAKE_WEBHOOK_SECRET",
  "payload": {
    "listingId": "{{listingId}}"
  }
}
```

---

## Scenario 3 — Single Content Type Regeneration

Use this to regenerate just one content type (e.g., just Email or just Hashtags).

**Endpoint:** `POST /api/generate/{contentType}`

Valid `contentType` values: `Instagram`, `Facebook`, `MLS`, `Email`, `Reel Script`, `Hashtags`

**JSON Body:**
```json
{
  "listingId": "{{listingId}}"
}
```

> Note: This endpoint does NOT require the Make webhook secret — it's a direct API call.

---

## Available Webhook Actions

| Action | Description |
|---|---|
| `scrape` | Scrape a Zillow URL and save to Airtable only |
| `generate` | Generate all 6 content types for an existing listing |
| `scrape_and_generate` | Full pipeline — scrape + generate + notify |
| `notify` | Send a notification email (manual trigger) |
| `export` | Export to PDF/Drive (Sprint 9+, not yet implemented) |

---

## Testing the Webhook Locally

Use this curl command to test the full pipeline locally:

```bash
curl -X POST http://localhost:3000/api/webhook/make \
  -H "Content-Type: application/json" \
  -d '{
    "action": "scrape_and_generate",
    "secret": "YOUR_SECRET_HERE",
    "payload": {
      "zillowUrl": "https://www.zillow.com/homedetails/...",
      "tone": "Neutral",
      "emailType": "Just Listed"
    }
  }'
```

---

## Notification Emails

When `scrape_and_generate` completes successfully, an email is sent to `NOTIFICATION_EMAIL` via Resend with:
- Property address
- 6/6 generation result
- API cost
- Per-type timing
- Any errors

When a scrape fails, a failure alert is sent with the URL and error message for manual entry fallback.

---

## Environment Variables Required

```
MAKE_WEBHOOK_SECRET=your_secret_here
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
RESEND_API_KEY=re_your_key_here
NOTIFICATION_EMAIL=contact@frameandformstudio.com
```
