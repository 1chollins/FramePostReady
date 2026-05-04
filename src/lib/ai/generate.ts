import { getListing } from '@/lib/airtable/listings'
import { getAgent } from '@/lib/airtable/agents'
import { getActivePromptsMap } from '@/lib/airtable/prompts'
import { createContentBlock } from '@/lib/airtable/content'
import { updateListing } from '@/lib/airtable/listings'
import { callClaude, calculateCost } from './client'
import { scanForCompliance } from '@/lib/compliance/scanner'
import { getShadowbannedHashtags } from '@/lib/compliance/blocklist'
import { getToneInstructions } from './tone'
import { validateContentQuality } from './validator'
import { getEmailTypeInstructions, getCityHashtags, getReelContext } from './modules'
import type { ContentType, GenerationResult } from '@/types/content'
import type { PromptVariables } from '@/types/prompt'
import type { Listing } from '@/types/listing'
import type { Agent } from '@/types/agent'

const ALL_CONTENT_TYPES: ContentType[] = [
  'Instagram',
  'Facebook',
  'MLS',
  'Email',
  'Reel Script',
  'Hashtags',
]

/**
 * Builds the flat variable map used for prompt template merging.
 */
export function buildPromptVariables(
  listing: Listing,
  agent: Agent | null
): PromptVariables {
  return {
    address: listing.address,
    city: listing.city,
    county: listing.county || 'Not provided',
    zip: listing.zip || 'Not provided',
    price: listing.price.toLocaleString(),
    beds: String(listing.beds),
    baths: String(listing.baths),
    sqft: listing.sqft.toLocaleString(),
    lot_size: listing.lotSize || 'Not provided',
    year_built: listing.yearBuilt ? String(listing.yearBuilt) : 'Not provided',
    property_type: listing.propertyType,
    original_description: listing.originalDescription || 'Not provided',
    key_features: listing.keyFeatures.join(', ') || 'Not provided',
    swfl_keywords: listing.swflKeywordsMatched.join(', ') || 'Not provided',
    neighborhood: listing.neighborhood || 'Not provided',
    unique_selling_points: listing.uniqueSellingPoints || 'Not provided',
    photo_count: String(listing.photoUrls?.length || 0),
    agent_name: agent?.name || 'Not provided',
    agent_handle: agent?.instagramHandle || 'Not provided',
    agent_phone: agent?.phone || 'Not provided',
    agent_email: agent?.email || 'Not provided',
    brokerage: agent?.brokerage || 'Not provided',
    tone: listing.tone,
    tone_instructions: getToneInstructions(listing.tone),
    target_buyer: listing.targetBuyer || 'Not provided',
    email_type: listing.emailType || 'Just Listed',
    open_house_date: listing.openHouseDate || 'Not provided',
    price_change_amount: listing.priceChangeAmount
      ? `$${listing.priceChangeAmount.toLocaleString()}`
      : 'Not provided',
    special_notes: listing.specialNotes || 'None',
    email_type_instructions: getEmailTypeInstructions(listing.emailType || 'Just Listed'),
    city_hashtags: getCityHashtags(listing.city),
    reel_context: getReelContext(listing.propertyType, listing.swflKeywordsMatched),
  }
}

/**
 * Replaces all {variable_name} placeholders in a template string.
 */
export function mergeVariables(
  template: string,
  variables: Record<string, string>
): string {
  let merged = template
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{${key}}`
    merged = merged.split(placeholder).join(value ?? 'Not provided')
  }

  const remaining = merged.match(/\{[a-z_]+\}/g)
  if (remaining) {
    console.warn(`mergeVariables: Unresolved placeholders: ${remaining.join(', ')}`)
  }

  return merged.trim()
}

/**
 * Truncates MLS SHORT VERSION to 480 chars and LONG VERSION to 950 chars
 * at the nearest sentence boundary, then updates the char count annotation.
 */
function truncateAtSentence(text: string, limit: number): string {
  if (text.length <= limit) return text
  const trimmed = text.slice(0, limit)
  const lastPeriod = Math.max(trimmed.lastIndexOf('. '), trimmed.lastIndexOf('.\n'))
  const cut = lastPeriod > limit * 0.6 ? lastPeriod + 1 : limit
  return text.slice(0, cut).trim()
}

function enforceMlsLimits(text: string): string {
  return text
    .replace(
      /(SHORT VERSION[\s\S]*?)([\r\n])([\s\S]+?)(\(\d+\s*chars?\))/i,
      (_match, label, nl, body, _count) => {
        const truncated = truncateAtSentence(body.trim(), 480)
        return `${label}${nl}${truncated}\n(${truncated.length} chars)`
      }
    )
    .replace(
      /(LONG VERSION[\s\S]*?)([\r\n])([\s\S]+?)(\(\d+\s*chars?\))/i,
      (_match, label, nl, body, _count) => {
        const truncated = truncateAtSentence(body.trim(), 950)
        return `${label}${nl}${truncated}\n(${truncated.length} chars)`
      }
    )
}

/**
 * Generates all 6 content types for a listing and stores them in Airtable.
 */
export async function generateAllContent(listingId: string): Promise<GenerationResult> {
  const listing = await getListing(listingId)
  if (!listing) throw new Error(`Listing not found: ${listingId}`)

  const agent = listing.agentId ? await getAgent(listing.agentId) : null
  const promptsMap = await getActivePromptsMap()
  const variables = buildPromptVariables(listing, agent)

  await updateListing(listingId, { contentStatus: 'Generating' })

  const result: GenerationResult = {
    listingId,
    contentTypesGenerated: [],
    totalTokensInput: 0,
    totalTokensOutput: 0,
    totalCost: 0,
    timingMs: {},
    errors: {},
  }

  for (const contentType of ALL_CONTENT_TYPES) {
    const template = promptsMap[contentType]
    if (!template) {
      console.warn(`No active prompt template for ${contentType} — skipping`)
      result.errors[contentType] = 'No active prompt template found'
      continue
    }

    const startTime = Date.now()
    try {
      const systemPrompt = mergeVariables(template.systemPrompt, variables)
      const userPrompt = mergeVariables(template.userPromptTemplate, variables)

      const response = await callClaude(systemPrompt, userPrompt, {
        temperature: template.temperature ?? 0.7,
        maxTokens: template.maxTokens ?? 2000,
      })

      const cost = calculateCost(response.inputTokens, response.outputTokens)

      if (contentType === 'MLS') {
        response.text = enforceMlsLimits(response.text)
      }

      const compliance = scanForCompliance(response.text)

      if (!compliance.isClean) {
        console.warn(
          `⚠️  ${contentType} compliance flags: ${compliance.flags.map((f) => `"${f.term}" (${f.category})`).join(', ')}`
        )
      }

      if (contentType === 'Hashtags') {
        const shadowbanned = getShadowbannedHashtags()
        const tagsInResponse = (response.text.match(/#\w+/g) || []).map((t) => t.toLowerCase())
        const flagged = tagsInResponse.filter((t) => shadowbanned.includes(t))
        if (flagged.length > 0) {
          console.warn(`⚠️  Hashtags: ${flagged.length} potentially shadowbanned tags found: ${flagged.join(', ')}`)
        } else {
          console.log(`✅ Hashtags: no shadowbanned tags detected`)
        }
      }

      await createContentBlock({
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

      result.contentTypesGenerated.push(contentType)
      result.totalTokensInput += response.inputTokens
      result.totalTokensOutput += response.outputTokens
      result.totalCost += cost
      result.timingMs[contentType] = Date.now() - startTime
      result.errors[contentType] = null

      const qa = validateContentQuality(contentType, response.text)
      if (!qa.passed) {
        console.warn(`⚠️  QA [${contentType}]: ${qa.warnings.join(' | ')}`)
      }
      const metricsStr = Object.entries(qa.metrics).map(([k, v]) => `${k}=${v}`).join(', ')
      console.log(
        `✅ ${contentType}: 1 block | ${response.inputTokens}+${response.outputTokens} tokens | $${cost.toFixed(4)} | ${metricsStr || 'ok'} | ${result.timingMs[contentType]}ms`
      )
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      console.error(`❌ ${contentType} generation failed: ${msg}`)
      result.errors[contentType] = msg
      result.timingMs[contentType] = Date.now() - startTime
    }
  }

  await updateListing(listingId, { contentStatus: 'Content Ready' })

  console.log(
    `\n📊 Generation complete: ${result.contentTypesGenerated.length}/6 types | ${result.totalTokensInput + result.totalTokensOutput} total tokens | $${result.totalCost.toFixed(4)} total cost`
  )

  return result
}
