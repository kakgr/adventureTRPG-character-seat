import { describe, expect, it } from 'vitest'
import { scenarioSections } from './scenarioContent'

describe('scenario content', () => {
  it('provides the planned scenario sections', () => {
    expect(scenarioSections.map((section) => section.id)).toEqual(['prologue', 'main'])
    expect(scenarioSections.map((section) => section.title)).toEqual(['プロローグシナリオ', 'メインシナリオ'])
    expect(scenarioSections[0].scenarios.map((scenario) => scenario.title)).toEqual(['転移者', '迷い込んだ子犬？', 'ヴァール家の遺品の謎'])
    expect(scenarioSections[0].scenarios.map((scenario) => scenario.genre)).toEqual(['チュートリアル・探索', 'チュートリアル・戦闘', 'チュートリアル・ミステリー'])
  })

  it('keeps each scenario focused on information shown before the story', () => {
    const requiredFields = ['title', 'cover', 'synopsis', 'genre', 'playTime', 'players', 'recommendedSkills']
    for (const scenario of scenarioSections.flatMap((section) => section.scenarios)) {
      expect(Object.keys(scenario)).toEqual(expect.arrayContaining(requiredFields))
      expect(scenario).not.toHaveProperty('body')
    }
  })
})
