import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { statusUpdateSchema } from '@/lib/models/request'
import { updateStatus } from '@/lib/services/requests'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const role = cookieStore.get('__role')?.value

  if (role !== 'manager') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()
  const parsed = statusUpdateSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    await updateStatus(id, parsed.data)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[PATCH /api/requests/[id]] failed to update status', {
      id,
      err,
    })
    return NextResponse.json(
      { error: 'Failed to update request' },
      { status: 500 }
    )
  }
}
