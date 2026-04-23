import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from './route'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('@/lib/repositories/users', () => ({
  getUserProfile: vi.fn(),
}))

vi.mock('@/lib/services/requests', () => ({
  submitRequest: vi.fn(),
  fetchEmployeeRequests: vi.fn(),
}))

import { cookies } from 'next/headers'
import { getUserProfile } from '@/lib/repositories/users'
import { submitRequest, fetchEmployeeRequests } from '@/lib/services/requests'

const mockCookieStore = (uid: string | undefined) => ({
  get: vi.fn((name: string) =>
    name === '__uid' && uid ? { value: uid } : undefined
  ),
})

const mockProfile = {
  uid: 'user-123',
  email: 'employee@test.com',
  role: 'employee' as const,
  createdAt: '2026-04-22T00:00:00.000Z',
}

const validBody = {
  item: 'Sticky notes',
  quantity: 3,
  reason: 'Running low on supply',
}

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const mockRequests = [
  {
    id: 'req-abc',
    employeeId: 'user-123',
    employeeEmail: 'employee@test.com',
    item: 'Sticky notes',
    quantity: 3,
    reason: 'Running low',
    status: 'pending' as const,
    createdAt: '2026-04-22T00:00:00.000Z',
    updatedAt: '2026-04-22T00:00:00.000Z',
  },
]

describe('GET /api/requests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when no uid cookie is present', async () => {
    vi.mocked(cookies).mockResolvedValue(
      mockCookieStore(undefined) as unknown as Awaited<
        ReturnType<typeof cookies>
      >
    )

    const res = await GET()

    expect(res.status).toBe(401)
  })

  it('returns the employee requests on success', async () => {
    vi.mocked(cookies).mockResolvedValue(
      mockCookieStore('user-123') as unknown as Awaited<
        ReturnType<typeof cookies>
      >
    )
    vi.mocked(fetchEmployeeRequests).mockResolvedValue(mockRequests)

    const res = await GET()
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.requests).toEqual(mockRequests)
  })

  it('calls fetchEmployeeRequests with the uid from the cookie', async () => {
    vi.mocked(cookies).mockResolvedValue(
      mockCookieStore('user-123') as unknown as Awaited<
        ReturnType<typeof cookies>
      >
    )
    vi.mocked(fetchEmployeeRequests).mockResolvedValue([])

    await GET()

    expect(fetchEmployeeRequests).toHaveBeenCalledWith('user-123')
  })

  it('returns 500 when fetchEmployeeRequests throws', async () => {
    vi.mocked(cookies).mockResolvedValue(
      mockCookieStore('user-123') as unknown as Awaited<
        ReturnType<typeof cookies>
      >
    )
    vi.mocked(fetchEmployeeRequests).mockRejectedValue(
      new Error('firestore/unavailable')
    )

    const res = await GET()

    expect(res.status).toBe(500)
  })
})

describe('POST /api/requests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when no uid cookie is present', async () => {
    vi.mocked(cookies).mockResolvedValue(
      mockCookieStore(undefined) as unknown as Awaited<
        ReturnType<typeof cookies>
      >
    )

    const res = await POST(makeRequest(validBody))

    expect(res.status).toBe(401)
  })

  it('returns 401 when user profile does not exist in Firestore', async () => {
    vi.mocked(cookies).mockResolvedValue(
      mockCookieStore('user-123') as unknown as Awaited<
        ReturnType<typeof cookies>
      >
    )
    vi.mocked(getUserProfile).mockResolvedValue(null)

    const res = await POST(makeRequest(validBody))

    expect(res.status).toBe(401)
  })

  it('returns 400 when request body fails validation', async () => {
    vi.mocked(cookies).mockResolvedValue(
      mockCookieStore('user-123') as unknown as Awaited<
        ReturnType<typeof cookies>
      >
    )
    vi.mocked(getUserProfile).mockResolvedValue(mockProfile)

    const res = await POST(makeRequest({ item: '', quantity: 0, reason: '' }))

    expect(res.status).toBe(400)
  })

  it('returns 201 with the new request id on success', async () => {
    vi.mocked(cookies).mockResolvedValue(
      mockCookieStore('user-123') as unknown as Awaited<
        ReturnType<typeof cookies>
      >
    )
    vi.mocked(getUserProfile).mockResolvedValue(mockProfile)
    vi.mocked(submitRequest).mockResolvedValue('req-abc')

    const res = await POST(makeRequest(validBody))
    const data = await res.json()

    expect(res.status).toBe(201)
    expect(data.id).toBe('req-abc')
  })

  it('calls submitRequest with the employee id, email, and form values', async () => {
    vi.mocked(cookies).mockResolvedValue(
      mockCookieStore('user-123') as unknown as Awaited<
        ReturnType<typeof cookies>
      >
    )
    vi.mocked(getUserProfile).mockResolvedValue(mockProfile)
    vi.mocked(submitRequest).mockResolvedValue('req-abc')

    await POST(makeRequest(validBody))

    expect(submitRequest).toHaveBeenCalledWith(
      'user-123',
      'employee@test.com',
      validBody
    )
  })

  it('returns 500 when submitRequest throws', async () => {
    vi.mocked(cookies).mockResolvedValue(
      mockCookieStore('user-123') as unknown as Awaited<
        ReturnType<typeof cookies>
      >
    )
    vi.mocked(getUserProfile).mockResolvedValue(mockProfile)
    vi.mocked(submitRequest).mockRejectedValue(
      new Error('firestore/unavailable')
    )

    const res = await POST(makeRequest(validBody))

    expect(res.status).toBe(500)
  })
})
