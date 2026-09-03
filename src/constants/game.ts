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

export const COMMON_SKILLS: Array<{ id: CommonSkillId; label: string; note: string }> = [
  { id: 'athletics', label: '運動', note: '走る、跳ぶ、登る、泳ぐ' },
  { id: 'martialArts', label: '格闘', note: '素手戦闘、組み付き' },
  { id: 'stealth', label: '隠密', note: '忍び歩き、隠れる、尾行' },
  { id: 'insight', label: '洞察', note: '観察、注視、違和感を読む' },
  { id: 'search', label: '探索', note: '調査、捜索、証拠を探す' },
  { id: 'negotiation', label: '交渉', note: '説得、取引、話し合い' },
  { id: 'intimidation', label: '威圧', note: '脅す、圧力をかける' },
  { id: 'technology', label: '技術', note: '機械、修理、電子機器' },
  { id: 'medicine', label: '医療', note: '応急処置、医学、治療' },
  { id: 'survival', label: 'サバイバル', note: '野外活動、追跡、自然環境' },
  { id: 'piloting', label: '操縦', note: '自動車、船、航空機' },
  { id: 'attunement', label: '感応', note: '魔術、異能、超常現象' },
]

export const SPECIALIZED_SKILLS = [
  { id: 'weapon' as const, label: '武器', note: '剣、斧、槍など' },
  { id: 'ranged' as const, label: '射撃', note: '拳銃、ライフル、弓など' },
  { id: 'knowledge' as const, label: '専門知識', note: '歴史、魔術学、法律など' },
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
