import { NextRequest, NextResponse } from 'next/server'
import { notifyContentReady, notifyScrapeFailed } from '@/lib/notifications/email'
import type { ApiResponse } from '@/types/api'
import type { WebhookRequest } from '@/types/api'

/**
 * Make.com webhook bridge endpoint.
 * Receives automation triggers from Make.com scenarios and routes them
 * to the appropriate internal API handlers.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as WebhookRequest

    const secret = process.env.MAKE_WEBHOOK_SECRET
    if (!secret || body.secret !== secret) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { action, payload } = body

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    switch (action) {
      case 'scrape': {
        const res = await fetch(`${baseUrl}/api/scrape`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        return NextResponse.json<ApiResponse>(data, { status: res.status })
      }

      case 'generate': {
        const res = await fetch(`${baseUrl}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        return NextResponse.json<ApiResponse>(data, { status: res.status })
      }

      case 'scrape_and_generate': {
        const scrapeRes = await fetch(`${baseUrl}/api/scrape`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const scrapeData = await scrapeRes.json()

        if (!scrapeData.success) {
          await notifyScrapeFailed(
            payload?.zillowUrl || 'Unknown URL',
            scrapeData.error || 'Unknown scrape error'
          )
          return NextResponse.json<ApiResponse>(scrapeData, { status: scrapeRes.status })
        }

        const listingId = scrapeData.data?.id
        if (!listingId) {
          return NextResponse.json<ApiResponse>(
            { success: false, error: 'Scrape succeeded but no listing ID returned' },
            { status: 500 }
          )
        }

        const generateRes = await fetch(`${baseUrl}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listingId }),
        })
        const generateData = await generateRes.json()

        if (generateData.success && generateData.data) {
          await notifyContentReady(
            payload?.zillowUrl || listingId,
            generateData.data
          )
        }

        return NextResponse.json<ApiResponse>({
          success: generateData.success,
          data: { scrape: scrapeData.data, generate: generateData.data },
          error: generateData.error,
        }, { status: generateData.success ? 200 : 500 })
      }

      case 'notify': {
        const { address, result } = payload as { address: string; result: Parameters<typeof notifyContentReady>[1] }
        await notifyContentReady(address, result)
        return NextResponse.json<ApiResponse>({ success: true, data: { sent: true } })
      }

      case 'export': {
        const { listingId, recipientEmail } = payload as { listingId: string; recipientEmail: string }
        if (!listingId || !recipientEmail) {
          return NextResponse.json<ApiResponse>(
            { success: false, error: 'export action requires payload.listingId and payload.recipientEmail' },
            { status: 400 }
          )
        }
        const res = await fetch(`${baseUrl}/api/export`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listingId, recipientEmail }),
        })
        const data = await res.json()
        return NextResponse.json<ApiResponse>(data, { status: res.status })
      }

      default:
        return NextResponse.json<ApiResponse>(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook failed'
    console.error('[POST /api/webhook/make]', message)
    return NextResponse.json<ApiResponse>(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
