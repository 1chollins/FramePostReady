import { NextRequest, NextResponse } from 'next/server'
import { getListing } from '@/lib/airtable/listings'
import { getActivePromptsMap } from '@/lib/airtable/prompts'
import { getContentByListing } from '@/lib/airtable/content'
import { createContentBlock, updateContentBlock } from '@/lib/airtable/content'
import { callClaude, calculateCost } from '@/lib/ai/client'
import { buildPromptVariables, mergeVariables } from '@/lib/ai/generate'
import { scanForCompliance } from '@/lib/compliance/scanner'
import { getAgent } from '@/lib/airtable/agents'
import type { ApiResponse } from '@/types/api'
import type { ContentType } from '@/types/content'

const VALID_CONTENT_TYPES: ContentType[] = [
  'Instagram', 'Facebook', 'MLS', 'Email', 'Reel Script', 'Hashtags',
]

export async function POST(
  request: NextRequest,
  { params }: { params: { contentType: string } }
) {
  try {
    const contentType = decodeURIComponent(params.contentType) as ContentType

    if (!VALID_CONTENT_TYPES.includes(contentType)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: `Invalid content type: ${contentType}. Must be one of: ${VALID_CONTENT_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { listingId } = body

    if (!listingId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'listingId is required' },
        { status: 400 }
      )
    }

    const listing = await getListing(listingId)
    if (!listing) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: `Listing not found: ${listingId}` },
        { status: 404 }
      )
    }

    const agent = listing.agentId ? await getAgent(listing.agentId) : null
    const promptsMap = await getActivePromptsMap()
    const template = promptsMap[contentType]

    if (!template) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: `No active prompt template for: ${contentType}` },
        { status: 404 }
      )
    }

    const variables = buildPromptVariables(listing, agent)
    const systemPrompt = mergeVariables(template.systemPrompt, variables)
    const userPrompt = mergeVariables(template.userPromptTemplate, variables)

    const response = await callClaude(systemPrompt, userPrompt, {
      temperature: template.temperature ?? 0.7,
      maxTokens: template.maxTokens ?? 2000,
    })

    const cost = calculateCost(response.inputTokens, response.outputTokens)
    const compliance = scanForCompliance(response.text)

    if (!compliance.isClean) {
      console.warn(
        `⚠️  ${contentType} regen compliance flags: ${compliance.flags.map((f) => `"${f.term}" (${f.category})`).join(', ')}`
      )
    }

    const existingBlocks = await getContentByListing(listingId)
    const existing = existingBlocks.find((b) => b.contentType === contentType)

    let block
    if (existing) {
      block = await updateContentBlock(existing.id, {
        generatedText: response.text,
        complianceFlags: compliance.flags.length > 0 ? compliance.flags : undefined,
      })
    } else {
      block = await createContentBlock({
        listingId,
        contentType,
        variantLabel: contentType,
        generatedText: response.text,
        version: 1,
        status: 'Draft',
        promptTemplateUsed: `${template.templateName} v${template.version}`,
        tokenCountInput: response.inputTokens,
        tokenCountOutput: response.outputTokens,
        apiCost: cost,
        edited: false,
        complianceFlags: compliance.flags.length > 0 ? compliance.flags : undefined,
      })
    }

    console.log(
      `✅ Regenerated ${contentType} for ${listingId} | ${response.inputTokens}+${response.outputTokens} tokens | $${cost.toFixed(4)} | clean: ${compliance.isClean}`
    )

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        block,
        tokens: response.inputTokens + response.outputTokens,
        cost,
        complianceClean: compliance.isClean,
        complianceFlags: compliance.flags,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[POST /api/generate/${params.contentType}]`, message)
    return NextResponse.json<ApiResponse>(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
