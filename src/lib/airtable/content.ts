import Airtable from 'airtable'
import { base, TABLES } from './client'
import type { ContentBlock, ContentType, ContentBlockStatus, ComplianceFlag } from '@/types/content'

function recordToContentBlock(record: Airtable.Record<Airtable.FieldSet>): ContentBlock {
  const f = record.fields as Record<string, unknown>
  let complianceFlags: ComplianceFlag[] | undefined
  if (f['Compliance Flags']) {
    try {
      complianceFlags = JSON.parse(f['Compliance Flags'] as string) as ComplianceFlag[]
    } catch {
      complianceFlags = undefined
    }
  }
  return {
    id: record.id,
    listingId: Array.isArray(f['Listing (Link)']) ? (f['Listing (Link)'] as string[])[0] : '',
    contentType: (f['Content Type'] as ContentType) || 'Instagram',
    variantLabel: (f['Variant Label'] as string) || '',
    generatedText: (f['Content Body'] as string) || '',
    version: (f['Content Version'] as number) || 1,
    status: (f['Status'] as ContentBlockStatus) || 'Draft',
    promptTemplateUsed: (f['Prompt Template Used'] as string) || undefined,
    tokenCountInput: (f['Token Count (Input)'] as number) || undefined,
    tokenCountOutput: (f['Token Count (Output)'] as number) || undefined,
    apiCost: (f['API Cost'] as number) || undefined,
    generatedAt: (f['Generated Date'] as string) || new Date().toISOString(),
    edited: (f['Edited'] as boolean) || false,
    editNotes: (f['Edit Notes'] as string) || undefined,
    complianceFlags,
  }
}

export async function createContentBlock(
  data: Omit<ContentBlock, 'id' | 'generatedAt'>
): Promise<ContentBlock> {
  const record = await base(TABLES.CONTENT).create({
    'Listing (Link)': [data.listingId],
    'Content Type': data.contentType,
    'Content Body': data.generatedText,
    'Content Version': data.version,
  } as Airtable.FieldSet)
  return recordToContentBlock(record)
}

export async function getContentByListing(listingId: string): Promise<ContentBlock[]> {
  const records = await base(TABLES.CONTENT)
    .select({ sort: [{ field: 'Content ID', direction: 'asc' }] })
    .all()
  const filtered = records.filter((r) => {
    const linked = r.fields['Listing (Link)']
    return Array.isArray(linked) && (linked as string[]).includes(listingId)
  })
  return filtered.map(recordToContentBlock)
}

export async function getContentBlock(id: string): Promise<ContentBlock | null> {
  try {
    const record = await base(TABLES.CONTENT).find(id)
    return recordToContentBlock(record)
  } catch {
    return null
  }
}

export async function updateContentBlock(
  id: string,
  data: Partial<Pick<ContentBlock, 'generatedText' | 'status' | 'edited' | 'editNotes' | 'complianceFlags'>>
): Promise<ContentBlock> {
  const fields: Airtable.FieldSet = {}
  if (data.generatedText !== undefined) (fields as Record<string, unknown>)['Content Body'] = data.generatedText
  if (data.complianceFlags !== undefined) (fields as Record<string, unknown>)['Compliance Flags'] = JSON.stringify(data.complianceFlags)
  const record = await base(TABLES.CONTENT).update(id, fields)
  return recordToContentBlock(record)
}

export function groupContentByType(
  blocks: ContentBlock[]
): Partial<Record<ContentType, ContentBlock[]>> {
  return blocks.reduce(
    (acc, block) => {
      if (!acc[block.contentType]) acc[block.contentType] = []
      acc[block.contentType]!.push(block)
      return acc
    },
    {} as Partial<Record<ContentType, ContentBlock[]>>
  )
}
