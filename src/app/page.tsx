'use client'

import { useState } from 'react'
import ScrapeForm from '@/components/ScrapeForm'
import ListingsTable from '@/components/ListingsTable'

export default function HomePage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">FramePostReady</h1>
            <p className="text-sm text-gray-500 mt-0.5">AI-powered listing content — Frame &amp; Form Studio</p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {showForm ? '✕ Close' : '+ New Listing'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-800 mb-5">New Listing</h2>
            <ScrapeForm />
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">All Listings</h2>
          <ListingsTable />
        </div>

      </div>
    </div>
  )
}
