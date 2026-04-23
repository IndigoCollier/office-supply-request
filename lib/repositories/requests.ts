import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import type { SupplyRequest } from '@/lib/models/request'

export async function createRequest(
  request: Omit<SupplyRequest, 'id'>
): Promise<string> {
  const ref = await addDoc(collection(db, 'requests'), request)
  return ref.id
}

export async function getRequestsByEmployee(
  employeeId: string
): Promise<SupplyRequest[]> {
  const q = query(
    collection(db, 'requests'),
    where('employeeId', '==', employeeId)
  )
  const snap = await getDocs(q)
  return snap.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as SupplyRequest
  )
}
