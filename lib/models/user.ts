export type UserRole = 'employee' | 'manager'

export interface UserProfile {
  uid: string
  email: string
  role: UserRole
  displayName?: string
  createdAt: string
}
