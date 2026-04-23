import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import type { SupplyRequest } from '@/lib/models/request'

export async function createRequest(
  request: Omit<SupplyRequest, 'id'>
): Promise<string> {
  const ref = await addDoc(collection(db, 'requests'), request)
  return ref.id
}
