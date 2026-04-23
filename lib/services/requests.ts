import {
  createRequest,
  getRequestsByEmployee,
  getAllRequests,
  updateRequestStatus,
} from '@/lib/repositories/requests'
import type {
  RequestFormValues,
  StatusUpdateValues,
  SupplyRequest,
} from '@/lib/models/request'

export async function submitRequest(
  employeeId: string,
  employeeEmail: string,
  values: RequestFormValues
): Promise<string> {
  const now = new Date().toISOString()
  const request: Omit<SupplyRequest, 'id'> = {
    employeeId,
    employeeEmail,
    item: values.item,
    quantity: values.quantity,
    reason: values.reason,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  }
  return createRequest(request)
}

export async function fetchEmployeeRequests(
  employeeId: string
): Promise<SupplyRequest[]> {
  return getRequestsByEmployee(employeeId)
}

export async function fetchAllRequests(): Promise<SupplyRequest[]> {
  return getAllRequests()
}

export async function updateStatus(
  requestId: string,
  values: StatusUpdateValues
): Promise<void> {
  const updates: { status: string; updatedAt: string; denialNote?: string } = {
    status: values.status,
    updatedAt: new Date().toISOString(),
  }
  // Only write denialNote when the request is denied — clear it otherwise
  if (values.status === 'denied' && values.denialNote) {
    updates.denialNote = values.denialNote
  }
  return updateRequestStatus(requestId, updates)
}
