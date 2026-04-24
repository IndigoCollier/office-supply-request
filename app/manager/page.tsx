'use client'

import { useEffect, useRef, useState } from 'react'
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

// Per OSRS-M2 and OSRS-M3: Fulfill is only available for approved requests.
// Pending/denied requests cannot be fulfilled. Approved requests cannot be re-approved.
const VALID_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  pending: ['approved', 'denied'],
  approved: ['denied', 'fulfilled'],
  denied: ['approved'],
  fulfilled: [],
}

type FilterValue = 'all' | RequestStatus

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

function DenyModal({
  req,
  onConfirm,
  onCancel,
}: {
  req: SupplyRequest
  onConfirm: (note: string | null) => void
  onCancel: () => void
}) {
  const [note, setNote] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{ background: 'rgba(10,15,30,0.42)', backdropFilter: 'blur(2px)' }}
      onClick={onCancel}
    >
      <div
        className="w-[90%] max-w-[460px] rounded-[14px] bg-white px-8 py-7"
        style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.20)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-3.5 text-[17px] font-bold text-[#1B2B5E]">
          Deny this request
        </h3>
        <p className="mb-4 text-[14px] leading-relaxed text-[#666]">
          Denying <strong className="text-[#0F0F0F]">{req.item}</strong> ×
          {req.quantity} from{' '}
          <strong className="text-[#0F0F0F]">{req.employeeEmail}</strong>.
        </p>

        <label className="mb-1.5 block text-[13px] font-medium text-[#0F0F0F]">
          Reason <span className="font-normal text-[#bbb]">(optional)</span>
        </label>
        <textarea
          ref={textareaRef}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Let the employee know why this was denied…"
          rows={3}
          className="w-full resize-y rounded-[8px] border border-[#D1D5DB] px-3 py-2.5 text-[13px] text-[#0F0F0F] placeholder-[#bbb] focus:outline-none focus:ring-2 focus:ring-[#4A90D9]"
        />

        <div className="mt-4 flex gap-2.5">
          <button
            onClick={onCancel}
            className="flex-1 rounded-[8px] border border-[#D1D5DB] bg-[#F4F6FA] py-2.5 text-[13px] font-semibold text-[#555] hover:bg-[#EBEEF5]"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(note.trim() || null)}
            className="flex-1 rounded-[8px] border-none py-2.5 text-[13px] font-semibold text-white"
            style={{ background: '#991B1B' }}
          >
            Deny request
          </button>
        </div>
      </div>
    </div>
  )
}

function RequestCard({
  req,
  updatingId,
  onApprove,
  onDenyClick,
  onFulfill,
}: {
  req: SupplyRequest
  updatingId: string | null
  onApprove: (id: string) => void
  onDenyClick: (req: SupplyRequest) => void
  onFulfill: (id: string) => void
}) {
  const isBusy = updatingId === req.id

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
          <div className="text-[14px] font-semibold text-[#0F0F0F]">
            {req.item}
          </div>
          <div className="mt-0.5 text-[12px] text-[#999]">
            {req.employeeEmail} · Qty: {req.quantity}
          </div>
        </div>
        <StatusBadge status={req.status} />
      </div>

      {req.reason && (
        <p className="mt-2 text-[13px] leading-relaxed text-[#555]">
          {req.reason}
        </p>
      )}

      {req.denialNote && (
        <div
          className="mt-2 rounded-[6px] px-3 py-1.5 text-[12px] leading-snug text-[#991B1B]"
          style={{ background: '#FEF2F2' }}
        >
          <strong>Note:</strong> {req.denialNote}
        </div>
      )}

      <div className="mt-0.5 text-[11px] text-[#bbb]">
        {new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).format(new Date(req.createdAt))}
      </div>

      {VALID_TRANSITIONS[req.status].length > 0 && (
        <div className="mt-3 flex gap-2">
          {VALID_TRANSITIONS[req.status].map((nextStatus) => {
            if (nextStatus === 'approved')
              return (
                <button
                  key="approved"
                  disabled={isBusy}
                  onClick={() => onApprove(req.id)}
                  className="rounded-[6px] border-none bg-[#1B2B5E] px-3 py-1 text-[12px] font-semibold text-white disabled:opacity-50"
                >
                  {isBusy ? '…' : 'Approve'}
                </button>
              )
            if (nextStatus === 'denied')
              return (
                <button
                  key="denied"
                  disabled={isBusy}
                  onClick={() => onDenyClick(req)}
                  className="rounded-[6px] px-3 py-1 text-[12px] font-semibold disabled:opacity-50"
                  style={{
                    background: '#FEE2E2',
                    color: '#991B1B',
                    border: '1px solid #FCA5A5',
                  }}
                >
                  {isBusy ? '…' : 'Deny'}
                </button>
              )
            if (nextStatus === 'fulfilled')
              return (
                <button
                  key="fulfilled"
                  disabled={isBusy}
                  onClick={() => onFulfill(req.id)}
                  className="rounded-[6px] px-3 py-1 text-[12px] font-semibold disabled:opacity-50"
                  style={{
                    background: '#BDE0FE',
                    color: '#1E3A5F',
                    border: '1px solid #93C5FD',
                  }}
                >
                  {isBusy ? '…' : 'Mark as fulfilled'}
                </button>
              )
            return null
          })}
        </div>
      )}
    </div>
  )
}

const FILTER_TABS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'denied', label: 'Denied' },
  { value: 'fulfilled', label: 'Fulfilled' },
]

export default function ManagerDashboard() {
  const [requests, setRequests] = useState<SupplyRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterValue>('all')
  const [denyTarget, setDenyTarget] = useState<SupplyRequest | null>(null)

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
                denialNote: status === 'denied' ? denialNote : r.denialNote,
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      )
    } catch (err) {
      console.error('[manager dashboard] failed to update request status', err)
      setActionError('Failed to update request. Please try again.')
    } finally {
      setUpdatingId(null)
    }
  }

  function handleDenyConfirm(note: string | null) {
    if (!denyTarget) return
    handleStatusUpdate(denyTarget.id, 'denied', note ?? undefined)
    setDenyTarget(null)
  }

  const counts: Record<FilterValue, number> = {
    all: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    denied: requests.filter((r) => r.status === 'denied').length,
    fulfilled: requests.filter((r) => r.status === 'fulfilled').length,
  }

  const visibleRequests = (
    filter === 'all' ? requests : requests.filter((r) => r.status === filter)
  ).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="min-h-[calc(100vh-54px)] bg-[#EEF1F8] px-6 py-7">
      <div className="mx-auto max-w-[980px]">
        <div className="mb-5">
          <h1 className="text-[24px] font-bold text-[#1B2B5E]">
            Request Queue
          </h1>
          <p className="mt-1 text-[14px] text-[#777]">
            Review and act on all submitted supply requests.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="mb-5 flex flex-wrap gap-1.5">
          {FILTER_TABS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className="rounded-full border-none px-3.5 py-1.5 text-[12px] font-semibold"
              style={{
                background: filter === value ? '#1B2B5E' : '#E4E8F0',
                color: filter === value ? '#fff' : '#666',
                cursor: 'pointer',
              }}
            >
              {label} <span style={{ opacity: 0.65 }}>({counts[value]})</span>
            </button>
          ))}
        </div>

        {actionError && (
          <p className="mb-4 text-[13px] text-red-700">{actionError}</p>
        )}

        {isLoading && <p className="text-[13px] text-[#999]">Loading…</p>}
        {fetchError && <p className="text-[13px] text-red-700">{fetchError}</p>}

        {!isLoading && !fetchError && visibleRequests.length === 0 && (
          <div className="py-[60px] text-center">
            <p className="text-[15px] font-medium text-[#bbb]">
              No requests to show.
            </p>
          </div>
        )}

        {!isLoading && !fetchError && visibleRequests.length > 0 && (
          <div className="flex flex-col gap-3">
            {visibleRequests.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                updatingId={updatingId}
                onApprove={(id) => handleStatusUpdate(id, 'approved')}
                onDenyClick={setDenyTarget}
                onFulfill={(id) => handleStatusUpdate(id, 'fulfilled')}
              />
            ))}
          </div>
        )}
      </div>

      {denyTarget && (
        <DenyModal
          req={denyTarget}
          onConfirm={handleDenyConfirm}
          onCancel={() => setDenyTarget(null)}
        />
      )}
    </div>
  )
}
