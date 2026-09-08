import { describe, expect, it } from 'vitest'
import { groupGlossaryEntries, worldGlossaryGenres } from './worldContent'

describe('world content', () => {
  it('groups the defined glossary terms by genre', () => {
    expect(worldGlossaryGenres.map((genre) => genre.id)).toEqual(['magic-technology', 'pollution-anomalies', 'geography', 'people'])
    expect(worldGlossaryGenres.map((genre) => genre.title)).toEqual(['魔力・魔術・機械', '汚染・異形', '地理', '人物・役割'])
    expect(worldGlossaryGenres.flatMap((genre) => genre.entries).map((entry) => entry.term)).toEqual(['魔力', '魔術', '錬金術', '機械', '銃', '汚染', '異形', 'ラース大陸', '中央海', '渡り手'])
    expect(worldGlossaryGenres.flatMap((genre) => genre.entries).map((entry) => entry.description)).toEqual([
      '物質全てに宿るエネルギー。人など一部の生物は操る力を持っている。',
      '道具を使って自在に魔力を制御する術のこと。イメージが複雑なものほど難しくなる。',
      '等価交換そのものであり、新しい物を生み出すことはできない。使用する規模によってMPの使用量が変わり、小さいものから巨大な変更まで可能だ。主に地面の形状を変更させて自分の使いやすい形に変えたり、所持しているものの形を変えることができる。',
      '魔力を使って自動で動く道具。産業革命の根本であり、今や全てのものに使われている。',
      '魔力を使うことで間接攻撃ができる武器。様々な種類があるが、特徴として他の魔術と違い簡単な訓練ですぐ撃てる良さがある。',
      '魔力が結晶化し、物質に変異する現象のこと。ほとんどのものに対して有害であり、濃度が高くなるとその地域は危険域になる。',
      '汚染によって生まれた生物。または汚染によって変異した生物。様々な種類がおり、凶暴で基本的に有害。',
      '中央海から西側にある大陸で、縦に長く様々な気候帯を持っている。三大陸の中で最も人口が多く、安全圏が広い。',
      '3つの大陸に挟まれた海。場所がちょうどいいため何かと基準にされがち。',
      'PCのこと。CoCでいう探索者、エモクロアでいう共鳴者。',
    ])
  })

  it('keeps the geography glossary genre ready for future entries', () => {
    expect(worldGlossaryGenres.find((genre) => genre.id === 'geography')).toMatchObject({
      id: 'geography',
      title: '地理',
      categories: ['自然地名', '人文地名'],
    })
  })

  it('groups glossary entries into smaller sections within a genre', () => {
    const magicTechnology = worldGlossaryGenres.find((genre) => genre.id === 'magic-technology')
    expect(groupGlossaryEntries(magicTechnology?.entries ?? []).map((group) => ({
      title: group.title,
      terms: group.entries.map((entry) => entry.term),
    }))).toEqual([
      { title: '魔力', terms: ['魔力'] },
      { title: '魔術', terms: ['魔術', '錬金術'] },
      { title: '機械', terms: ['機械', '銃'] },
    ])
  })

  it('places geography terms under the natural place-name category', () => {
    const geography = worldGlossaryGenres.find((genre) => genre.id === 'geography')
    expect(geography?.entries).toEqual([
      {
        id: 'laas-continent',
        term: 'ラース大陸',
        category: '自然地名',
        subcategory: '自然地形',
        description: '中央海から西側にある大陸で、縦に長く様々な気候帯を持っている。三大陸の中で最も人口が多く、安全圏が広い。',
      },
      {
        id: 'central-sea',
        term: '中央海',
        category: '自然地名',
        subcategory: '自然地形',
        description: '3つの大陸に挟まれた海。場所がちょうどいいため何かと基準にされがち。',
      },
    ])
  })
})
