'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInWithEmail } from '@/lib/services/auth'
import { loginFormSchema, type LoginFormValues } from '@/lib/models/auth'

const DEMO_ACCOUNTS = [
  {
    label: 'Employee account',
    email: 'employee@test.com',
    password: 'TestPass1!',
  },
  {
    label: 'Manager account',
    email: 'manager@test.com',
    password: 'TestPass1!',
  },
]

export default function LoginPage() {
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
  })

  async function onSubmit(values: LoginFormValues) {
    setAuthError(null)
    try {
      const { idToken, profile, uid } = await signInWithEmail(
        values.email,
        values.password
      )

      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: idToken,
          role: profile?.role ?? 'employee',
          uid,
        }),
      })

      // Full page load so middleware sees the session cookie on a fresh request.
      // replace() so the login page isn't in the back-button history.
      const destination = profile?.role === 'manager' ? '/manager' : '/employee'
      window.location.replace(destination)
    } catch (err) {
      console.error('[login] sign-in failed', err)
      setAuthError('Incorrect email or password.')
    }
  }

  function fillDemo(email: string, password: string) {
    setValue('email', email)
    setValue('password', password)
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
            placeholder="••••••••"
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
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p
        className="mt-5 text-center text-[13px]"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="font-medium hover:underline"
          style={{ color: '#7DB8F0' }}
        >
          Sign up
        </Link>
      </p>

      <div
        className="mt-5 pt-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}
      >
        <p
          className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: 'rgba(255,255,255,0.28)' }}
        >
          Demo accounts
        </p>
        {DEMO_ACCOUNTS.map((account) => (
          <button
            key={account.email}
            type="button"
            onClick={() => fillDemo(account.email, account.password)}
            className="mb-1.5 block w-full rounded-[8px] px-3.5 py-2 text-left text-[13px] font-medium"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.14)',
              color: 'rgba(255,255,255,0.75)',
              cursor: 'pointer',
            }}
          >
            {account.label}
          </button>
        ))}
      </div>
    </div>
  )
}
