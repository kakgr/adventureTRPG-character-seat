import { DEFAULT_DATA, INITIAL_STAT_BASE, MAX_SKILL_BONUS } from '../constants/game'
import { normalizeLuck } from './characterRules'
import type { CharacterData, Skills, StatBonuses, Stats } from '../types/character'

const finiteNumber = (value: unknown, fallback: number) => typeof value === 'number' && Number.isFinite(value) ? value : fallback

const normalizeStats = (source: Partial<Stats> | undefined): Stats => ({
  vitality: finiteNumber(source?.vitality, INITIAL_STAT_BASE),
  strength: finiteNumber(source?.strength, INITIAL_STAT_BASE),
  magic: finiteNumber(source?.magic, INITIAL_STAT_BASE),
  speed: finiteNumber(source?.speed, INITIAL_STAT_BASE),
  mental: finiteNumber(source?.mental, INITIAL_STAT_BASE),
})

const normalizeStatBonuses = (source: Partial<StatBonuses> | undefined): StatBonuses => ({
  vitality: finiteNumber(source?.vitality, 0),
  strength: finiteNumber(source?.strength, 0),
  magic: finiteNumber(source?.magic, 0),
  speed: finiteNumber(source?.speed, 0),
  mental: finiteNumber(source?.mental, 0),
})

const normalizeSkillBonus = (value: unknown) => Math.max(0, Math.min(MAX_SKILL_BONUS, typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : 0))
const normalizeSkillBonusMap = (source: Record<string, unknown> | undefined) => Object.fromEntries(Object.entries(source ?? {}).map(([id, value]) => [id, normalizeSkillBonus(value)]))

const normalizeSkills = (source: Partial<Skills> | undefined): Skills => ({
  common: { ...DEFAULT_DATA.skills.common, ...(source?.common ?? {}) },
  luck: normalizeLuck(source?.luck),
  bonuses: {
    common: { ...DEFAULT_DATA.skills.bonuses.common, ...normalizeSkillBonusMap(source?.bonuses?.common) },
    weapon: normalizeSkillBonusMap(source?.bonuses?.weapon),
    ranged: normalizeSkillBonusMap(source?.bonuses?.ranged),
    knowledge: normalizeSkillBonusMap(source?.bonuses?.knowledge),
    magic: normalizeSkillBonusMap(source?.bonuses?.magic),
    custom: normalizeSkillBonusMap(source?.bonuses?.custom),
  },
  weapon: Array.isArray(source?.weapon) ? source.weapon : [],
  ranged: Array.isArray(source?.ranged) ? source.ranged : [],
  knowledge: Array.isArray(source?.knowledge) ? source.knowledge : [],
  magic: Array.isArray(source?.magic) ? source.magic : [],
  custom: Array.isArray(source?.custom) ? source.custom : [],
})

/** 旧6能力値データも読み込めるよう、新しい5能力値モデルへそろえる。 */
export function normalizeCharacterData(source: Partial<CharacterData> | null | undefined): CharacterData {
  const data = source ?? {}
  return {
    profile: { ...DEFAULT_DATA.profile, ...(data.profile ?? {}) },
    stats: normalizeStats(data.stats),
    statBonuses: normalizeStatBonuses(data.statBonuses),
    skills: normalizeSkills(data.skills),
    items: Array.isArray(data.items) ? data.items : [],
    experience: { ...DEFAULT_DATA.experience, ...(data.experience ?? {}) },
    tags: Array.isArray(data.tags) ? data.tags : [],
  }
}
