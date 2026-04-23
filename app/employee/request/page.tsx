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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function RequestFormPage() {
  const router = useRouter()
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
    <div className="min-h-screen bg-[#EEF1F8] px-6 py-10">
      <div className="mx-auto max-w-[520px]">
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-[#1B2B5E]">
            New Supply Request
          </h1>
          <p className="mt-1 text-[13px] text-[#999]">
            Fill out the form below and submit for manager review.
          </p>
        </div>

        {/* Notebook paper card */}
        <div
          className="relative overflow-hidden rounded-[14px] bg-white py-8 pl-16 pr-10"
          style={{
            boxShadow: '0 4px 32px rgba(27,43,94,0.11)',
            backgroundImage:
              'repeating-linear-gradient(transparent, transparent 39px, #BFDBFE 39px, #BFDBFE 40px)',
            backgroundSize: '100% 40px',
            backgroundPositionY: '16px',
          }}
        >
          {/* Red margin line */}
          <div className="absolute bottom-0 left-12 top-0 w-[2px] bg-red-300" />

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-6">
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

            <div className="mb-6">
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

            <div className="mb-8">
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

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#1B2B5E] text-[14px] font-semibold hover:bg-[#162449]"
              >
                {isSubmitting ? 'Submitting…' : 'Submit Request'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push('/employee')}
                className="text-[14px] text-[#999]"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
