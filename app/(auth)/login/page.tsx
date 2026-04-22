'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInWithEmail } from '@/lib/services/auth'
import { loginFormSchema, type LoginFormValues } from '@/lib/models/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

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
      const { idToken, profile } = await signInWithEmail(
        values.email,
        values.password
      )

      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: idToken,
          role: profile?.role ?? 'employee',
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
            placeholder="••••••••"
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
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-5 text-center text-[13px] text-[#999]">
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="font-medium text-[#4A90D9] hover:underline"
        >
          Sign up
        </Link>
      </p>

      <div className="mt-5 border-t border-[#EEF1F5] pt-5">
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-[#bbb]">
          Demo accounts
        </p>
        {DEMO_ACCOUNTS.map((account) => (
          <button
            key={account.email}
            type="button"
            onClick={() => fillDemo(account.email, account.password)}
            className="mb-1.5 block w-full rounded-lg border border-[#E5E7EB] bg-[#F4F6FA] px-3.5 py-2 text-left text-[13px] font-medium text-[#1B2B5E] transition-colors hover:bg-[#EBF0F8]"
          >
            {account.label}
          </button>
        ))}
      </div>
    </div>
  )
}
