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
    scenarios: [
      {
        id: 'tenisha-sha',
        title: '転移者',
        cover: `${import.meta.env.BASE_URL}scenarios/tenisha.webp`,
        synopsis: 'どこかの世界からやってきた渡り手は、気付かぬうちに廃墟になった古屋の中で横たわっていた。',
        genre: 'チュートリアル・探索',
        playTime: '45分〜1時間',
        players: '1〜3人',
        recommendedSkills: ['洞察'],
      },
      {
        id: 'maigo-koinu',
        title: '迷い込んだ子犬？',
        cover: `${import.meta.env.BASE_URL}scenarios/maigo-koinu.webp`,
        synopsis: '港にきていた渡り手達は、親方のお願いで午前中からそこら辺をうろちょろしている子犬を捕まえることになった。',
        genre: 'チュートリアル・戦闘',
        playTime: '30分〜1時間',
        players: '1〜3人',
        recommendedSkills: ['運動', '戦闘技能'],
      },
      {
        id: 'vaaru-isan-no-nazo',
        title: 'ヴァール家の遺品の謎',
        cover: `${import.meta.env.BASE_URL}scenarios/vaaru-isan.webp`,
        synopsis: '探偵のあなたはヴァール家の家主ベルト・ヴァールの残した手紙の解読を依頼された。無事謎を解き、依頼を完了できるか？(探偵必須)',
        genre: 'チュートリアル・ミステリー',
        playTime: '30分〜1時間',
        players: '1〜3人',
        recommendedSkills: ['洞察', '探索系'],
      },
    ],
  },
  { id: 'main', title: 'メインシナリオ', scenarios: [] },
]
