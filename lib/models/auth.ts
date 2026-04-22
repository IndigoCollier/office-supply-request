import { z } from 'zod'

export const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginFormValues = z.infer<typeof loginFormSchema>

export const signUpFormSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type SignUpFormValues = z.infer<typeof signUpFormSchema>
