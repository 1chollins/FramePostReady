import Airtable from 'airtable'
import { base, TABLES } from './client'

export interface DeliveryRecord {
  id: string
  listingId: string
  agentId?: string
  deliveryMethod: 'PDF Email' | 'Google Drive' | 'Manual Handoff' | 'Agent Engine'
  pdfUrl?: string
  deliveryDate?: string
  opened: boolean
  feedback?: string
  rating?: number
}

function recordToDelivery(record: Airtable.Record<Airtable.FieldSet>): DeliveryRecord {
  const f = record.fields as Record<string, unknown>
  return {
    id: record.id,
    listingId: Array.isArray(f['Listing']) ? (f['Listing'] as string[])[0] : '',
    agentId: Array.isArray(f['Agent']) ? (f['Agent'] as string[])[0] : undefined,
    deliveryMethod: (f['Delivery Method'] as DeliveryRecord['deliveryMethod']) || 'Manual Handoff',
    pdfUrl: (f['PDF URL'] as string) || undefined,
    deliveryDate: (f['Delivery Date'] as string) || undefined,
    opened: (f['Opened'] as boolean) || false,
    feedback: (f['Feedback'] as string) || undefined,
    rating: (f['Rating'] as number) || undefined,
  }
}

export async function createDeliveryRecord(
  data: Omit<DeliveryRecord, 'id'>
): Promise<DeliveryRecord> {
  const record = await base(TABLES.DELIVERY_LOG).create({
    'Listing': [data.listingId],
    'Agent': data.agentId ? [data.agentId] : [],
    'Delivery Method': data.deliveryMethod,
    'PDF URL': data.pdfUrl || '',
    'Delivery Date': data.deliveryDate || new Date().toISOString().split('T')[0],
    'Opened': data.opened,
    'Feedback': data.feedback || '',
    'Rating': data.rating || null,
  })
  return recordToDelivery(record)
}

export async function getDeliveriesByListing(listingId: string): Promise<DeliveryRecord[]> {
  const records = await base(TABLES.DELIVERY_LOG)
    .select({
      filterByFormula: `FIND("${listingId}", ARRAYJOIN({Listing}))`,
      sort: [{ field: 'Delivery Date', direction: 'desc' }],
    })
    .all()
  return records.map(recordToDelivery)
}
