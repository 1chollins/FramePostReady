import { Resend } from 'resend'
import type { GenerationResult } from '@/types/content'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'FramePostReady <noreply@frameandformstudio.com>'
const NOTIFY_TO = process.env.NOTIFICATION_EMAIL || 'contact@frameandformstudio.com'

/**
 * Sends a notification email to Colby when content generation completes.
 */
export async function notifyContentReady(
  address: string,
  result: GenerationResult
): Promise<void> {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith('re_xxxx')) {
    console.log(`[notify] Resend not configured — skipping email for: ${address}`)
    return
  }

  const successCount = result.contentTypesGenerated.length
  const errorCount = Object.values(result.errors).filter((e) => e !== null).length
  const statusEmoji = errorCount === 0 ? '✅' : '⚠️'

  const errorRows = Object.entries(result.errors)
    .filter(([, v]) => v !== null)
    .map(([type, msg]) => `<li><strong>${type}:</strong> ${msg}</li>`)
    .join('')

  const timingRows = Object.entries(result.timingMs)
    .map(([type, ms]) => `<tr><td>${type}</td><td>${(ms / 1000).toFixed(1)}s</td></tr>`)
    .join('')

  try {
    await resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      subject: `${statusEmoji} Content Ready: ${address}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">${statusEmoji} FramePostReady — Content Generated</h2>
          <p><strong>Property:</strong> ${address}</p>
          <p><strong>Result:</strong> ${successCount}/6 content types generated</p>
          <p><strong>Total Cost:</strong> $${result.totalCost.toFixed(4)}</p>
          <p><strong>Total Tokens:</strong> ${(result.totalTokensInput + result.totalTokensOutput).toLocaleString()}</p>

          ${errorCount > 0 ? `
          <h3 style="color: #dc2626;">Errors (${errorCount})</h3>
          <ul>${errorRows}</ul>
          ` : ''}

          <h3>Timing</h3>
          <table border="1" cellpadding="6" style="border-collapse: collapse; width: 100%;">
            <tr><th>Content Type</th><th>Duration</th></tr>
            ${timingRows}
          </table>

          <p style="margin-top: 24px; color: #6b7280; font-size: 12px;">
            View in Airtable → Content table, or open the dashboard.
          </p>
        </div>
      `,
    })
    console.log(`[notify] Content ready email sent for: ${address}`)
  } catch (err) {
    console.warn(`[notify] Failed to send email: ${err instanceof Error ? err.message : String(err)}`)
  }
}

/**
 * Sends an alert email when a scrape fails.
 */
export async function notifyScrapeFailed(
  url: string,
  errorMessage: string
): Promise<void> {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.startsWith('re_xxxx')) {
    console.log(`[notify] Resend not configured — skipping scrape failure email`)
    return
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      subject: `❌ Scrape Failed — Manual Entry Needed`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">❌ FramePostReady — Scrape Failed</h2>
          <p><strong>URL:</strong> ${url}</p>
          <p><strong>Error:</strong> ${errorMessage}</p>
          <p>Please use manual entry at <a href="${process.env.NEXT_PUBLIC_APP_URL}">the app</a> to add this listing.</p>
        </div>
      `,
    })
    console.log(`[notify] Scrape failure email sent for: ${url}`)
  } catch (err) {
    console.warn(`[notify] Failed to send scrape failure email: ${err instanceof Error ? err.message : String(err)}`)
  }
}
