import type { CharacterData, CommonSkillId, StatId } from '../types/character'

export const INITIAL_STAT_BASE = 1
export const INITIAL_STAT_POINTS = 18
export const INITIAL_SKILL_POINTS = 400
export const MAX_SKILL_VALUE = 100
export const HP_MULTIPLIER = 3
export const MP_MULTIPLIER = 3

export const STAT_LABELS: Record<StatId, string> = {
  vitality: '体力',
  strength: '筋力',
  mental: '精神力',
  speed: '速力',
  education: '教養',
  luck: '運',
}

export const COMMON_SKILLS: Array<{ id: CommonSkillId; label: string }> = [
  { id: 'athletics', label: '運動' },
  { id: 'martialArts', label: '格闘' },
  { id: 'stealth', label: '隠密' },
  { id: 'insight', label: '洞察' },
  { id: 'search', label: '探索' },
  { id: 'negotiation', label: '交渉' },
  { id: 'intimidation', label: '威圧' },
  { id: 'technology', label: '技術' },
  { id: 'medicine', label: '医療' },
  { id: 'survival', label: 'サバイバル' },
  { id: 'piloting', label: '操縦' },
  { id: 'attunement', label: '感応' },
]

export const SPECIALIZED_SKILLS = [
  { id: 'weapon' as const, label: '武器' },
  { id: 'ranged' as const, label: '射撃' },
  { id: 'knowledge' as const, label: '専門知識' },
]

export const DEFAULT_DATA: CharacterData = {
  profile: { reading: '', age: null, gender: '', occupation: '', summary: '', description: '' },
  stats: {
    vitality: INITIAL_STAT_BASE,
    strength: INITIAL_STAT_BASE,
    mental: INITIAL_STAT_BASE,
    speed: INITIAL_STAT_BASE,
    education: INITIAL_STAT_BASE,
    luck: INITIAL_STAT_BASE,
  },
  statBonuses: {
    vitality: 0,
    strength: 0,
    mental: 0,
    speed: 0,
    education: 0,
    luck: 0,
  },
  skills: {
    common: Object.fromEntries(COMMON_SKILLS.map(({ id }) => [id, 0])) as Record<CommonSkillId, number>,
    weapon: [],
    ranged: [],
    knowledge: [],
    custom: [],
  },
  items: [],
  experience: { notes: '' },
  tags: [],
}
