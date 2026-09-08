export type WorldGlossaryEntry = {
  id: string
  term: string
  category: string
  subcategory?: string
  description: string
}

export type WorldGlossaryEntryGroup = {
  title: string
  entries: WorldGlossaryEntry[]
}

export type WorldGlossaryGenre = {
  id: string
  title: string
  categories?: string[]
  entries: WorldGlossaryEntry[]
}

export function groupGlossaryEntries(entries: WorldGlossaryEntry[], categories: string[] = []): WorldGlossaryEntryGroup[] {
  const groups: WorldGlossaryEntryGroup[] = categories.map((title) => ({ title, entries: [] }))
  for (const entry of entries) {
    const group = groups.find((candidate) => candidate.title === entry.category)
    if (group) group.entries.push(entry)
    else groups.push({ title: entry.category, entries: [entry] })
  }
  return groups
}

export const worldGlossaryGenres: WorldGlossaryGenre[] = [
  {
    id: 'magic-technology',
    title: '魔力・魔術・機械',
    entries: [
      { id: 'magic-power', term: '魔力', category: '魔力', description: '物質全てに宿るエネルギー。人など一部の生物は操る力を持っている。' },
      { id: 'sorcery', term: '魔術', category: '魔術', description: '道具を使って自在に魔力を制御する術のこと。イメージが複雑なものほど難しくなる。' },
      { id: 'alchemy', term: '錬金術', category: '魔術', description: '等価交換そのものであり、新しい物を生み出すことはできない。使用する規模によってMPの使用量が変わり、小さいものから巨大な変更まで可能だ。主に地面の形状を変更させて自分の使いやすい形に変えたり、所持しているものの形を変えることができる。' },
      { id: 'machine', term: '機械', category: '機械', description: '魔力を使って自動で動く道具。産業革命の根本であり、今や全てのものに使われている。' },
      { id: 'gun', term: '銃', category: '機械', description: '魔力を使うことで間接攻撃ができる武器。様々な種類があるが、特徴として他の魔術と違い簡単な訓練ですぐ撃てる良さがある。' },
    ],
  },
  {
    id: 'pollution-anomalies',
    title: '汚染・異形',
    entries: [
      { id: 'pollution', term: '汚染', category: '汚染', description: '魔力が結晶化し、物質に変異する現象のこと。ほとんどのものに対して有害であり、濃度が高くなるとその地域は危険域になる。' },
      { id: 'anomalies', term: '異形', category: '異形', description: '汚染によって生まれた生物。または汚染によって変異した生物。様々な種類がおり、凶暴で基本的に有害。' },
    ],
  },
  {
    id: 'geography',
    title: '地理',
    categories: ['自然地名', '人文地名'],
    entries: [
      { id: 'laas-continent', term: 'ラース大陸', category: '自然地名', subcategory: '自然地形', description: '中央海から西側にある大陸で、縦に長く様々な気候帯を持っている。三大陸の中で最も人口が多く、安全圏が広い。' },
      { id: 'central-sea', term: '中央海', category: '自然地名', subcategory: '自然地形', description: '3つの大陸に挟まれた海。場所がちょうどいいため何かと基準にされがち。' },
      { id: 'bart-town', term: 'バルトの街', category: '人文地名', subcategory: '都市・国家', description: 'ラース大陸東部の沿岸に位置し、漁業と貿易の出入り口として発展した港町。この世界でも屈指の安全圏であり、周辺地域の様々なものが集結する場所になった。' },
      { id: 'sadam-union', term: 'サダム連合国', category: '人文地名', subcategory: '都市・国家', description: 'ラース大陸東部の沿岸都市が結成した国。豊かな海の資源と貿易によって栄えている。北部には広い危険域があり、防衛線を構築している。' },
    ],
  },
  {
    id: 'people',
    title: '人物・役割',
    entries: [{ id: 'wanderers', term: '渡り手', category: '渡り手', description: 'PCのこと。CoCでいう探索者、エモクロアでいう共鳴者。' }],
  },
]
