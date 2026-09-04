import type { CharacterData, CommonSkillId, SpecializedSkillId, StatId } from '../types/character'

export const INITIAL_STAT_BASE = 1
export const INITIAL_STAT_POINTS = 18
export const INITIAL_SKILL_POINTS = 400
export const MAX_SKILL_VALUE = 100
export const MAX_SKILL_BONUS = 100
export const LUCK_MIN = 0
export const LUCK_MAX = 90
export const HP_MULTIPLIER = 3
export const MP_MULTIPLIER = 3
export const SANITY_MULTIPLIER = 3

export const STAT_LABELS: Record<StatId, string> = {
  vitality: '体力',
  strength: '筋力',
  magic: '魔力',
  speed: '速力',
  mental: '精神力',
}

export const STAT_DESCRIPTIONS: Record<StatId, string> = {
  vitality: '生命力や体の丈夫さ',
  strength: '腕力や近接攻撃の強さ',
  magic: '魔術を扱う力や魔力の総量',
  speed: '移動速度や反応の速さ',
  mental: '意志の強さや精神の安定',
}

export const COMMON_SKILLS: Array<{ id: CommonSkillId; label: string; hint: string }> = [
  { id: 'athletics', label: '運動', hint: '走る・跳ぶ' },
  { id: 'martialArts', label: '格闘', hint: '殴る・組み合う' },
  { id: 'evasion', label: '回避', hint: '攻撃をかわす' },
  { id: 'stealth', label: '隠密', hint: '隠れる・忍び歩き' },
  { id: 'insight', label: '洞察', hint: '観察・見抜く' },
  { id: 'search', label: '探索', hint: '調べる・探す' },
  { id: 'negotiation', label: '交渉', hint: '説得・取引' },
  { id: 'intimidation', label: '威圧', hint: '脅す・圧する' },
  { id: 'technology', label: '技術', hint: '機械・工作' },
  { id: 'medicine', label: '医療', hint: '治療・応急手当' },
  { id: 'survival', label: 'サバイバル', hint: '野外活動・追跡' },
  { id: 'piloting', label: '操縦', hint: '乗り物を動かす' },
  { id: 'attunement', label: '感応', hint: '気配・超常感知' },
]

export const SPECIALIZED_SKILLS = [
  { id: 'weapon' as const, label: '武器' },
  { id: 'ranged' as const, label: '射撃/投擲' },
  { id: 'knowledge' as const, label: '専門知識' },
  { id: 'magic' as const, label: '魔術' },
]

export type SkillGenreId = 'combat' | 'physical' | 'exploration' | 'social' | 'technical' | 'custom'

export const SKILL_GENRE_LABELS: Record<SkillGenreId, string> = {
  combat: '戦闘系',
  physical: '身体・移動系',
  exploration: '探索・感知系',
  social: '対人系',
  technical: '技術・知識系',
  custom: 'カスタム',
}

export const COMMON_SKILL_GENRES: Record<CommonSkillId, Exclude<SkillGenreId, 'custom'>> = {
  athletics: 'physical',
  martialArts: 'combat',
  evasion: 'combat',
  stealth: 'exploration',
  insight: 'exploration',
  search: 'exploration',
  negotiation: 'social',
  intimidation: 'social',
  technology: 'technical',
  medicine: 'technical',
  survival: 'physical',
  piloting: 'physical',
  attunement: 'exploration',
}

export const SPECIALIZED_SKILL_GENRES: Record<SpecializedSkillId, Exclude<SkillGenreId, 'custom'>> = {
  weapon: 'combat',
  ranged: 'combat',
  knowledge: 'technical',
  magic: 'technical',
}

export const DEFAULT_DATA: CharacterData = {
  profile: { reading: '', age: null, gender: '', occupation: '', summary: '', description: '' },
  stats: {
    vitality: INITIAL_STAT_BASE,
    strength: INITIAL_STAT_BASE,
    magic: INITIAL_STAT_BASE,
    speed: INITIAL_STAT_BASE,
    mental: INITIAL_STAT_BASE,
  },
  statBonuses: {
    vitality: 0,
    strength: 0,
    magic: 0,
    speed: 0,
    mental: 0,
  },
  skills: {
    common: Object.fromEntries(COMMON_SKILLS.map(({ id }) => [id, 0])) as Record<CommonSkillId, number>,
    luck: 0,
    bonuses: {
      common: Object.fromEntries(COMMON_SKILLS.map(({ id }) => [id, 0])) as Record<CommonSkillId, number>,
      weapon: {},
      ranged: {},
      knowledge: {},
      magic: {},
      custom: {},
    },
    weapon: [],
    ranged: [],
    knowledge: [],
    magic: [],
    custom: [],
  },
  items: [],
  experience: { notes: '' },
  tags: [],
}
