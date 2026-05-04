import { ApifyClient } from 'apify-client'
import type { ScrapedListingData } from '@/types/listing'

const ZILLOW_ACTOR_ID = 'maxcopell~zillow-detail-scraper'
const SCRAPE_TIMEOUT_MS = 90_000
const POLL_INTERVAL_MS = 3_000

if (!process.env.APIFY_TOKEN) {
  throw new Error('APIFY_TOKEN environment variable is not set')
}

const client = new ApifyClient({ token: process.env.APIFY_TOKEN })

export async function scrapeZillowListing(
  zillowUrl: string
): Promise<ScrapedListingData> {
  const run = await client.actor(ZILLOW_ACTOR_ID).call({
    startUrls: [{ url: zillowUrl }],
    propertyStatus: 'FOR_SALE',
  })

  const runId = run.id
  const deadline = Date.now() + SCRAPE_TIMEOUT_MS

  while (Date.now() < deadline) {
    const runInfo = await client.run(runId).get()
    if (!runInfo) throw new Error(`Apify run ${runId} not found`)

    if (runInfo.status === 'SUCCEEDED') {
      const { items } = await client.dataset(runInfo.defaultDatasetId).listItems()
      if (!items || items.length === 0) {
        throw new Error('Apify scraper returned no results — listing may have been removed')
      }
      return items[0] as unknown as ScrapedListingData
    }

    if (['FAILED', 'ABORTED', 'TIMED-OUT'].includes(runInfo.status)) {
      const errMsg = (runInfo as unknown as Record<string, unknown>).statusMessage || runInfo.status
      console.error('[Apify] Run failed. Status:', runInfo.status, '| Message:', errMsg)
      throw new Error(`Apify run failed with status: ${runInfo.status} — ${errMsg}`)
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
  }

  throw new Error(`Apify scrape timed out after ${SCRAPE_TIMEOUT_MS / 1000}s`)
}
