import { describe, expect, it } from 'vitest'
import { hasAuthResponseHash } from './authUrl'

describe('auth response URL', () => {
  it('recognizes OAuth responses that should be removed from the address bar', () => {
    expect(hasAuthResponseHash('#access_token=token&refresh_token=refresh')).toBe(true)
    expect(hasAuthResponseHash('#code=oauth-code')).toBe(true)
    expect(hasAuthResponseHash('#error=access_denied')).toBe(true)
    expect(hasAuthResponseHash('')).toBe(false)
  })
})
