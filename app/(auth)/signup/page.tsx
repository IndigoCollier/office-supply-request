'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpWithEmail } from '@/lib/services/auth'
import { signUpFormSchema, type SignUpFormValues } from '@/lib/models/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function SignUpPage() {
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
  })

  async function onSubmit(values: SignUpFormValues) {
    setAuthError(null)
    try {
      const { idToken, profile } = await signUpWithEmail(
        values.email,
        values.password,
        values.displayName
      )

      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken, role: profile.role }),
      })

      // Full page load so middleware sees the session cookie on a fresh request.
      // replace() so the signup page isn't in the back-button history.
      window.location.replace('/employee')
    } catch (err: unknown) {
      console.error('[signup] account creation failed', err)
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        err.code === 'auth/email-already-in-use'
      ) {
        setAuthError('An account with this email already exists.')
      } else {
        setAuthError('Something went wrong. Please try again.')
      }
    }
  }

  return (
    <div
      className="w-full max-w-[380px] rounded-[14px] bg-white px-10 pb-8 pt-10"
      style={{ boxShadow: '0 4px 32px rgba(27,43,94,0.11)' }}
    >
      <div className="mb-7 text-center">
        <div className="text-[22px] font-bold tracking-tight text-[#1B2B5E]">
          Banyan Labs
        </div>
        <div className="mt-1 text-[13px] text-[#999]">
          Office Supply Requests
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4">
          <Label
            htmlFor="displayName"
            className="mb-1.5 block text-[13px] font-medium text-[#0F0F0F]"
          >
            Full name
          </Label>
          <Input
            id="displayName"
            type="text"
            placeholder="Jane Smith"
            {...register('displayName')}
            aria-invalid={!!errors.displayName}
          />
          {errors.displayName && (
            <p className="mt-1 text-[12px] text-red-700">
              {errors.displayName.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <Label
            htmlFor="email"
            className="mb-1.5 block text-[13px] font-medium text-[#0F0F0F]"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@banyan.com"
            {...register('email')}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="mt-1 text-[12px] text-red-700">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="mb-5">
          <Label
            htmlFor="password"
            className="mb-1.5 block text-[13px] font-medium text-[#0F0F0F]"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Min. 6 characters"
            {...register('password')}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="mt-1 text-[12px] text-red-700">
              {errors.password.message}
            </p>
          )}
        </div>

        {authError && (
          <p className="mb-3 text-[12px] text-red-700">{authError}</p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#1B2B5E] text-[14px] font-semibold hover:bg-[#162449]"
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-5 text-center text-[13px] text-[#999]">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-[#4A90D9] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
