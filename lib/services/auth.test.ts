import { describe, it, expect, vi, beforeEach } from 'vitest'
import { signInWithEmail, signUpWithEmail, signOutUser } from './auth'

vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('@/lib/firebase/config', () => ({
  auth: {},
}))

vi.mock('@/lib/repositories/users', () => ({
  getUserProfile: vi.fn(),
  createUserProfile: vi.fn(),
}))

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { getUserProfile, createUserProfile } from '@/lib/repositories/users'

const mockProfile = {
  uid: 'user-123',
  email: 'employee@test.com',
  role: 'employee' as const,
  createdAt: '2024-01-01T00:00:00.000Z',
}

const mockCredential = {
  user: {
    uid: 'user-123',
    getIdToken: vi.fn().mockResolvedValue('id-token-abc'),
  },
}

describe('signInWithEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls signInWithEmailAndPassword with correct args', async () => {
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue(
      mockCredential as unknown as Awaited<
        ReturnType<typeof signInWithEmailAndPassword>
      >
    )
    vi.mocked(getUserProfile).mockResolvedValue(mockProfile)

    await signInWithEmail('employee@test.com', 'password123')

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      {},
      'employee@test.com',
      'password123'
    )
  })

  it('returns idToken and profile on success', async () => {
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue(
      mockCredential as unknown as Awaited<
        ReturnType<typeof signInWithEmailAndPassword>
      >
    )
    vi.mocked(getUserProfile).mockResolvedValue(mockProfile)

    const result = await signInWithEmail('employee@test.com', 'password123')

    expect(result.idToken).toBe('id-token-abc')
    expect(result.profile).toEqual(mockProfile)
  })

  it('returns null profile when user has no Firestore record', async () => {
    vi.mocked(signInWithEmailAndPassword).mockResolvedValue(
      mockCredential as unknown as Awaited<
        ReturnType<typeof signInWithEmailAndPassword>
      >
    )
    vi.mocked(getUserProfile).mockResolvedValue(null)

    const result = await signInWithEmail('orphan@test.com', 'password123')

    expect(result.profile).toBeNull()
  })

  it('propagates Firebase errors to the caller', async () => {
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue(
      new Error('auth/wrong-password')
    )

    await expect(
      signInWithEmail('wrong@test.com', 'badpassword')
    ).rejects.toThrow('auth/wrong-password')
  })
})

describe('signUpWithEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a Firebase Auth account and Firestore profile', async () => {
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue(
      mockCredential as unknown as Awaited<
        ReturnType<typeof createUserWithEmailAndPassword>
      >
    )
    vi.mocked(createUserProfile).mockResolvedValue(undefined)

    await signUpWithEmail('new@test.com', 'password123', 'New User')

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      {},
      'new@test.com',
      'password123'
    )
    expect(createUserProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        uid: 'user-123',
        email: 'new@test.com',
        role: 'employee',
        displayName: 'New User',
      })
    )
  })

  it('returns idToken and profile with employee role', async () => {
    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue(
      mockCredential as unknown as Awaited<
        ReturnType<typeof createUserWithEmailAndPassword>
      >
    )
    vi.mocked(createUserProfile).mockResolvedValue(undefined)

    const result = await signUpWithEmail(
      'new@test.com',
      'password123',
      'New User'
    )

    expect(result.idToken).toBe('id-token-abc')
    expect(result.profile.role).toBe('employee')
  })
})

describe('signOutUser', () => {
  it('calls Firebase signOut', async () => {
    vi.mocked(signOut).mockResolvedValue(undefined)

    await signOutUser()

    expect(signOut).toHaveBeenCalledWith({})
  })
})
