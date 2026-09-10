export type Scenario = {
  id: string
  title: string
  cover: string | null
  synopsis: string
  genre: string
  playTime: string
  players: string
  recommendedSkills: string[]
  specialRequirement?: string
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
        title: 'ヴォルト家の遺品の謎',
        cover: `${import.meta.env.BASE_URL}scenarios/vaaru-isan.webp`,
        synopsis: '探偵のあなたはヴォルト家の家主ベルト・ヴォルトの残した手紙の解読を依頼された。無事謎を解き、依頼を完了できるか？(探偵必須)',
        genre: 'チュートリアル・ミステリー',
        playTime: '30分〜1時間',
        players: '1〜3人',
        recommendedSkills: ['洞察', '探索系'],
      },
    ],
  },
  {
    id: 'main',
    title: 'メインシナリオ',
    scenarios: [
      {
        id: 'main-scenario-01',
        title: '？？？？',
        cover: `${import.meta.env.BASE_URL}scenarios/main-scenario-01.png`,
        synopsis: '？？？？',
        genre: 'メイン・探索・戦闘',
        playTime: '3時間〜4時間',
        players: '未定',
        recommendedSkills: ['隠密', '戦闘系'],
        specialRequirement: 'サブシナリオ「街歩き」にて特定のフラグが立っているPCに秘匿情報',
      },
    ],
  },
  {
    id: 'sub',
    title: 'サブシナリオ',
    scenarios: [
      {
        id: 'machiaruki',
        title: '街歩き',
        cover: `${import.meta.env.BASE_URL}scenarios/machiaruki.jpg`,
        synopsis: '街を歩きながら、自由な会話と交流を楽しむ小さな物語。',
        genre: 'RP',
        playTime: '20分〜',
        players: '1人〜',
        recommendedSkills: [],
      },
    ],
  },
]
