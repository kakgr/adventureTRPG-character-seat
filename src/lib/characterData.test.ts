import { describe, expect, it } from 'vitest'
import { normalizeCharacterData } from './characterData'

describe('character data normalization', () => {
  it('fills the new magic stat when loading an old six-stat record', () => {
    const result = normalizeCharacterData({
      stats: { vitality: 4, strength: 5, mental: 6, speed: 3 } as never,
      statBonuses: { mental: 2 } as never,
    })

    expect(result.stats).toEqual({ vitality: 4, strength: 5, magic: 1, speed: 3, mental: 6 })
    expect(result.statBonuses).toEqual({ vitality: 0, strength: 0, magic: 0, speed: 0, mental: 2 })
  })
})
