import { describe, expect, it } from 'vitest'
import { DEFAULT_DATA } from '../constants/game'
import type { CharacterRecord } from '../types/character'
import { buildCocofoliaCharacter, serializeCocofoliaCharacter } from './ccfolia'

const character = (): CharacterRecord => ({
  id: 'character-1',
  user_id: 'user-1',
  name: 'アリア・ノクス',
  data: {
    ...structuredClone(DEFAULT_DATA),
    profile: {
      ...DEFAULT_DATA.profile,
      reading: 'ありあ・のくす',
      age: 21,
      gender: '女性',
      occupation: '遺跡調査員',
      summary: '静かな観察者',
      description: '古代遺跡を巡る。',
    },
    stats: { vitality: 4, strength: 5, magic: 6, speed: 3, mental: 2 },
    statBonuses: { vitality: 1, speed: 2 },
    skills: {
      ...DEFAULT_DATA.skills,
      common: { ...DEFAULT_DATA.skills.common, search: 65, medicine: 40 },
      weapon: [{ id: 'weapon-1', specialty: '短剣', value: 55 }],
      custom: [{ id: 'custom-1', name: '古代文字', value: 80 }],
    },
    items: [{ id: 'item-1', name: 'ランタン', quantity: 2, description: '油式' }],
    experience: { notes: '港町の事件' },
    tags: ['探索', '古代遺跡'],
  },
  portrait_path: null,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
})

describe('CCFOLIA character export', () => {
  it('builds the CCFOLIA character payload', () => {
    const result = buildCocofoliaCharacter(character())

    expect(result.kind).toBe('character')
    expect(result.data.name).toBe('アリア・ノクス')
    expect(result.data.initiative).toBe(5)
    expect(result.data.status).toEqual([
      { label: 'HP', value: 15, max: 15 },
      { label: 'MP', value: 18, max: 18 },
      { label: '正気度', value: 6, max: 6 },
    ])
    expect(result.data.params).toEqual(expect.arrayContaining([
      { label: '体力', value: '5' },
      { label: '速力', value: '5' },
      { label: '魔力', value: '6' },
      { label: 'ダメージボーナス', value: '1' },
      { label: '探索', value: '65' },
      { label: '短剣', value: '55' },
      { label: '古代文字', value: '80' },
    ]))
    expect(result.data.memo).toBe([
      'PC：アリア・ノクス',
      'HP：15',
      'MP：18',
      '正気度：6',
      'ダメージボーナス：1',
    ].join('\r\n'))
    expect(result.data.memo).not.toContain('遺跡調査員')
    expect(result.data.memo).not.toContain('ランタン')
    expect(result.data.commands).toBe([
      '1d100<=65 〖探索〗',
      '1d100<=40 〖医療〗',
      '1d100<=55 〖短剣〗',
      '1d100<=80 〖古代文字〗',
      '1d100 〖正気度チェック（判定値はシナリオ指定）〗',
    ].join('\r\n'))
  })

  it('serializes to compact JSON without raw line breaks', () => {
    const serialized = serializeCocofoliaCharacter(buildCocofoliaCharacter(character()))

    expect(serialized).not.toContain('\n')
    expect(JSON.parse(serialized)).toEqual(buildCocofoliaCharacter(character()))
  })
})
