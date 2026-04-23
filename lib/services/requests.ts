import {
  createRequest,
  getRequestsByEmployee,
} from '@/lib/repositories/requests'
import type { RequestFormValues, SupplyRequest } from '@/lib/models/request'

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
