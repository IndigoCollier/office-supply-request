'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpWithEmail } from '@/lib/services/auth'
import { signUpFormSchema, type SignUpFormValues } from '@/lib/models/auth'

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
        body: JSON.stringify({
          token: idToken,
          role: profile.role,
          uid: profile.uid,
        }),
      })

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

  const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '9px 12px',
    borderRadius: 8,
    fontSize: 14,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.18)',
    color: '#fff',
    outline: 'none',
  } as React.CSSProperties

  return (
    <div
      className="w-full max-w-[480px] rounded-[16px] px-12 pb-8 pt-10"
      style={{
        background: 'rgba(255,255,255,0.13)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(255,255,255,0.22)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
      }}
    >
      <div className="mb-6 text-center">
        <div className="text-[22px] font-bold tracking-tight text-white">
          Banyan Labs
        </div>
        <div
          className="mt-1 text-[13px]"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          Office Supply Requests
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4">
          <label
            htmlFor="displayName"
            className="mb-1.5 block text-[13px] font-medium"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Full name
          </label>
          <input
            id="displayName"
            type="text"
            placeholder="Jane Smith"
            {...register('displayName')}
            aria-invalid={!!errors.displayName}
            style={inputStyle}
          />
          {errors.displayName && (
            <p className="mt-1 text-[12px] text-red-300">
              {errors.displayName.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="mb-1.5 block text-[13px] font-medium"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@banyan.com"
            {...register('email')}
            aria-invalid={!!errors.email}
            style={inputStyle}
          />
          {errors.email && (
            <p className="mt-1 text-[12px] text-red-300">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="mb-5">
          <label
            htmlFor="password"
            className="mb-1.5 block text-[13px] font-medium"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Min. 6 characters"
            {...register('password')}
            aria-invalid={!!errors.password}
            style={inputStyle}
          />
          {errors.password && (
            <p className="mt-1 text-[12px] text-red-300">
              {errors.password.message}
            </p>
          )}
        </div>

        {authError && (
          <p className="mb-3 text-[12px] text-red-300">{authError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-[8px] py-[11px] text-[14px] font-bold disabled:opacity-70"
          style={{
            background: 'rgba(255,255,255,0.92)',
            color: '#1B2B5E',
            border: 'none',
            cursor: isSubmitting ? 'default' : 'pointer',
          }}
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p
        className="mt-5 text-center text-[13px]"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium hover:underline"
          style={{ color: '#7DB8F0' }}
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
