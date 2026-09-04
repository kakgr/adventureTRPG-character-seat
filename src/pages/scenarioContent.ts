export type Scenario = {
  id: string
  title: string
  cover: string | null
  synopsis: string
  genre: string
  playTime: string
  players: string
  recommendedSkills: string[]
}

export type ScenarioSection = {
  id: string
  title: string
  scenarios: Scenario[]
}

export const scenarioSections: ScenarioSection[] = [
  {
    id: 'prologue',
    title: 'プロローグシナリオ',
    scenarios: [{
      id: 'tenisha-sha',
      title: '転移者',
      cover: `${import.meta.env.BASE_URL}scenarios/tenisha.webp`,
      synopsis: 'どこかの世界からやってきた渡り手は、気付かぬうちに廃墟になった古屋の中で横たわっていた。',
      genre: 'チュートリアル・探索',
      playTime: '45分〜1時間',
      players: '1〜3人',
      recommendedSkills: ['洞察'],
    }],
  },
  { id: 'main', title: 'メインシナリオ', scenarios: [] },
]
