import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  submitRequest,
  fetchEmployeeRequests,
  fetchAllRequests,
  updateStatus,
} from './requests'

vi.mock('@/lib/repositories/requests', () => ({
  createRequest: vi.fn(),
  getRequestsByEmployee: vi.fn(),
  getAllRequests: vi.fn(),
  updateRequestStatus: vi.fn(),
}))

import {
  createRequest,
  getRequestsByEmployee,
  getAllRequests,
  updateRequestStatus,
} from '@/lib/repositories/requests'

const EMPLOYEE_ID = 'user-123'
const EMPLOYEE_EMAIL = 'employee@test.com'
const FORM_VALUES = {
  item: 'Sticky notes',
  quantity: 3,
  reason: 'Running low on supply',
}

describe('submitRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the new request id from the repository', async () => {
    vi.mocked(createRequest).mockResolvedValue('req-abc')

    const id = await submitRequest(EMPLOYEE_ID, EMPLOYEE_EMAIL, FORM_VALUES)

    expect(id).toBe('req-abc')
  })

  it('sets status to pending', async () => {
    vi.mocked(createRequest).mockResolvedValue('req-abc')

    await submitRequest(EMPLOYEE_ID, EMPLOYEE_EMAIL, FORM_VALUES)

    expect(createRequest).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'pending' })
    )
  })

  it('passes employeeId and employeeEmail to the repository', async () => {
    vi.mocked(createRequest).mockResolvedValue('req-abc')

    await submitRequest(EMPLOYEE_ID, EMPLOYEE_EMAIL, FORM_VALUES)

    expect(createRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        employeeId: EMPLOYEE_ID,
        employeeEmail: EMPLOYEE_EMAIL,
      })
    )
  })

  it('passes form field values to the repository', async () => {
    vi.mocked(createRequest).mockResolvedValue('req-abc')

    await submitRequest(EMPLOYEE_ID, EMPLOYEE_EMAIL, FORM_VALUES)

    expect(createRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        item: 'Sticky notes',
        quantity: 3,
        reason: 'Running low on supply',
      })
    )
  })

  it('sets createdAt and updatedAt to the same ISO timestamp', async () => {
    vi.mocked(createRequest).mockResolvedValue('req-abc')

    await submitRequest(EMPLOYEE_ID, EMPLOYEE_EMAIL, FORM_VALUES)

    const call = vi.mocked(createRequest).mock.calls[0][0]
    expect(call.createdAt).toBe(call.updatedAt)
    expect(() => new Date(call.createdAt)).not.toThrow()
  })

  it('propagates repository errors to the caller', async () => {
    vi.mocked(createRequest).mockRejectedValue(
      new Error('firestore/unavailable')
    )

    await expect(
      submitRequest(EMPLOYEE_ID, EMPLOYEE_EMAIL, FORM_VALUES)
    ).rejects.toThrow('firestore/unavailable')
  })
})

const mockRequests = [
  {
    id: 'req-abc',
    employeeId: EMPLOYEE_ID,
    employeeEmail: EMPLOYEE_EMAIL,
    item: 'Sticky notes',
    quantity: 3,
    reason: 'Running low on supply',
    status: 'pending' as const,
    createdAt: '2026-04-22T00:00:00.000Z',
    updatedAt: '2026-04-22T00:00:00.000Z',
  },
]

describe('fetchEmployeeRequests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the requests from the repository', async () => {
    vi.mocked(getRequestsByEmployee).mockResolvedValue(mockRequests)

    const result = await fetchEmployeeRequests(EMPLOYEE_ID)

    expect(result).toEqual(mockRequests)
  })

  it('calls getRequestsByEmployee with the correct employeeId', async () => {
    vi.mocked(getRequestsByEmployee).mockResolvedValue([])

    await fetchEmployeeRequests(EMPLOYEE_ID)

    expect(getRequestsByEmployee).toHaveBeenCalledWith(EMPLOYEE_ID)
  })

  it('returns an empty array when the employee has no requests', async () => {
    vi.mocked(getRequestsByEmployee).mockResolvedValue([])

    const result = await fetchEmployeeRequests(EMPLOYEE_ID)

    expect(result).toEqual([])
  })

  it('propagates repository errors to the caller', async () => {
    vi.mocked(getRequestsByEmployee).mockRejectedValue(
      new Error('firestore/unavailable')
    )

    await expect(fetchEmployeeRequests(EMPLOYEE_ID)).rejects.toThrow(
      'firestore/unavailable'
    )
  })
})

describe('fetchAllRequests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns all requests from the repository', async () => {
    vi.mocked(getAllRequests).mockResolvedValue(mockRequests)

    const result = await fetchAllRequests()

    expect(result).toEqual(mockRequests)
  })

  it('returns an empty array when there are no requests', async () => {
    vi.mocked(getAllRequests).mockResolvedValue([])

    const result = await fetchAllRequests()

    expect(result).toEqual([])
  })

  it('propagates repository errors to the caller', async () => {
    vi.mocked(getAllRequests).mockRejectedValue(
      new Error('firestore/unavailable')
    )

    await expect(fetchAllRequests()).rejects.toThrow('firestore/unavailable')
  })
})

describe('updateStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(updateRequestStatus).mockResolvedValue(undefined)
  })

  it('calls updateRequestStatus with the request id and approved status', async () => {
    await updateStatus('req-abc', { status: 'approved' })

    expect(updateRequestStatus).toHaveBeenCalledWith(
      'req-abc',
      expect.objectContaining({ status: 'approved' })
    )
  })

  it('includes a denialNote when status is denied and note is provided', async () => {
    await updateStatus('req-abc', {
      status: 'denied',
      denialNote: 'Over budget',
    })

    expect(updateRequestStatus).toHaveBeenCalledWith(
      'req-abc',
      expect.objectContaining({ status: 'denied', denialNote: 'Over budget' })
    )
  })

  it('does not include denialNote when status is approved', async () => {
    await updateStatus('req-abc', {
      status: 'approved',
      denialNote: 'should be ignored',
    })

    const call = vi.mocked(updateRequestStatus).mock.calls[0][1]
    expect(call).not.toHaveProperty('denialNote')
  })

  it('sets updatedAt to a valid ISO timestamp', async () => {
    await updateStatus('req-abc', { status: 'fulfilled' })

    const call = vi.mocked(updateRequestStatus).mock.calls[0][1]
    expect(() => new Date(call.updatedAt)).not.toThrow()
  })

  it('propagates repository errors to the caller', async () => {
    vi.mocked(updateRequestStatus).mockRejectedValue(
      new Error('firestore/unavailable')
    )

    await expect(
      updateStatus('req-abc', { status: 'approved' })
    ).rejects.toThrow('firestore/unavailable')
  })
})
