import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { requestFormSchema } from '@/lib/models/request'
import { getUserProfile } from '@/lib/repositories/users'
import { submitRequest, fetchEmployeeRequests } from '@/lib/services/requests'

export async function GET() {
  const cookieStore = await cookies()
  const employeeId = cookieStore.get('__uid')?.value

  if (!employeeId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const requests = await fetchEmployeeRequests(employeeId)
    return NextResponse.json({ requests })
  } catch (err) {
    console.error('[GET /api/requests] failed to fetch requests', {
      employeeId,
      err,
    })
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const employeeId = cookieStore.get('__uid')?.value

  if (!employeeId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const profile = await getUserProfile(employeeId)
  if (!profile) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = requestFormSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const id = await submitRequest(employeeId, profile.email, parsed.data)
    return NextResponse.json({ id }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/requests] failed to submit request', {
      employeeId,
      err,
    })
    return NextResponse.json(
      { error: 'Failed to submit request' },
      { status: 500 }
    )
  }
}
