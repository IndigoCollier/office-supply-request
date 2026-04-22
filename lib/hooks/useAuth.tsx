'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { getUserProfile } from '@/lib/repositories/users'
import type { UserProfile } from '@/lib/models/user'

interface AuthState {
  firebaseUser: User | null
  userProfile: UserProfile | null
  isLoading: boolean
}

interface AuthContextValue extends AuthState {
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    firebaseUser: null,
    userProfile: null,
    isLoading: true,
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ firebaseUser: null, userProfile: null, isLoading: false })
        return
      }
      const profile = await getUserProfile(user.uid)
      setState({ firebaseUser: user, userProfile: profile, isLoading: false })
    })
    return unsubscribe
  }, [])

  async function refreshProfile() {
    if (!state.firebaseUser) return
    const profile = await getUserProfile(state.firebaseUser.uid)
    setState((prev) => ({ ...prev, userProfile: profile }))
  }

  return (
    <AuthContext.Provider value={{ ...state, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
