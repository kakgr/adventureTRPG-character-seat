import { describe, expect, it } from 'vitest'
import { hasAllowedAccess } from './accessRules'

describe('access rules', () => {
  it('allows only an explicit true result from the database', () => {
    expect(hasAllowedAccess(true)).toBe(true)
    expect(hasAllowedAccess(false)).toBe(false)
    expect(hasAllowedAccess(null)).toBe(false)
    expect(hasAllowedAccess('true')).toBe(false)
  })
})
