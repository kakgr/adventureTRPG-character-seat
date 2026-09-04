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
    expect(result.skills.luck).toBe(0)
    expect(result.skills.bonuses.common.athletics).toBe(0)
  })

  it('normalizes luck to its 0 through 90 range', () => {
    expect(normalizeCharacterData({ skills: { luck: 120 } as never }).skills.luck).toBe(90)
  })

  it('normalizes skill bonuses independently from the 400-point allocation', () => {
    const result = normalizeCharacterData({ skills: { bonuses: { common: { search: 12 }, custom: { 'skill-1': 140 } } } } as never)

    expect(result.skills.bonuses.common.search).toBe(12)
    expect(result.skills.bonuses.custom['skill-1']).toBe(100)
  })

  it('preserves line breaks in item notes', () => {
    const result = normalizeCharacterData({ items: [{ id: 'item-1', name: '手帳', quantity: 1, description: '一行目\n二行目' }] } as never)

    expect(result.items[0].description).toBe('一行目\n二行目')
  })
})
