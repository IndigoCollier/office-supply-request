'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { signOutUser } from '@/lib/services/auth'

export default function AppNav() {
  const router = useRouter()
  const { userProfile } = useAuth()

  async function handleSignOut() {
    await signOutUser()
    await fetch('/api/auth/session', { method: 'DELETE' })
    router.replace('/login')
  }

  return (
    <header
      className="sticky top-0 z-[200] flex h-[54px] items-center justify-between bg-[#1B2B5E] px-7 text-white"
      style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.20)' }}
    >
      <div className="flex select-none items-center gap-3">
        <span className="text-[17px] font-bold tracking-[-0.01em]">
          Banyan Labs
        </span>
        <span className="text-[18px] opacity-25">|</span>
        <span className="text-[13px] font-normal opacity-65">
          Office Supplies
        </span>
      </div>

      {userProfile && (
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[13px] font-medium leading-tight">
              {userProfile.displayName}
            </div>
            <div className="text-[10px] uppercase tracking-[0.08em] opacity-55">
              {userProfile.role}
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-[6px] px-[14px] py-[5px] text-[12px] font-semibold text-white"
            style={{
              background: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.18)',
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  )
}
