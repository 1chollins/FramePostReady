import Airtable from 'airtable'
import { base, TABLES } from './client'
import type { Agent, AgentTier } from '@/types/agent'

function recordToAgent(record: Airtable.Record<Airtable.FieldSet>): Agent {
  const f = record.fields as Record<string, unknown>
  return {
    id: record.id,
    name: (f['Agent Name'] as string) || '',
    email: (f['Email'] as string) || undefined,
    phone: (f['Phone'] as string) || undefined,
    instagramHandle: (f['Instagram Handle'] as string) || undefined,
    facebookPageUrl: (f['Facebook Page URL'] as string) || undefined,
    brokerage: (f['Brokerage'] as string) || undefined,
    preferredTone: (f['Preferred Tone'] as string) || undefined,
    defaultCta: (f['Default CTA'] as string) || undefined,
    headshotUrl: (f['Headshot URL'] as string) || undefined,
    logoUrl: (f['Logo URL'] as string) || undefined,
    googleDriveFolderId: (f['Google Drive Folder ID'] as string) || undefined,
    tier: (f['Tier'] as AgentTier) || undefined,
    active: (f['Active'] as boolean) ?? true,
    notes: (f['Notes'] as string) || undefined,
  }
}

export async function createAgent(data: Omit<Agent, 'id'>): Promise<Agent> {
  const record = await base(TABLES.AGENTS).create({
    'Agent Name': data.name,
    'Email': data.email || '',
    'Phone': data.phone || '',
    'Instagram Handle': data.instagramHandle || '',
    'Facebook Page URL': data.facebookPageUrl || '',
    'Brokerage': data.brokerage || '',
    'Preferred Tone': data.preferredTone || 'Neutral',
    'Default CTA': data.defaultCta || '',
    'Headshot URL': data.headshotUrl || '',
    'Logo URL': data.logoUrl || '',
    'Google Drive Folder ID': data.googleDriveFolderId || '',
    'Tier': data.tier || 'Bundled',
    'Active': data.active,
    'Notes': data.notes || '',
  })
  return recordToAgent(record)
}

export async function getAgent(id: string): Promise<Agent | null> {
  try {
    const record = await base(TABLES.AGENTS).find(id)
    return recordToAgent(record)
  } catch {
    return null
  }
}

export async function listAgents(activeOnly = true): Promise<Agent[]> {
  const records = await base(TABLES.AGENTS)
    .select({
      filterByFormula: activeOnly ? '{Active} = TRUE()' : '',
      sort: [{ field: 'Agent Name', direction: 'asc' }],
    })
    .all()
  return records.map(recordToAgent)
}

export async function updateAgent(
  id: string,
  data: Partial<Omit<Agent, 'id'>>
): Promise<Agent> {
  const fields: Record<string, Airtable.FieldSet[string]> = {}
  if (data.name !== undefined) fields['Agent Name'] = data.name
  if (data.email !== undefined) fields['Email'] = data.email
  if (data.phone !== undefined) fields['Phone'] = data.phone
  if (data.instagramHandle !== undefined) fields['Instagram Handle'] = data.instagramHandle
  if (data.brokerage !== undefined) fields['Brokerage'] = data.brokerage
  if (data.preferredTone !== undefined) fields['Preferred Tone'] = data.preferredTone
  if (data.defaultCta !== undefined) fields['Default CTA'] = data.defaultCta
  if (data.googleDriveFolderId !== undefined) fields['Google Drive Folder ID'] = data.googleDriveFolderId
  if (data.active !== undefined) fields['Active'] = data.active
  if (data.tier !== undefined) fields['Tier'] = data.tier
  if (data.notes !== undefined) fields['Notes'] = data.notes
  const record = await base(TABLES.AGENTS).update(id, fields)
  return recordToAgent(record)
}
