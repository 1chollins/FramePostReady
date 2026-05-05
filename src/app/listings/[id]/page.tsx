'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ContentViewer from '@/components/ContentViewer'
import type { Listing } from '@/types/listing'

function ExportEmailModal({ listingId, onClose }: { listingId: string; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, recipientEmail: email }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Send failed')
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Send failed')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Email Content Pack</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        {sent ? (
          <div className="text-center py-4 space-y-2">
            <p className="text-2xl">✅</p>
            <p className="text-sm font-medium text-gray-900">Content pack sent!</p>
            <p className="text-xs text-gray-400">Check inbox at {email}</p>
            <button onClick={onClose} className="mt-2 text-sm text-blue-600 underline">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Recipient email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={sending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              {sending ? '⏳ Sending...' : '📧 Send Content Pack'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const listingId = params.id as string

  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [showEmailModal, setShowEmailModal] = useState(false)

  useEffect(() => {
    async function fetchListing() {
      try {
        const res = await fetch(`/api/listings/${listingId}`)
        const json = await res.json()
        if (!json.success) throw new Error(json.error || 'Not found')
        setListing(json.data)
      } catch {
        router.push('/')
      } finally {
        setLoading(false)
      }
    }
    fetchListing()
  }, [listingId, router])

  async function handleGenerateAll() {
    setGenerating(true)
    setGenError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Generation failed')
    } catch (err) {
      setGenError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setGenerating(false)
      setRefreshKey((k) => k + 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
        Loading listing...
      </div>
    )
  }

  if (!listing) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            ← All Listings
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href={`/listings/${listingId}/export`}
              target="_blank"
              className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              🖨️ Print PDF
            </Link>
            <button
              onClick={() => setShowEmailModal(true)}
              className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              📧 Email Pack
            </button>
          </div>
        </div>
        {showEmailModal && <ExportEmailModal listingId={listingId} onClose={() => setShowEmailModal(false)} />}

        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{listing.address}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{listing.city}{listing.county ? `, ${listing.county}` : ''}{listing.zip ? ` ${listing.zip}` : ''}</p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              listing.contentStatus === 'Content Ready' ? 'bg-emerald-100 text-emerald-700' :
              listing.contentStatus === 'Generating' ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {listing.contentStatus}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-gray-100">
            <Stat label="Price" value={`$${listing.price.toLocaleString()}`} />
            <Stat label="Beds / Baths" value={`${listing.beds} / ${listing.baths}`} />
            <Stat label="Sqft" value={listing.sqft.toLocaleString()} />
            <Stat label="Type" value={listing.propertyType} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
            <Stat label="Tone" value={listing.tone} />
            {listing.targetBuyer && <Stat label="Target Buyer" value={listing.targetBuyer} />}
            {listing.emailType && <Stat label="Email Type" value={listing.emailType} />}
          </div>

          {listing.swflKeywordsMatched.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1.5">SWFL Keywords Matched</p>
              <div className="flex flex-wrap gap-1.5">
                {listing.swflKeywordsMatched.map((kw) => (
                  <span key={kw} className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {genError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {genError}
          </div>
        )}

        <ContentViewer
          listingId={listingId}
          onGenerateAll={handleGenerateAll}
          generating={generating}
          refreshKey={refreshKey}
        />

      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-900 mt-0.5">{value}</p>
    </div>
  )
}
