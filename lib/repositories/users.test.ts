import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getUserProfile, createUserProfile } from './users'

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
}))

vi.mock('@/lib/firebase/config', () => ({
  db: {},
}))

import { doc, getDoc, setDoc } from 'firebase/firestore'

describe('getUserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(doc).mockReturnValue(
      'mock-doc-ref' as unknown as ReturnType<typeof doc>
    )
  })

  it('returns null when document does not exist', async () => {
    vi.mocked(getDoc).mockResolvedValue({
      exists: () => false,
    } as unknown as Awaited<ReturnType<typeof getDoc>>)

    const result = await getUserProfile('user-123')

    expect(result).toBeNull()
  })

  it('returns UserProfile when document exists', async () => {
    const mockProfile = {
      uid: 'user-123',
      email: 'employee@test.com',
      role: 'employee',
      createdAt: '2024-01-01T00:00:00.000Z',
    }
    vi.mocked(getDoc).mockResolvedValue({
      exists: () => true,
      data: () => mockProfile,
    } as unknown as Awaited<ReturnType<typeof getDoc>>)

    const result = await getUserProfile('user-123')

    expect(result).toEqual(mockProfile)
  })

  it('queries the users collection with the correct uid', async () => {
    vi.mocked(getDoc).mockResolvedValue({
      exists: () => false,
    } as unknown as Awaited<ReturnType<typeof getDoc>>)

    await getUserProfile('user-abc')

    expect(doc).toHaveBeenCalledWith({}, 'users', 'user-abc')
  })
})

describe('createUserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(doc).mockReturnValue(
      'mock-doc-ref' as unknown as ReturnType<typeof doc>
    )
  })

  it('writes the profile to the users collection', async () => {
    vi.mocked(setDoc).mockResolvedValue(undefined)

    const profile = {
      uid: 'user-new',
      email: 'new@test.com',
      role: 'employee' as const,
      displayName: 'New User',
      createdAt: '2026-04-22T00:00:00.000Z',
    }

    await createUserProfile(profile)

    expect(setDoc).toHaveBeenCalledWith('mock-doc-ref', profile)
  })

  it('uses the profile uid as the document id', async () => {
    vi.mocked(setDoc).mockResolvedValue(undefined)

    const profile = {
      uid: 'user-new',
      email: 'new@test.com',
      role: 'employee' as const,
      createdAt: '2026-04-22T00:00:00.000Z',
    }

    await createUserProfile(profile)

    expect(doc).toHaveBeenCalledWith({}, 'users', 'user-new')
  })
})
