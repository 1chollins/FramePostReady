'use client'

import { useState } from 'react'
import type { ScrapeResponse } from '@/types/api'
import type { ToneType, TargetBuyerType } from '@/types/listing'
import type { ContentType } from '@/types/content'

interface GenerateResult {
  contentTypesGenerated: ContentType[]
  totalCost: number
  totalTokensInput: number
  totalTokensOutput: number
  errors: Partial<Record<ContentType, string | null>>
}

type Step = 'idle' | 'scraping' | 'scraped' | 'generating' | 'done' | 'error'

export default function ScrapeForm() {
  const [url, setUrl] = useState('')
  const [tone, setTone] = useState<ToneType>('Neutral')
  const [targetBuyer, setTargetBuyer] = useState<TargetBuyerType | ''>('')
  const [specialNotes, setSpecialNotes] = useState('')
  const [step, setStep] = useState<Step>('idle')
  const [error, setError] = useState<string | null>(null)
  const [listing, setListing] = useState<(ScrapeResponse & { listingId: string }) | null>(null)
  const [generateResult, setGenerateResult] = useState<GenerateResult | null>(null)

  async function handleScrape(e: React.FormEvent) {
    e.preventDefault()
    setStep('scraping')
    setError(null)
    setListing(null)
    setGenerateResult(null)

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zillowUrl: url,
          tone,
          targetBuyer: targetBuyer || undefined,
          specialNotes: specialNotes || undefined,
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Scrape failed')
      setListing(json.data)
      setStep('scraped')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setStep('error')
    }
  }

  async function handleGenerate() {
    if (!listing) return
    setStep('generating')
    setError(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: listing.listingId }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Generation failed')
      setGenerateResult(json.data)
      setStep('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setStep('error')
    }
  }

  return (
    <div className="space-y-8">
      {/* Scrape Form */}
      <form onSubmit={handleScrape} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zillow Listing URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.zillow.com/homedetails/..."
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as ToneType)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {['Neutral', 'Luxury', 'Family-Friendly', 'Investor-Focused', 'First-Time Buyer'].map(
                (t) => <option key={t}>{t}</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Buyer</label>
            <select
              value={targetBuyer}
              onChange={(e) => setTargetBuyer(e.target.value as TargetBuyerType | '')}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Not specified</option>
              {['Relocator', 'Snowbird', 'First-Time Buyer', 'Investor', 'Downsizer', 'Upsizer', 'Military/VA'].map(
                (b) => <option key={b}>{b}</option>
              )}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Notes <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            rows={2}
            placeholder="e.g. New roof 2024, seller motivated, open house Saturday..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={step === 'scraping' || step === 'generating'}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
        >
          {step === 'scraping' ? '⏳ Scraping Zillow...' : '🔍 Scrape Listing'}
        </button>
      </form>

      {/* Error */}
      {step === 'error' && error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Scrape Result */}
      {listing && (step === 'scraped' || step === 'generating' || step === 'done') && (
        <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">✅ Listing Scraped</h2>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
              {listing.contentStatus}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Address</span>
              <p className="font-medium text-gray-900">{listing.address}</p>
            </div>
            <div>
              <span className="text-gray-500">City</span>
              <p className="font-medium text-gray-900">{listing.city}</p>
            </div>
            <div>
              <span className="text-gray-500">Price</span>
              <p className="font-medium text-gray-900">${listing.price.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-gray-500">Details</span>
              <p className="font-medium text-gray-900">
                {listing.beds}bd / {listing.baths}ba / {listing.sqft.toLocaleString()} sqft
              </p>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">SWFL Keywords Matched</span>
              <p className="font-medium text-gray-900">
                {listing.swflKeywordsMatched.length > 0
                  ? listing.swflKeywordsMatched.join(', ')
                  : 'None matched'}
              </p>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">Listing ID</span>
              <p className="font-mono text-xs text-gray-600">{listing.listingId}</p>
            </div>
          </div>

          {step !== 'done' && (
            <button
              onClick={handleGenerate}
              disabled={step === 'generating'}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              {step === 'generating' ? '⏳ Generating 6 content types...' : '✨ Generate All Content'}
            </button>
          )}
        </div>
      )}

      {/* Generate Result */}
      {generateResult && step === 'done' && (
        <div className="border border-emerald-200 rounded-xl p-5 bg-emerald-50 space-y-3">
          <h2 className="font-semibold text-gray-900">✅ Content Generated</h2>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-emerald-600">{generateResult.contentTypesGenerated.length}/6</p>
              <p className="text-gray-500 text-xs mt-1">Types Generated</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {(generateResult.totalTokensInput + generateResult.totalTokensOutput).toLocaleString()}
              </p>
              <p className="text-gray-500 text-xs mt-1">Total Tokens</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-purple-600">${generateResult.totalCost.toFixed(3)}</p>
              <p className="text-gray-500 text-xs mt-1">API Cost</p>
            </div>
          </div>

          <div className="space-y-1">
            {(Object.entries(generateResult.errors) as [ContentType, string | null][]).map(([type, err]) => (
              <div key={type} className="flex items-center gap-2 text-sm">
                <span>{err ? '❌' : '✅'}</span>
                <span className="font-medium">{type}</span>
                {err && <span className="text-red-600 text-xs">{err}</span>}
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500">
            Content saved to Airtable → Content table. View it there or build the dashboard in Sprint 9.
          </p>
        </div>
      )}
    </div>
  )
}
