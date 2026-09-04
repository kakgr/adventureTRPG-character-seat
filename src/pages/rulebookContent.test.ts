import { describe, expect, it } from 'vitest'
import { insanityTable, playerTerm, rulebookSections, skillRules, statDefinitions } from './rulebookContent'

describe('rulebook content', () => {
  it('contains the first-edition core sections', () => {
    expect(rulebookSections.map((section) => section.id)).toEqual([
      'overview',
      'character',
      'checks',
      'combat',
      'resources',
      'growth',
      'special',
      'gm',
    ])
  })

  it('defines the confirmed stat roles and skill check rules', () => {
    expect(statDefinitions).toEqual([
      { name: '体力', effect: 'HP' },
      { name: '筋力', effect: 'ダメージボーナス' },
      { name: '魔力', effect: 'MP' },
      { name: '速力', effect: '行動順' },
      { name: '精神力', effect: '正気度' },
    ])
    expect(skillRules).toEqual(expect.objectContaining({
      maximum: 100,
      success: '技能値以下で成功',
      critical: '1〜5',
      fumble: '95〜100',
    }))
  })

  it('provides an optional insanity table', () => {
    expect(insanityTable).toHaveLength(20)
    expect(insanityTable[0].roll).toBe('1')
    expect(insanityTable[19].roll).toBe('20')
  })

  it('defines the in-world name for player characters', () => {
    expect(playerTerm).toBe('PLたちは「渡り手」と呼ばれます。')
  })
})
