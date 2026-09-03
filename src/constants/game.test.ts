import { describe, expect, it } from 'vitest'
import { COMMON_SKILLS, DEFAULT_DATA, SPECIALIZED_SKILLS } from './game'

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
})
