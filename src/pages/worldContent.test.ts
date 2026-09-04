import { describe, expect, it } from 'vitest'
import { worldGlossaryGenres } from './worldContent'

describe('world content', () => {
  it('groups the defined glossary terms by genre', () => {
    expect(worldGlossaryGenres.map((genre) => genre.id)).toEqual(['magic-technology', 'pollution-anomalies', 'people'])
    expect(worldGlossaryGenres.map((genre) => genre.title)).toEqual(['魔力・魔術・機械', '汚染・異形', '人物・役割'])
    expect(worldGlossaryGenres.flatMap((genre) => genre.entries).map((entry) => entry.term)).toEqual(['魔力', '魔術', '機械', '銃', '汚染', '異形', '渡り手'])
    expect(worldGlossaryGenres.flatMap((genre) => genre.entries).map((entry) => entry.description)).toEqual([
      '物質全てに宿るエネルギー。人など一部の生物は操る力を持っている。',
      '道具を使って自在に魔力を制御する術のこと。イメージが複雑なものほど難しくなる。',
      '魔力を使って自動で動く道具。産業革命の根本であり、今や全てのものに使われている。',
      '魔力を使うことで間接攻撃ができる武器。様々な種類があるが、特徴として他の魔術と違い簡単な訓練ですぐ撃てる良さがある。',
      '魔力が結晶化し、物質に変異する現象のこと。ほとんどのものに対して有害であり、濃度が高くなるとその地域は危険域になる。',
      '汚染によって生まれた生物。または汚染によって変異した生物。様々な種類がおり、凶暴で基本的に有害。',
      'PCのこと。CoCでいう探索者、エモクロアでいう共鳴者。',
    ])
  })
})
