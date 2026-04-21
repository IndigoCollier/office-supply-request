import { describe, it, expect } from 'vitest'
import { requestFormSchema, statusUpdateSchema } from './request'

describe('requestFormSchema', () => {
  it('passes with valid input', () => {
    const result = requestFormSchema.safeParse({
      item: 'Sticky notes',
      quantity: 3,
      reason: 'Running low on supply',
    })
    expect(result.success).toBe(true)
  })

  it('coerces string quantity to number', () => {
    const result = requestFormSchema.safeParse({
      item: 'Pens',
      quantity: '5',
      reason: 'Need more pens',
    })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.quantity).toBe(5)
  })

  it('fails when item is empty', () => {
    const result = requestFormSchema.safeParse({
      item: '',
      quantity: 2,
      reason: 'Need supplies',
    })
    expect(result.success).toBe(false)
  })

  it('fails when reason is empty', () => {
    const result = requestFormSchema.safeParse({
      item: 'Stapler',
      quantity: 1,
      reason: '',
    })
    expect(result.success).toBe(false)
  })

  it('fails when quantity is 0', () => {
    const result = requestFormSchema.safeParse({
      item: 'Notebooks',
      quantity: 0,
      reason: 'Need notebooks',
    })
    expect(result.success).toBe(false)
  })

  it('fails when quantity is negative', () => {
    const result = requestFormSchema.safeParse({
      item: 'Notebooks',
      quantity: -1,
      reason: 'Need notebooks',
    })
    expect(result.success).toBe(false)
  })

  it('fails when quantity is not a number', () => {
    const result = requestFormSchema.safeParse({
      item: 'Pens',
      quantity: 'many',
      reason: 'Need pens',
    })
    expect(result.success).toBe(false)
  })

  it('fails when reason exceeds 500 characters', () => {
    const result = requestFormSchema.safeParse({
      item: 'Pens',
      quantity: 2,
      reason: 'a'.repeat(501),
    })
    expect(result.success).toBe(false)
  })
})

describe('statusUpdateSchema', () => {
  it('passes with status approved', () => {
    const result = statusUpdateSchema.safeParse({ status: 'approved' })
    expect(result.success).toBe(true)
  })

  it('passes with status denied', () => {
    const result = statusUpdateSchema.safeParse({ status: 'denied' })
    expect(result.success).toBe(true)
  })

  it('passes with status fulfilled', () => {
    const result = statusUpdateSchema.safeParse({ status: 'fulfilled' })
    expect(result.success).toBe(true)
  })

  it('fails when status is pending — managers cannot reset to pending', () => {
    const result = statusUpdateSchema.safeParse({ status: 'pending' })
    expect(result.success).toBe(false)
  })

  it('fails when status is an unrecognized value', () => {
    const result = statusUpdateSchema.safeParse({ status: 'processing' })
    expect(result.success).toBe(false)
  })

  it('passes with an optional denial note', () => {
    const result = statusUpdateSchema.safeParse({
      status: 'denied',
      denialNote: 'Item is out of budget this quarter.',
    })
    expect(result.success).toBe(true)
  })

  it('passes without a denial note', () => {
    const result = statusUpdateSchema.safeParse({ status: 'approved' })
    expect(result.success).toBe(true)
  })

  it('fails when denial note exceeds 500 characters', () => {
    const result = statusUpdateSchema.safeParse({
      status: 'denied',
      denialNote: 'a'.repeat(501),
    })
    expect(result.success).toBe(false)
  })
})
