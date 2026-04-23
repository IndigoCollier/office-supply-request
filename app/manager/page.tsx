'use client'

import { useEffect, useState } from 'react'
import type { SupplyRequest, RequestStatus } from '@/lib/models/request'

const STATUS_STYLES: Record<RequestStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  denied: 'bg-red-100 text-red-800',
  fulfilled: 'bg-blue-100 text-blue-800',
}

// Per OSRS-M2 and OSRS-M3: Fulfill is only available for approved requests.
// Pending/denied requests cannot be fulfilled. Approved requests cannot be re-approved.
const VALID_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  pending: ['approved', 'denied'],
  approved: ['denied', 'fulfilled'],
  denied: ['approved'],
  fulfilled: [],
}

const ACTION_LABELS: Record<RequestStatus, string> = {
  approved: 'Approve',
  denied: 'Deny',
  fulfilled: 'Fulfill',
  pending: '',
}

export default function ManagerDashboard() {
  const [requests, setRequests] = useState<SupplyRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [denialNotes, setDenialNotes] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadRequests() {
      try {
        const res = await fetch('/api/requests')
        if (!res.ok) throw new Error(`Failed to load requests: ${res.status}`)
        const data = await res.json()
        setRequests(data.requests)
      } catch (err) {
        console.error('[manager dashboard] failed to load requests', err)
        setFetchError('Could not load requests. Please refresh.')
      } finally {
        setIsLoading(false)
      }
    }

    loadRequests()
  }, [])

  async function handleStatusUpdate(
    requestId: string,
    status: RequestStatus,
    denialNote?: string
  ) {
    setUpdatingId(requestId)
    setActionError(null)

    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, denialNote }),
      })

      if (!res.ok) throw new Error(`Update failed: ${res.status}`)

      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? {
                ...r,
                status,
                denialNote: status === 'denied' ? denialNote : undefined,
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      )
      // Clear the denial note input after a successful deny action
      if (status === 'denied') {
        setDenialNotes((prev) => ({ ...prev, [requestId]: '' }))
      }
    } catch (err) {
      console.error('[manager dashboard] failed to update request status', err)
      setActionError('Failed to update request. Please try again.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#EEF1F8] px-6 py-10">
      <div className="mx-auto max-w-[720px]">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-[24px] font-bold text-[#1B2B5E]">
            Request Queue
          </h1>
          <p className="mt-1 text-[14px] text-[#777]">
            Review and act on all submitted supply requests.
          </p>
        </div>

        {/* Action error */}
        {actionError && (
          <p className="mb-4 text-[13px] text-red-700">{actionError}</p>
        )}

        {/* Request list */}
        {isLoading && <p className="text-[13px] text-[#999]">Loading…</p>}

        {fetchError && <p className="text-[13px] text-red-700">{fetchError}</p>}

        {!isLoading && !fetchError && requests.length === 0 && (
          <p className="text-[13px] text-[#999]">No requests submitted yet.</p>
        )}

        {!isLoading && !fetchError && requests.length > 0 && (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="rounded-[10px] bg-white px-5 py-4"
                style={{ boxShadow: '0 2px 12px rgba(27,43,94,0.07)' }}
              >
                {/* Top row */}
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

                {/* Meta */}
                <p className="mt-1 text-[12px] text-[#999]">
                  {req.employeeEmail} &middot; Qty: {req.quantity} &middot;{' '}
                  {new Date(req.createdAt).toLocaleDateString()}
                </p>

                {req.reason && (
                  <p className="mt-1 text-[12px] text-[#555]">{req.reason}</p>
                )}

                {req.denialNote && (
                  <p className="mt-1 text-[12px] text-red-600">
                    Denial note: {req.denialNote}
                  </p>
                )}

                {/* Actions — driven by valid transitions per spec OSRS-M2, OSRS-M3 */}
                {VALID_TRANSITIONS[req.status].length > 0 && (
                  <div className="mt-3 space-y-2">
                    {/* Denial note input — only shown when deny is a valid next action */}
                    {VALID_TRANSITIONS[req.status].includes('denied') && (
                      <input
                        type="text"
                        placeholder="Denial note (optional)"
                        value={denialNotes[req.id] ?? ''}
                        onChange={(e) =>
                          setDenialNotes((prev) => ({
                            ...prev,
                            [req.id]: e.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-[#DDE2EF] px-3 py-1.5 text-[12px] text-[#333] placeholder-[#bbb] focus:outline-none focus:ring-1 focus:ring-[#1B2B5E]"
                      />
                    )}

                    <div className="flex gap-2">
                      {VALID_TRANSITIONS[req.status].map((status) => (
                        <button
                          key={status}
                          disabled={updatingId === req.id}
                          onClick={() =>
                            handleStatusUpdate(
                              req.id,
                              status,
                              status === 'denied'
                                ? denialNotes[req.id]
                                : undefined
                            )
                          }
                          className="rounded-md bg-[#1B2B5E] px-3 py-1 text-[12px] font-semibold text-white hover:bg-[#162449] disabled:opacity-50"
                        >
                          {updatingId === req.id ? '…' : ACTION_LABELS[status]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
