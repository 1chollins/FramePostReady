import Airtable from 'airtable'
import { base, TABLES } from './client'
import type { PromptTemplate } from '@/types/prompt'
import type { ContentType } from '@/types/content'

function recordToPromptTemplate(record: Airtable.Record<Airtable.FieldSet>): PromptTemplate {
  const f = record.fields as Record<string, unknown>
  return {
    id: record.id,
    templateName: (f['Template Name'] as string) || '',
    contentType: (f['Content Type'] as ContentType) || 'Instagram',
    variant: (f['Variant'] as string) || undefined,
    systemPrompt: (f['System Prompt'] as string) || '',
    userPromptTemplate: (f['User Prompt Template'] as string) || '',
    version: (f['Version'] as number) || 1,
    active: (f['Active'] as boolean) ?? true,
    temperature: (f['Temperature'] as number) || undefined,
    maxTokens: (f['Max Tokens'] as number) || undefined,
    performanceScore: (f['Performance Score'] as number) || undefined,
    notes: (f['Notes'] as string) || undefined,
    lastUpdated: (f['Last Updated'] as string) || new Date().toISOString(),
  }
}

export async function getActivePromptsByType(
  contentType: ContentType
): Promise<PromptTemplate[]> {
  const records = await base(TABLES.PROMPT_TEMPLATES)
    .select({
      filterByFormula: `AND({Content Type} = "${contentType}", {Active} = TRUE())`,
      sort: [{ field: 'Version', direction: 'desc' }],
    })
    .all()
  return records.map(recordToPromptTemplate)
}

export async function getAllActivePrompts(): Promise<PromptTemplate[]> {
  const records = await base(TABLES.PROMPT_TEMPLATES)
    .select({
      filterByFormula: '{Active} = TRUE()',
      sort: [{ field: 'Content Type', direction: 'asc' }],
    })
    .all()
  return records.map(recordToPromptTemplate)
}

export async function getPromptTemplate(id: string): Promise<PromptTemplate | null> {
  try {
    const record = await base(TABLES.PROMPT_TEMPLATES).find(id)
    return recordToPromptTemplate(record)
  } catch {
    return null
  }
}

export async function getActivePromptsMap(): Promise<Partial<Record<ContentType, PromptTemplate>>> {
  const prompts = await getAllActivePrompts()
  const map: Partial<Record<ContentType, PromptTemplate>> = {}
  for (const prompt of prompts) {
    if (!map[prompt.contentType]) {
      map[prompt.contentType] = prompt
    }
  }
  return map
}
