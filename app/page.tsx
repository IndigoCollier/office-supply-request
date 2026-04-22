'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'

export default function RootPage() {
  const { userProfile, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (!userProfile) {
      router.replace('/login')
      return
    }
    if (userProfile.role === 'manager') {
      router.replace('/manager')
    } else {
      router.replace('/employee')
    }
  }, [userProfile, isLoading, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EEF1F8]">
      <span className="text-sm text-[#1B2B5E] opacity-50">Loading…</span>
    </div>
  )
}
