import { describe, expect, it } from 'vitest'
import { getDisplayName } from './userDisplay'

describe('user display name', () => {
  it('prefers the Discord global name from custom claims', () => {
    expect(getDisplayName({ custom_claims: { global_name: 'かずたん' }, name: 'kakaki' })).toBe('かずたん')
  })

  it('falls back through safe names without exposing an email', () => {
    expect(getDisplayName({ full_name: '参加者A' })).toBe('参加者A')
    expect(getDisplayName({ email: 'private@example.com' })).toBe('プレイヤー')
    expect(getDisplayName(null)).toBe('プレイヤー')
  })
})
