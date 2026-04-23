'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  requestFormSchema,
  type RequestFormValues,
  type RequestFormInput,
} from '@/lib/models/request'
import { useAuth } from '@/lib/hooks/useAuth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function RequestFormPage() {
  const router = useRouter()
  const { userProfile } = useAuth()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormInput, unknown, RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
  })

  async function onSubmit(values: RequestFormValues) {
    setSubmitError(null)
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`)
      }

      router.push('/employee')
    } catch (err) {
      console.error('[request form] submit failed', err)
      setSubmitError('Something went wrong. Please try again.')
    }
  }

  return (
    <div
      className="flex min-h-[calc(100vh-54px)] items-start justify-center px-6 py-11"
      style={{
        backgroundColor: '#FAFAF7',
        backgroundImage:
          'repeating-linear-gradient(transparent, transparent 27px, #C5DCF5 28px), linear-gradient(to right, transparent 59px, #E8A0A0 60px, transparent 61px)',
      }}
    >
      <div className="w-full max-w-[500px]">
        {/* Page heading + submitting-as pill */}
        <div className="mb-5">
          <h1 className="text-[22px] font-bold leading-tight text-[#1B2B5E]">
            New Supply Request
          </h1>
          {userProfile && (
            <p
              className="mt-1.5 inline-block rounded-[6px] text-[13px] font-medium text-[#1B2B5E]"
              style={{
                background: 'rgba(255,255,255,0.72)',
                padding: '3px 10px',
                backdropFilter: 'blur(2px)',
              }}
            >
              Submitting as {userProfile.displayName} · {userProfile.email}
            </p>
          )}
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="rounded-[12px] bg-white px-7 pb-6 pt-7"
          style={{
            boxShadow:
              '0 8px 40px rgba(27,43,94,0.22), 0 1px 4px rgba(27,43,94,0.10)',
            border: '2px solid rgba(27,43,94,0.18)',
          }}
        >
          <div className="mb-4">
            <Label
              htmlFor="item"
              className="mb-1.5 block text-[13px] font-medium text-[#0F0F0F]"
            >
              Item
            </Label>
            <Input
              id="item"
              type="text"
              placeholder="e.g. Sticky notes"
              {...register('item')}
              aria-invalid={!!errors.item}
            />
            {errors.item && (
              <p className="mt-1 text-[12px] text-red-700">
                {errors.item.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <Label
              htmlFor="quantity"
              className="mb-1.5 block text-[13px] font-medium text-[#0F0F0F]"
            >
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              placeholder="1"
              {...register('quantity')}
              aria-invalid={!!errors.quantity}
            />
            {errors.quantity && (
              <p className="mt-1 text-[12px] text-red-700">
                {errors.quantity.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <Label
              htmlFor="reason"
              className="mb-1.5 block text-[13px] font-medium text-[#0F0F0F]"
            >
              Reason
            </Label>
            <textarea
              id="reason"
              rows={4}
              placeholder="Why do you need this item?"
              {...register('reason')}
              aria-invalid={!!errors.reason}
              className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-[14px] shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            {errors.reason && (
              <p className="mt-1 text-[12px] text-red-700">
                {errors.reason.message}
              </p>
            )}
          </div>

          {submitError && (
            <p className="mb-4 text-[12px] text-red-700">{submitError}</p>
          )}

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => router.push('/employee')}
              className="flex-1 rounded-[8px] border border-[#D1D5DB] bg-[#F4F6FA] py-2.5 text-[13px] font-semibold text-[#555] hover:bg-[#EBEEF5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] rounded-[8px] bg-[#1B2B5E] py-2.5 text-[13px] font-semibold text-white hover:bg-[#162449] disabled:opacity-60"
            >
              {isSubmitting ? 'Submitting…' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
