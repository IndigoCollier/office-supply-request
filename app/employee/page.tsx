'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { SupplyRequest, RequestStatus } from '@/lib/models/request'

const STATUS_STYLES: Record<
  RequestStatus,
  { bg: string; text: string; label: string }
> = {
  pending: { bg: '#FFF3CD', text: '#92400E', label: 'Pending' },
  approved: { bg: '#C7F9CC', text: '#14532D', label: 'Approved' },
  denied: { bg: '#FEE2E2', text: '#991B1B', label: 'Denied' },
  fulfilled: { bg: '#BDE0FE', text: '#1E3A5F', label: 'Fulfilled' },
}

function StatusBadge({ status }: { status: RequestStatus }) {
  const s = STATUS_STYLES[status]
  return (
    <span
      className="inline-block whitespace-nowrap rounded-full text-[10px] font-bold uppercase tracking-[0.07em]"
      style={{ background: s.bg, color: s.text, padding: '3px 10px' }}
    >
      {s.label}
    </span>
  )
}

function RequestCard({ req }: { req: SupplyRequest }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasUpdate = new Date(req.updatedAt) > new Date(req.createdAt)

  const submittedLabel = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(req.createdAt))

  const updatedLabel = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(req.updatedAt))

  return (
    <div
      className="rounded-[10px] bg-white px-5 py-4"
      style={{
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        border: '1px solid #E4E8F0',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="text-[15px] font-semibold text-[#0F0F0F]">
            {req.item}
          </div>
          <div className="mt-0.5 text-[12px] text-[#999]">
            Qty: {req.quantity}
          </div>
        </div>
        <StatusBadge status={req.status} />
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <div className="text-[11px] text-[#bbb]">
          Submitted {submittedLabel}
          {hasUpdate && <span> · Updated {updatedLabel}</span>}
        </div>
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="p-0 text-[12px] font-medium text-[#4A90D9]"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {isExpanded ? 'Hide' : 'Details'}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-2.5 border-t border-[#F0F3F8] pt-2.5">
          <p className="text-[13px] leading-relaxed text-[#555]">
            <span className="font-semibold text-[#0F0F0F]">Reason: </span>
            {req.reason}
          </p>
          {req.status === 'denied' && req.denialNote && (
            <div
              className="mt-2.5 rounded-[8px] px-3 py-2"
              style={{ background: '#FEF2F2', borderLeft: '3px solid #FCA5A5' }}
            >
              <div className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.07em] text-[#991B1B]">
                Manager note
              </div>
              <div className="text-[13px] leading-relaxed text-[#7F1D1D]">
                {req.denialNote}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
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
    <div className="min-h-[calc(100vh-54px)] bg-[#EEF1F8] px-6 py-8">
      <div className="mx-auto max-w-[720px]">
        {/* Header row */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-[24px] font-bold leading-tight text-[#1B2B5E]">
              My Requests
            </h1>
            <p className="mt-1 text-[14px] text-[#777]">
              Track your submitted supply requests and their status.
            </p>
          </div>
          <Link
            href="/employee/request"
            className="mt-[3px] shrink-0 rounded-[8px] bg-[#1B2B5E] px-[18px] py-[9px] text-[13px] font-semibold text-white hover:bg-[#162449]"
          >
            + New request
          </Link>
        </div>

        {isLoading && <p className="text-[13px] text-[#999]">Loading…</p>}

        {fetchError && <p className="text-[13px] text-red-700">{fetchError}</p>}

        {!isLoading && !fetchError && requests.length === 0 && (
          <div className="py-[72px] text-center">
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              className="mx-auto mb-3.5 block opacity-25"
            >
              <rect
                x="7"
                y="4"
                width="30"
                height="36"
                rx="3"
                stroke="#1B2B5E"
                strokeWidth="2"
              />
              <line
                x1="13"
                y1="15"
                x2="31"
                y2="15"
                stroke="#1B2B5E"
                strokeWidth="1.5"
              />
              <line
                x1="13"
                y1="22"
                x2="31"
                y2="22"
                stroke="#1B2B5E"
                strokeWidth="1.5"
              />
              <line
                x1="13"
                y1="29"
                x2="24"
                y2="29"
                stroke="#1B2B5E"
                strokeWidth="1.5"
              />
            </svg>
            <p className="text-[15px] font-medium text-[#999]">
              You haven&apos;t submitted any requests yet.
            </p>
            <Link
              href="/employee/request"
              className="mt-3.5 inline-block rounded-[8px] bg-[#4A90D9] px-[22px] py-[9px] text-[13px] font-semibold text-white hover:opacity-90"
            >
              Submit your first request
            </Link>
          </div>
        )}

        {!isLoading && !fetchError && requests.length > 0 && (
          <div className="flex flex-col gap-2.5">
            {requests.map((req) => (
              <RequestCard key={req.id} req={req} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
