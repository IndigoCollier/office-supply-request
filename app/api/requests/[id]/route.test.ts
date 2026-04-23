import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PATCH } from './route'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('@/lib/services/requests', () => ({
  updateStatus: vi.fn(),
}))

import { cookies } from 'next/headers'
import { updateStatus } from '@/lib/services/requests'

const mockCookieStore = (role: string | undefined) => ({
  get: vi.fn((name: string) =>
    name === '__role' && role ? { value: role } : undefined
  ),
})

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/requests/req-abc', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const validBody = { status: 'approved' }
const mockParams = Promise.resolve({ id: 'req-abc' })

describe('PATCH /api/requests/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 403 when the caller is not a manager', async () => {
    vi.mocked(cookies).mockResolvedValue(
      mockCookieStore('employee') as unknown as Awaited<
        ReturnType<typeof cookies>
      >
    )

    const res = await PATCH(makeRequest(validBody), { params: mockParams })

    expect(res.status).toBe(403)
  })

  it('returns 403 when no role cookie is present', async () => {
    vi.mocked(cookies).mockResolvedValue(
      mockCookieStore(undefined) as unknown as Awaited<
        ReturnType<typeof cookies>
      >
    )

    const res = await PATCH(makeRequest(validBody), { params: mockParams })

    expect(res.status).toBe(403)
  })

  it('returns 400 when status is not a valid value', async () => {
    vi.mocked(cookies).mockResolvedValue(
      mockCookieStore('manager') as unknown as Awaited<
        ReturnType<typeof cookies>
      >
    )

    const res = await PATCH(makeRequest({ status: 'pending' }), {
      params: mockParams,
    })

    expect(res.status).toBe(400)
  })

  it('returns 200 on a successful status update', async () => {
    vi.mocked(cookies).mockResolvedValue(
      mockCookieStore('manager') as unknown as Awaited<
        ReturnType<typeof cookies>
      >
    )
    vi.mocked(updateStatus).mockResolvedValue(undefined)

    const res = await PATCH(makeRequest(validBody), { params: mockParams })

    expect(res.status).toBe(200)
  })

  it('calls updateStatus with the request id and parsed values', async () => {
    vi.mocked(cookies).mockResolvedValue(
      mockCookieStore('manager') as unknown as Awaited<
        ReturnType<typeof cookies>
      >
    )
    vi.mocked(updateStatus).mockResolvedValue(undefined)

    await PATCH(makeRequest({ status: 'denied', denialNote: 'Over budget' }), {
      params: mockParams,
    })

    expect(updateStatus).toHaveBeenCalledWith('req-abc', {
      status: 'denied',
      denialNote: 'Over budget',
    })
  })

  it('returns 500 when updateStatus throws', async () => {
    vi.mocked(cookies).mockResolvedValue(
      mockCookieStore('manager') as unknown as Awaited<
        ReturnType<typeof cookies>
      >
    )
    vi.mocked(updateStatus).mockRejectedValue(
      new Error('firestore/unavailable')
    )

    const res = await PATCH(makeRequest(validBody), { params: mockParams })

    expect(res.status).toBe(500)
  })
})
