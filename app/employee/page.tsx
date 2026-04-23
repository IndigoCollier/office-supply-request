'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { SupplyRequest, RequestStatus } from '@/lib/models/request'

const STATUS_STYLES: Record<RequestStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-800',
  fulfilled: 'bg-blue-100 text-blue-800',
}

export default function EmployeeDashboard() {
  const [requests, setRequests] = useState<SupplyRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRequests() {
      try {
        const res = await fetch('/api/requests')
        if (!res.ok) throw new Error(`Failed to load requests: ${res.status}`)
        const data = await res.json()
        setRequests(data.requests)
      } catch (err) {
        console.error('[employee dashboard] failed to load requests', err)
        setFetchError('Could not load your requests. Please refresh.')
      } finally {
        setIsLoading(false)
      }
    }

    loadRequests()
  }, [])

  return (
    <div className="min-h-screen bg-[#EEF1F8] px-6 py-10">
      <div className="mx-auto max-w-[640px]">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-[24px] font-bold text-[#1B2B5E]">My Requests</h1>
          <p className="mt-1 text-[14px] text-[#777]">
            Track your submitted supply requests and their status.
          </p>
        </div>

        {/* New Request button */}
        <Link
          href="/employee/request"
          className="mb-8 inline-block rounded-lg bg-[#1B2B5E] px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-[#162449]"
        >
          New Request
        </Link>

        {/* Request list */}
        <div className="mt-8">
          <h2 className="mb-4 text-[15px] font-semibold text-[#1B2B5E]">
            Your Requests
          </h2>

          {isLoading && <p className="text-[13px] text-[#999]">Loading…</p>}

          {fetchError && (
            <p className="text-[13px] text-red-700">{fetchError}</p>
          )}

          {!isLoading && !fetchError && requests.length === 0 && (
            <p className="text-[13px] text-[#999]">
              No requests yet. Submit your first one above.
            </p>
          )}

          {!isLoading && !fetchError && requests.length > 0 && (
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-[10px] bg-white px-5 py-4"
                  style={{ boxShadow: '0 2px 12px rgba(27,43,94,0.07)' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold text-[#1B2B5E]">
                      {req.item}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLES[req.status]}`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] text-[#999]">
                    Qty: {req.quantity} &middot;{' '}
                    {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                  {req.reason && (
                    <p className="mt-1 text-[12px] text-[#555]">{req.reason}</p>
                  )}
                  {req.denialNote && (
                    <p className="mt-1 text-[12px] text-red-600">
                      Note: {req.denialNote}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
