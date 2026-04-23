import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitRequest } from './requests'

vi.mock('@/lib/repositories/requests', () => ({
  createRequest: vi.fn(),
}))

import { createRequest } from '@/lib/repositories/requests'

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
