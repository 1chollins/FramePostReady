'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Listing } from '@/types/listing'

const STATUS_STYLES: Record<string, string> = {
  'Queued':          'bg-gray-100 text-gray-600',
  'Scraping':        'bg-yellow-100 text-yellow-700',
  'Scrape Complete': 'bg-blue-100 text-blue-700',
  'Scrape Failed':   'bg-red-100 text-red-700',
  'Generating':      'bg-yellow-100 text-yellow-700',
  'Content Ready':   'bg-emerald-100 text-emerald-700',
  'Delivered':       'bg-purple-100 text-purple-700',
  'Archived':        'bg-gray-100 text-gray-400',
}

export default function ListingsTable() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchListings() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/listings')
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Failed to load listings')
      setListings(json.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchListings() }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
        Loading listings...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
        {error}
        <button onClick={fetchListings} className="ml-3 underline">Retry</button>
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        No listings yet. Scrape your first one above.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Address</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">City</th>
            <th className="text-right px-4 py-3 font-medium text-gray-600">Price</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Created</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {listings.map((listing) => (
            <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">
                {listing.address}
              </td>
              <td className="px-4 py-3 text-gray-600">{listing.city}</td>
              <td className="px-4 py-3 text-right text-gray-900 font-medium">
                ${listing.price.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-gray-500">{listing.propertyType}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[listing.contentStatus] || 'bg-gray-100 text-gray-600'}`}>
                  {listing.contentStatus}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-400 text-xs">
                {new Date(listing.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/listings/${listing.id}`}
                  className="text-blue-600 hover:text-blue-700 font-medium text-xs"
                >
                  View →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
