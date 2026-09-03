import { describe, expect, it } from 'vitest'
import { COMMON_SKILLS, COMMON_SKILL_GENRES, DEFAULT_DATA, SPECIALIZED_SKILLS, SPECIALIZED_SKILL_GENRES, STAT_DESCRIPTIONS, STAT_LABELS } from './game'

describe('skill catalog', () => {
  it('includes evasion as a common skill with a short usage hint', () => {
    expect(COMMON_SKILLS).toEqual(expect.arrayContaining([
      { id: 'evasion', label: '回避', hint: '攻撃をかわす' },
    ]))
  })

  it('includes magic as an addable skill category', () => {
    expect(SPECIALIZED_SKILLS).toEqual(expect.arrayContaining([
      { id: 'magic', label: '魔術' },
    ]))
    expect(DEFAULT_DATA.skills.magic).toEqual([])
  })

  it('defines an explanation for every displayed ability', () => {
    expect(Object.keys(STAT_DESCRIPTIONS)).toEqual(Object.keys(STAT_LABELS))
    expect(STAT_DESCRIPTIONS.vitality).toContain('生命力')
  })

  it('groups combat skills into the combat genre', () => {
    expect(COMMON_SKILL_GENRES.martialArts).toBe('combat')
    expect(COMMON_SKILL_GENRES.evasion).toBe('combat')
    expect(SPECIALIZED_SKILL_GENRES.weapon).toBe('combat')
    expect(SPECIALIZED_SKILL_GENRES.ranged).toBe('combat')
  })
})
