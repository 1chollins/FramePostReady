import { NextRequest, NextResponse } from 'next/server'
import { validateZillowUrl } from '@/lib/utils/validation'
import { scrapeZillowListing } from '@/lib/scraper/apify'
import { parseApifyResponse, mapPropertyType } from '@/lib/scraper/parser'
import { enrichWithSwflKeywords, deriveCounty } from '@/lib/scraper/enrichment'
import { createListing, getListingByZpid, updateListing } from '@/lib/airtable/listings'
import type { ApiResponse, ScrapeResponse } from '@/types/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { zillowUrl, agentId, tone, targetBuyer, emailType, specialNotes, uniqueSellingPoints } =
      body

    if (!zillowUrl) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'zillowUrl is required' },
        { status: 400 }
      )
    }

    const validation = validateZillowUrl(zillowUrl)
    if (!validation.isValid) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: validation.error ?? 'Invalid Zillow URL' },
        { status: 400 }
      )
    }

    const zpid = validation.zpid!

    const existing = await getListingByZpid(zpid)
    if (existing) {
      const stuckStatuses = ['Scraping', 'Scrape Failed']
      if (!stuckStatuses.includes(existing.contentStatus)) {
        return NextResponse.json<ApiResponse<ScrapeResponse>>({
          success: true,
          data: {
            listingId: existing.id,
            address: existing.address,
            city: existing.city,
            price: existing.price,
            beds: existing.beds,
            baths: existing.baths,
            sqft: existing.sqft,
            swflKeywordsMatched: existing.swflKeywordsMatched,
            contentStatus: existing.contentStatus,
          },
          message: 'Listing already exists — returning cached data',
        })
      }
      console.log(`[POST /api/scrape] Re-scraping stuck listing ${existing.id} (status: ${existing.contentStatus})`)
      await updateListing(existing.id, { contentStatus: 'Scraping' })
    }

    const listing = existing ?? await createListing({
      zillowUrl: validation.normalizedUrl!,
      zpid,
      address: '',
      city: '',
      price: 0,
      beds: 0,
      baths: 0,
      sqft: 0,
      keyFeatures: [],
      photoUrls: [],
      swflKeywordsMatched: [],
      tone: tone || 'Neutral',
      targetBuyer: targetBuyer || undefined,
      emailType: emailType || undefined,
      specialNotes: specialNotes || undefined,
      uniqueSellingPoints: uniqueSellingPoints || undefined,
      agentId: agentId || undefined,
      contentStatus: 'Scraping',
      propertyType: 'Single Family',
    }) as Awaited<ReturnType<typeof createListing>>

    let rawData
    try {
      rawData = await scrapeZillowListing(validation.normalizedUrl!)
    } catch (scrapeError) {
      const scrapeMsg =
        scrapeError instanceof Error
          ? scrapeError.message
          : typeof scrapeError === 'object' && scrapeError !== null && 'message' in scrapeError
            ? String((scrapeError as Record<string, unknown>).message)
            : String(scrapeError)
      console.error('[POST /api/scrape] Apify scrape error:', scrapeMsg)
      try {
        await updateListing(listing.id, { contentStatus: 'Scrape Failed' })
      } catch (statusErr) {
        console.error('[POST /api/scrape] Could not update status to Scrape Failed:', statusErr)
      }
      return NextResponse.json<ApiResponse>(
        { success: false, error: `Scrape error: ${scrapeMsg}` },
        { status: 500 }
      )
    }

    const rawObj = rawData as unknown as Record<string, unknown>
    console.log('[POST /api/scrape] Raw Apify keys:', Object.keys(rawObj))
    console.log('[POST /api/scrape] Sample fields:', JSON.stringify({
      zpid: rawObj.zpid, address: rawObj.address, streetAddress: rawObj.streetAddress,
      city: rawObj.city, price: rawObj.price, listPrice: rawObj.listPrice,
      bedrooms: rawObj.bedrooms, bathrooms: rawObj.bathrooms, livingArea: rawObj.livingArea,
      homeType: rawObj.homeType,
    }, null, 2))
    const parsed = parseApifyResponse(rawObj)
    const swflKeywords = enrichWithSwflKeywords(parsed)
    const county = deriveCounty(parsed.city)

    const updated = await updateListing(listing.id, {
      address: parsed.address,
      city: parsed.city,
      county,
      zip: parsed.zip,
      price: parsed.price,
      beds: parsed.beds,
      baths: parsed.baths,
      sqft: parsed.sqft,
      lotSize: parsed.lotSize,
      yearBuilt: parsed.yearBuilt,
      propertyType: mapPropertyType(parsed.propertyType || 'SINGLE_FAMILY'),
      originalDescription: parsed.description,
      keyFeatures: parsed.features || [],
      photoUrls: parsed.photoUrls || [],
      neighborhood: parsed.neighborhood,
      contentStatus: 'Scrape Complete',
    })

    if (swflKeywords.length > 0) {
      try {
        await updateListing(listing.id, { swflKeywordsMatched: swflKeywords })
      } catch (kwErr) {
        console.warn('[POST /api/scrape] Could not save SWFL keywords (check Airtable options):', kwErr)
      }
    }

    return NextResponse.json<ApiResponse<ScrapeResponse>>({
      success: true,
      data: {
        listingId: updated.id,
        address: updated.address,
        city: updated.city,
        price: updated.price,
        beds: updated.beds,
        baths: updated.baths,
        sqft: updated.sqft,
        swflKeywordsMatched: updated.swflKeywordsMatched,
        contentStatus: updated.contentStatus,
      },
    })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'object' && error !== null && 'message' in error
          ? String((error as Record<string, unknown>).message)
          : String(error)
    console.error('[POST /api/scrape] Error:', message, '\nFull error:', JSON.stringify(error, null, 2))
    return NextResponse.json<ApiResponse>(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
