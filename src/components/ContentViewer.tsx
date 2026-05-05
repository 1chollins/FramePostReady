'use client'

import { useCallback, useEffect, useState } from 'react'
import ContentCard from './ContentCard'
import type { ContentType } from '@/types/content'

interface ContentBlock {
  id: string
  contentType: ContentType
  generatedText: string
  version: number
}

interface ContentViewerProps {
  listingId: string
  onGenerateAll: () => void
  generating: boolean
  refreshKey?: number
}

const CONTENT_ORDER: ContentType[] = ['Instagram', 'Facebook', 'MLS', 'Email', 'Reel Script', 'Hashtags']

export default function ContentViewer({ listingId, onGenerateAll, generating, refreshKey }: ContentViewerProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContent = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/content?listingId=${listingId}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Failed to load content')
      setBlocks(json.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [listingId])

  useEffect(() => { fetchContent() }, [fetchContent])

  useEffect(() => {
    if (!generating) fetchContent()
  }, [generating, fetchContent])

  useEffect(() => {
    if (refreshKey && refreshKey > 0) fetchContent()
  }, [refreshKey, fetchContent])

  const blockMap = Object.fromEntries(blocks.map((b) => [b.contentType, b]))
  const hasContent = blocks.length > 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">Content Blocks</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {hasContent ? `${Object.keys(blockMap).length}/6 types generated` : 'No content yet'}
          </p>
        </div>
        <button
          onClick={onGenerateAll}
          disabled={generating}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {generating ? '⏳ Generating...' : hasContent ? '↺ Regenerate All' : '✨ Generate All Content'}
        </button>
      </div>

      {loading && (
        <div className="text-center py-12 text-gray-400 text-sm">Loading content...</div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}

      {!loading && !error && !hasContent && !generating && (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
          <p className="text-3xl mb-3">✨</p>
          <p className="text-sm font-medium">No content generated yet</p>
          <p className="text-xs mt-1">Click &quot;Generate All Content&quot; to get started</p>
        </div>
      )}

      {generating && blocks.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-emerald-200 rounded-xl text-emerald-500">
          <p className="text-3xl mb-3 animate-pulse">⏳</p>
          <p className="text-sm font-medium">Generating 6 content types...</p>
          <p className="text-xs mt-1 text-gray-400">This takes about 2 minutes</p>
        </div>
      )}

      {!loading && hasContent && (
        <div className="grid grid-cols-1 gap-4">
          {CONTENT_ORDER.map((type) => {
            const block = blockMap[type]
            if (!block) return (
              <div key={type} className="rounded-xl border border-dashed border-gray-200 p-5 text-sm text-gray-400 text-center">
                {type} — not generated
              </div>
            )
            return (
              <ContentCard
                key={block.id}
                contentType={block.contentType}
                body={block.generatedText}
                version={block.version}
                listingId={listingId}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
