/**
 * Sprint 0 — Connection Test Suite
 * Run with: npx tsx scripts/test-setup.ts
 *
 * Tests all API connections and prints ✅ / ❌ for each.
 * Requires .env.local to be populated with real keys.
 */
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

interface TestResult {
  name: string
  success: boolean
  detail: string
  durationMs: number
}

const results: TestResult[] = []

async function test(name: string, fn: () => Promise<string>): Promise<void> {
  const start = Date.now()
  try {
    const detail = await fn()
    results.push({ name, success: true, detail, durationMs: Date.now() - start })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    results.push({ name, success: false, detail: msg, durationMs: Date.now() - start })
  }
}

async function testAnthropic(): Promise<string> {
  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 20,
    messages: [{ role: 'user', content: 'Reply with only "ok"' }],
  })
  const text = response.content[0]?.type === 'text' ? response.content[0].text : ''
  return `Model: claude-sonnet-4-6 | Response: "${text.trim()}" | Tokens: ${response.usage.input_tokens}+${response.usage.output_tokens}`
}

async function testAirtable(): Promise<string> {
  const Airtable = (await import('airtable')).default
  Airtable.configure({ apiKey: process.env.AIRTABLE_PAT! })
  const base = Airtable.base(process.env.AIRTABLE_BASE_ID!)

  const tables = ['Listings', 'Agents', 'Content', 'Prompt Templates', 'Delivery Log']
  const tableResults: string[] = []

  for (const tableName of tables) {
    try {
      const records = await base(tableName).select({ maxRecords: 1 }).firstPage()
      tableResults.push(`${tableName}:✅(${records.length} records)`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      tableResults.push(`${tableName}:❌(${msg.slice(0, 40)})`)
    }
  }

  return tableResults.join(' | ')
}

async function testApify(): Promise<string> {
  const { ApifyClient } = await import('apify-client')
  const client = new ApifyClient({ token: process.env.APIFY_TOKEN! })
  const user = await client.user().get()
  return `Username: ${user?.username || 'unknown'} | Plan: ${user?.plan?.id || 'unknown'}`
}

async function testGoogleDrive(): Promise<string> {
  const { google } = await import('googleapis')
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  })
  const drive = google.drive({ version: 'v3', auth })
  const res = await drive.files.list({ pageSize: 1, fields: 'files(id,name)' })
  const count = res.data.files?.length ?? 0
  return `Drive API connected | Root folder accessible | ${count} file(s) visible`
}

async function testResend(): Promise<string> {
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY!)
  const domains = await resend.domains.list()
  return `Resend API connected | Domains: ${JSON.stringify(domains)?.slice(0, 80)}`
}

async function main() {
  console.log('\n🔍 FramePostReady — Sprint 0 Connection Tests\n')
  console.log('='.repeat(60))

  await test('Anthropic Claude API', testAnthropic)
  await test('Airtable (5 tables)', testAirtable)
  await test('Apify Client', testApify)
  await test('Google Drive API', testGoogleDrive)
  await test('Resend Email API', testResend)

  console.log('\n' + '='.repeat(60))
  console.log('RESULTS:\n')

  let allPassed = true
  for (const r of results) {
    const icon = r.success ? '✅' : '❌'
    const timing = `${r.durationMs}ms`
    console.log(`${icon} ${r.name.padEnd(25)} ${timing.padStart(6)}  ${r.detail}`)
    if (!r.success) allPassed = false
  }

  console.log('\n' + '='.repeat(60))
  if (allPassed) {
    console.log('✅ All connections passing — Sprint 0 complete!\n')
  } else {
    console.log('❌ Some connections failed — check your .env.local values\n')
    process.exit(1)
  }
}

main().catch((e) => {
  console.error('Fatal error:', e)
  process.exit(1)
})
