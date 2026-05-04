'use client'

import { useState } from 'react'
import type { ContentType } from '@/types/content'

const TYPE_COLORS: Record<ContentType, string> = {
  Instagram:    'bg-pink-50 border-pink-200 text-pink-700',
  Facebook:     'bg-blue-50 border-blue-200 text-blue-700',
  MLS:          'bg-slate-50 border-slate-200 text-slate-700',
  Email:        'bg-amber-50 border-amber-200 text-amber-700',
  'Reel Script':'bg-purple-50 border-purple-200 text-purple-700',
  Hashtags:     'bg-emerald-50 border-emerald-200 text-emerald-700',
}

const TYPE_ICONS: Record<ContentType, string> = {
  Instagram:    '📸',
  Facebook:     '📘',
  MLS:          '🏠',
  Email:        '✉️',
  'Reel Script':'🎬',
  Hashtags:     '#️⃣',
}

interface ContentCardProps {
  contentType: ContentType
  body: string
  version: number
  listingId: string
  onRegenerated?: (newBody: string) => void
}

export default function ContentCard({ contentType, body, version, listingId, onRegenerated }: ContentCardProps) {
  const [copied, setCopied] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [currentBody, setCurrentBody] = useState(body)
  const [currentVersion, setCurrentVersion] = useState(version)
  const [expanded, setExpanded] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(currentBody)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleRegenerate() {
    setRegenerating(true)
    try {
      const encodedType = encodeURIComponent(contentType)
      const res = await fetch(`/api/generate/${encodedType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Regeneration failed')
      const newBody = json.data?.block?.generatedText || currentBody
      setCurrentBody(newBody)
      setCurrentVersion((v) => v + 1)
      onRegenerated?.(newBody)
    } catch (err) {
      console.error('Regenerate failed:', err)
    } finally {
      setRegenerating(false)
    }
  }

  const isLong = currentBody.length > 600
  const displayBody = isLong && !expanded ? currentBody.slice(0, 600) + '…' : currentBody

  return (
    <div className={`rounded-xl border p-5 space-y-3 ${TYPE_COLORS[contentType]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{TYPE_ICONS[contentType]}</span>
          <span className="font-semibold text-sm">{contentType}</span>
          <span className="text-xs opacity-60 font-normal">v{currentVersion}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="text-xs px-2.5 py-1 rounded-md bg-white/70 hover:bg-white border border-current/20 transition-colors font-medium"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="text-xs px-2.5 py-1 rounded-md bg-white/70 hover:bg-white border border-current/20 transition-colors font-medium disabled:opacity-50"
          >
            {regenerating ? '⏳' : '↺ Regen'}
          </button>
        </div>
      </div>

      <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed break-words">
        {displayBody}
      </pre>

      {isLong && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-xs opacity-60 hover:opacity-100 underline"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  )
}
