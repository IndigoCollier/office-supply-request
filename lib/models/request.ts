import { z } from 'zod'

// The four states a request can be in — no other values are valid
export type RequestStatus = 'pending' | 'approved' | 'denied' | 'fulfilled'

// The full request record as stored in Firestore
export interface SupplyRequest {
  id: string
  employeeId: string
  employeeEmail: string
  item: string
  quantity: number
  reason: string
  status: RequestStatus
  createdAt: string
  updatedAt: string
  denialNote?: string
}

// Zod schema — validates the employee request form before it hits the API
export const requestFormSchema = z.object({
  item: z
    .string()
    .min(1, 'Item name is required')
    .max(100, 'Item name is too long'),
  quantity: z.coerce
    .number({ message: 'Quantity must be a number' })
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1'),
  reason: z
    .string()
    .min(1, 'Reason is required')
    .max(500, 'Reason must be under 500 characters'),
})

export type RequestFormValues = z.infer<typeof requestFormSchema>
// Input type reflects raw form field values before Zod coerces quantity to a number
export type RequestFormInput = z.input<typeof requestFormSchema>

// Zod schema — validates the status update payload from the manager
export const statusUpdateSchema = z.object({
  status: z.enum(['approved', 'denied', 'fulfilled']),
  denialNote: z.string().max(500).optional(),
})

export type StatusUpdateValues = z.infer<typeof statusUpdateSchema>
