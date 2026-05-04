// TODO: Sprint 9 — PDF export using @react-pdf/renderer or puppeteer
// This module will generate branded PDF packages for each listing.

export interface PdfExportOptions {
  listingId: string
  agentId?: string
  includeTypes?: string[]
}

export async function generateListingPdf(_options: PdfExportOptions): Promise<string> {
  throw new Error('PDF export not yet implemented — coming in Sprint 9')
}
