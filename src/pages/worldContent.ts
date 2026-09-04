export type WorldGlossaryEntry = {
  id: string
  term: string
  description: string
}

export type WorldGlossaryGenre = {
  id: string
  title: string
  entries: WorldGlossaryEntry[]
}

export const worldGlossaryGenres: WorldGlossaryGenre[] = [
  {
    id: 'magic-technology',
    title: '魔力・魔術・機械',
    entries: [
      { id: 'magic-power', term: '魔力', description: '物質全てに宿るエネルギー。人など一部の生物は操る力を持っている。' },
      { id: 'sorcery', term: '魔術', description: '道具を使って自在に魔力を制御する術のこと。イメージが複雑なものほど難しくなる。' },
      { id: 'machine', term: '機械', description: '魔力を使って自動で動く道具。産業革命の根本であり、今や全てのものに使われている。' },
      { id: 'gun', term: '銃', description: '魔力を使うことで間接攻撃ができる武器。様々な種類があるが、特徴として他の魔術と違い簡単な訓練ですぐ撃てる良さがある。' },
    ],
  },
  {
    id: 'pollution-anomalies',
    title: '汚染・異形',
    entries: [
      { id: 'pollution', term: '汚染', description: '魔力が結晶化し、物質に変異する現象のこと。ほとんどのものに対して有害であり、濃度が高くなるとその地域は危険域になる。' },
      { id: 'anomalies', term: '異形', description: '汚染によって生まれた生物。または汚染によって変異した生物。様々な種類がおり、凶暴で基本的に有害。' },
    ],
  },
  {
    id: 'people',
    title: '人物・役割',
    entries: [{ id: 'wanderers', term: '渡り手', description: 'PCのこと。CoCでいう探索者、エモクロアでいう共鳴者。' }],
  },
]
