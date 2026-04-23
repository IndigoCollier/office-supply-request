import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createRequest } from './requests'

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
}))

vi.mock('@/lib/firebase/config', () => ({
  db: {},
}))

import { collection, addDoc } from 'firebase/firestore'

const mockRequest = {
  employeeId: 'user-123',
  employeeEmail: 'employee@test.com',
  item: 'Sticky notes',
  quantity: 3,
  reason: 'Running low',
  status: 'pending' as const,
  createdAt: '2026-04-22T00:00:00.000Z',
  updatedAt: '2026-04-22T00:00:00.000Z',
}

describe('createRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(collection).mockReturnValue(
      'mock-collection-ref' as unknown as ReturnType<typeof collection>
    )
  })

  it('returns the new document id', async () => {
    vi.mocked(addDoc).mockResolvedValue({ id: 'req-abc' } as unknown as Awaited<
      ReturnType<typeof addDoc>
    >)

    const id = await createRequest(mockRequest)

    expect(id).toBe('req-abc')
  })

  it('writes to the requests collection', async () => {
    vi.mocked(addDoc).mockResolvedValue({ id: 'req-abc' } as unknown as Awaited<
      ReturnType<typeof addDoc>
    >)

    await createRequest(mockRequest)

    expect(collection).toHaveBeenCalledWith({}, 'requests')
  })

  it('passes the full request object to addDoc', async () => {
    vi.mocked(addDoc).mockResolvedValue({ id: 'req-abc' } as unknown as Awaited<
      ReturnType<typeof addDoc>
    >)

    await createRequest(mockRequest)

    expect(addDoc).toHaveBeenCalledWith('mock-collection-ref', mockRequest)
  })

  it('propagates Firestore errors to the caller', async () => {
    vi.mocked(addDoc).mockRejectedValue(new Error('firestore/unavailable'))

    await expect(createRequest(mockRequest)).rejects.toThrow(
      'firestore/unavailable'
    )
  })
})
