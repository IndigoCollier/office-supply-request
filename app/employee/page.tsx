'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'

export default function EmployeeDashboard() {
  const { userProfile } = useAuth()

  return (
    <div className="min-h-screen bg-[#EEF1F8] px-6 py-10">
      <div className="mx-auto max-w-[640px]">
        <div className="mb-8">
          <h1 className="text-[22px] font-bold text-[#1B2B5E]">
            Welcome
            {userProfile?.displayName ? `, ${userProfile.displayName}` : ''}
          </h1>
          <p className="mt-1 text-[13px] text-[#999]">Office Supply Requests</p>
        </div>

        <Link
          href="/employee/request"
          className="inline-block rounded-lg bg-[#1B2B5E] px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-[#162449]"
        >
          New Request
        </Link>
      </div>
    </div>
  )
}
