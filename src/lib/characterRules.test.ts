import { describe, expect, it } from 'vitest'
import { DEFAULT_DATA } from '../constants/game'
import { calculateHp, calculateMp, isInitialDataValid, remainingSkillPoints, remainingStatPoints, sumSkillValues, updateStat } from './characterRules'
import type { CharacterData } from '../types/character'

const data = () => structuredClone(DEFAULT_DATA) as CharacterData

describe('character rules', () => {
  it('starts with six base stats and 18 remaining points', () => {
    const next = data()
    expect(remainingStatPoints(next.stats)).toBe(18)
    expect(isInitialDataValid(next)).toBe(false)
  })
  it('prevents stat values below one and budget overflow', () => {
    const next = data(); next.stats = { ...next.stats, vitality: 19 }
    expect(updateStat(next.stats, 'vitality', -30).vitality).toBe(1)
    expect(updateStat(next.stats, 'strength', 1, true)).toEqual(next.stats)
  })
  it('calculates derived values', () => {
    const next = data(); next.stats = { ...next.stats, vitality: 4, mental: 5 }
    expect(calculateHp(next.stats)).toBe(12); expect(calculateMp(next.stats)).toBe(15)
  })
  it('sums all common, specialized and custom skills', () => {
    const next = data(); next.skills.common.athletics = 40; next.skills.weapon.push({ id: '1', specialty: '剣', value: 70 }); next.skills.custom.push({ id: '2', name: '料理', value: 15 })
    expect(sumSkillValues(next.skills)).toBe(125); expect(remainingSkillPoints(next.skills)).toBe(275)
  })
})
