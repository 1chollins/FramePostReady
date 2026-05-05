import type { ScrapedListingData } from '@/types/listing'

const ZILLOW_ACTOR_ID = 'maxcopell~zillow-detail-scraper'
const SCRAPE_TIMEOUT_MS = 90_000
const POLL_INTERVAL_MS = 3_000
const APIFY_BASE = 'https://api.apify.com/v2'

export async function scrapeZillowListing(
  zillowUrl: string
): Promise<ScrapedListingData> {
  const token = process.env.APIFY_TOKEN
  if (!token) throw new Error('APIFY_TOKEN environment variable is not set')

  const startRes = await fetch(
    `${APIFY_BASE}/acts/${encodeURIComponent(ZILLOW_ACTOR_ID)}/runs?token=${token}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startUrls: [{ url: zillowUrl }],
        propertyStatus: 'FOR_SALE',
      }),
    }
  )
  if (!startRes.ok) {
    const text = await startRes.text()
    throw new Error(`Failed to start Apify actor: ${startRes.status} ${text}`)
  }
  const startJson = await startRes.json()
  const runId: string = startJson.data.id

  const deadline = Date.now() + SCRAPE_TIMEOUT_MS

  while (Date.now() < deadline) {
    const runRes = await fetch(`${APIFY_BASE}/actor-runs/${runId}?token=${token}`)
    if (!runRes.ok) throw new Error(`Failed to get Apify run info: ${runRes.status}`)
    const runJson = await runRes.json()
    const runInfo = runJson.data

    if (runInfo.status === 'SUCCEEDED') {
      const dataRes = await fetch(
        `${APIFY_BASE}/datasets/${runInfo.defaultDatasetId}/items?token=${token}`
      )
      if (!dataRes.ok) throw new Error(`Failed to fetch Apify dataset: ${dataRes.status}`)
      const items = await dataRes.json()
      if (!items || items.length === 0) {
        throw new Error('Apify scraper returned no results — listing may have been removed')
      }
      return items[0] as unknown as ScrapedListingData
    }

    if (['FAILED', 'ABORTED', 'TIMED-OUT'].includes(runInfo.status)) {
      const errMsg = runInfo.statusMessage || runInfo.status
      console.error('[Apify] Run failed. Status:', runInfo.status, '| Message:', errMsg)
      throw new Error(`Apify run failed with status: ${runInfo.status} — ${errMsg}`)
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
  }

  throw new Error(`Apify scrape timed out after ${SCRAPE_TIMEOUT_MS / 1000}s`)
}
