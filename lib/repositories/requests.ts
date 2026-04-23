import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore'
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
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as SupplyRequest)
}

export async function getAllRequests(): Promise<SupplyRequest[]> {
  const snap = await getDocs(collection(db, 'requests'))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as SupplyRequest)
}

export async function updateRequestStatus(
  requestId: string,
  updates: { status: string; updatedAt: string; denialNote?: string }
): Promise<void> {
  await updateDoc(doc(db, 'requests', requestId), updates)
}
