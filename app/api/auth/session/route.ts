import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function POST(request: Request) {
  const body = await request.json()
  const { token, role, uid } = body

  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
  }

  if (role !== 'employee' && role !== 'manager') {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  if (!uid || typeof uid !== 'string') {
    return NextResponse.json({ error: 'Invalid uid' }, { status: 400 })
  }

  const cookieStore = await cookies()

  cookieStore.set('__session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })

  cookieStore.set('__role', role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })

  cookieStore.set('__uid', uid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('__session')
  cookieStore.delete('__role')
  cookieStore.delete('__uid')
  return NextResponse.json({ ok: true })
}
