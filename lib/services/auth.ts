import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { getUserProfile, createUserProfile } from '@/lib/repositories/users'
import type { UserProfile } from '@/lib/models/user'

export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ idToken: string; profile: UserProfile | null; uid: string }> {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  const idToken = await credential.user.getIdToken()
  const profile = await getUserProfile(credential.user.uid)
  return { idToken, profile, uid: credential.user.uid }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<{ idToken: string; profile: UserProfile }> {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  const profile: UserProfile = {
    uid: credential.user.uid,
    email,
    role: 'employee',
    displayName,
    createdAt: new Date().toISOString(),
  }
  await createUserProfile(profile)
  const idToken = await credential.user.getIdToken()
  return { idToken, profile }
}

export async function signOutUser(): Promise<void> {
  await signOut(auth)
}
