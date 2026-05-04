import { NextRequest, NextResponse } from 'next/server'
import { getContentByListing } from '@/lib/airtable/content'
import type { ApiResponse } from '@/types/api'
import type { ContentBlock } from '@/types/content'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get('listingId')

    if (!listingId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'listingId query parameter is required' },
        { status: 400 }
      )
    }

    const content = await getContentByListing(listingId)

    return NextResponse.json<ApiResponse<ContentBlock[]>>({
      success: true,
      data: content,
      message: `${content.length} content blocks found`,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch content'
    console.error('[GET /api/content]', message)
    return NextResponse.json<ApiResponse>(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
