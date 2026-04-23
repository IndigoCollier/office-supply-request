import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createRequest,
  getRequestsByEmployee,
  getAllRequests,
  updateRequestStatus,
} from './requests'

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn(),
}))

vi.mock('@/lib/firebase/config', () => ({
  db: {},
}))

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore'

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

describe('getRequestsByEmployee', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(collection).mockReturnValue(
      'mock-collection-ref' as unknown as ReturnType<typeof collection>
    )
    vi.mocked(query).mockReturnValue(
      'mock-query' as unknown as ReturnType<typeof query>
    )
    vi.mocked(where).mockReturnValue(
      'mock-where' as unknown as ReturnType<typeof where>
    )
  })

  it('returns an empty array when there are no matching documents', async () => {
    vi.mocked(getDocs).mockResolvedValue({
      docs: [],
    } as unknown as Awaited<ReturnType<typeof getDocs>>)

    const result = await getRequestsByEmployee('user-123')

    expect(result).toEqual([])
  })

  it('returns mapped requests with id from document', async () => {
    vi.mocked(getDocs).mockResolvedValue({
      docs: [
        {
          id: 'req-abc',
          data: () => ({ ...mockRequest }),
        },
      ],
    } as unknown as Awaited<ReturnType<typeof getDocs>>)

    const result = await getRequestsByEmployee('user-123')

    expect(result).toEqual([{ id: 'req-abc', ...mockRequest }])
  })

  it('queries with the correct employeeId filter', async () => {
    vi.mocked(getDocs).mockResolvedValue({
      docs: [],
    } as unknown as Awaited<ReturnType<typeof getDocs>>)

    await getRequestsByEmployee('user-123')

    expect(where).toHaveBeenCalledWith('employeeId', '==', 'user-123')
  })

  it('propagates Firestore errors to the caller', async () => {
    vi.mocked(getDocs).mockRejectedValue(new Error('firestore/unavailable'))

    await expect(getRequestsByEmployee('user-123')).rejects.toThrow(
      'firestore/unavailable'
    )
  })
})

describe('getAllRequests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(collection).mockReturnValue(
      'mock-collection-ref' as unknown as ReturnType<typeof collection>
    )
  })

  it('returns an empty array when there are no documents', async () => {
    vi.mocked(getDocs).mockResolvedValue({
      docs: [],
    } as unknown as Awaited<ReturnType<typeof getDocs>>)

    const result = await getAllRequests()

    expect(result).toEqual([])
  })

  it('returns all documents mapped with their id', async () => {
    vi.mocked(getDocs).mockResolvedValue({
      docs: [
        { id: 'req-abc', data: () => ({ ...mockRequest }) },
        { id: 'req-def', data: () => ({ ...mockRequest, item: 'Pens' }) },
      ],
    } as unknown as Awaited<ReturnType<typeof getDocs>>)

    const result = await getAllRequests()

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ id: 'req-abc', ...mockRequest })
    expect(result[1]).toEqual({ id: 'req-def', ...mockRequest, item: 'Pens' })
  })

  it('queries the requests collection', async () => {
    vi.mocked(getDocs).mockResolvedValue({
      docs: [],
    } as unknown as Awaited<ReturnType<typeof getDocs>>)

    await getAllRequests()

    expect(collection).toHaveBeenCalledWith({}, 'requests')
  })

  it('propagates Firestore errors to the caller', async () => {
    vi.mocked(getDocs).mockRejectedValue(new Error('firestore/unavailable'))

    await expect(getAllRequests()).rejects.toThrow('firestore/unavailable')
  })
})

describe('updateRequestStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(doc).mockReturnValue(
      'mock-doc-ref' as unknown as ReturnType<typeof doc>
    )
    vi.mocked(updateDoc).mockResolvedValue(undefined)
  })

  it('calls updateDoc with the correct document reference', async () => {
    await updateRequestStatus('req-abc', {
      status: 'approved',
      updatedAt: '2026-04-22T00:00:00.000Z',
    })

    expect(doc).toHaveBeenCalledWith({}, 'requests', 'req-abc')
    expect(updateDoc).toHaveBeenCalledWith('mock-doc-ref', {
      status: 'approved',
      updatedAt: '2026-04-22T00:00:00.000Z',
    })
  })

  it('includes denialNote when provided', async () => {
    await updateRequestStatus('req-abc', {
      status: 'denied',
      updatedAt: '2026-04-22T00:00:00.000Z',
      denialNote: 'Over budget',
    })

    expect(updateDoc).toHaveBeenCalledWith('mock-doc-ref', {
      status: 'denied',
      updatedAt: '2026-04-22T00:00:00.000Z',
      denialNote: 'Over budget',
    })
  })

  it('propagates Firestore errors to the caller', async () => {
    vi.mocked(updateDoc).mockRejectedValue(new Error('firestore/unavailable'))

    await expect(
      updateRequestStatus('req-abc', {
        status: 'approved',
        updatedAt: '2026-04-22T00:00:00.000Z',
      })
    ).rejects.toThrow('firestore/unavailable')
  })
})
