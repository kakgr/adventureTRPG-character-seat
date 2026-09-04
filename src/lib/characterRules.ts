import {
  HP_MULTIPLIER,
  INITIAL_SKILL_POINTS,
  INITIAL_STAT_BASE,
  INITIAL_STAT_POINTS,
  LUCK_MAX,
  LUCK_MIN,
  MAX_SKILL_BONUS,
  MAX_SKILL_VALUE,
  MP_MULTIPLIER,
  SANITY_MULTIPLIER,
} from '../constants/game'
import type { CharacterData, Skills, StatBonuses, StatId, Stats } from '../types/character'

export const sumStats = (stats: Stats) => Object.values(stats).reduce((sum, value) => sum + value, 0)
export const usedStatPoints = (stats: Stats) => sumStats(stats) - Object.keys(stats).length * INITIAL_STAT_BASE
export const remainingStatPoints = (stats: Stats) => INITIAL_STAT_POINTS - usedStatPoints(stats)
export const totalStatValue = (stats: Stats, bonuses: StatBonuses | undefined, id: StatId) => stats[id] + (bonuses?.[id] ?? 0)
export const calculateHp = (stats: Stats, bonuses?: StatBonuses) => totalStatValue(stats, bonuses, 'vitality') * HP_MULTIPLIER
export const calculateMp = (stats: Stats, bonuses?: StatBonuses) => totalStatValue(stats, bonuses, 'magic') * MP_MULTIPLIER
export const calculateSanity = (stats: Stats, bonuses?: StatBonuses) => totalStatValue(stats, bonuses, 'mental') * SANITY_MULTIPLIER
export const calculateDamageBonus = (stats: Stats, bonuses?: StatBonuses) => Math.floor((totalStatValue(stats, bonuses, 'vitality') + totalStatValue(stats, bonuses, 'strength')) / 6)
export const rollLuck = (random: () => number = Math.random) => Math.floor(random() * (LUCK_MAX - LUCK_MIN + 1)) + LUCK_MIN
export const normalizeLuck = (value: unknown) => Math.max(LUCK_MIN, Math.min(LUCK_MAX, typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : LUCK_MIN))

export const sumSkillValues = (skills: Skills) => [
  ...Object.values(skills.common),
  ...skills.weapon.map((skill) => skill.value),
  ...skills.ranged.map((skill) => skill.value),
  ...skills.knowledge.map((skill) => skill.value),
  ...skills.magic.map((skill) => skill.value),
  ...skills.custom.map((skill) => skill.value),
].reduce((sum, value) => sum + value, 0)

export const totalSkillValue = (value: number, bonus = 0) => value + bonus
export const updateSkillBonus = (value: number) => Math.max(0, Math.min(MAX_SKILL_BONUS, Number.isFinite(value) ? Math.round(value) : 0))

export const remainingSkillPoints = (skills: Skills) => INITIAL_SKILL_POINTS - sumSkillValues(skills)

export const updateStat = (stats: Stats, id: StatId, delta: number, enforceBudget = true): Stats => {
  const next = Math.max(INITIAL_STAT_BASE, stats[id] + delta)
  if (enforceBudget && next > stats[id] && remainingStatPoints(stats) <= 0) return stats
  return { ...stats, [id]: next }
}

export const updateSkillValue = (data: CharacterData, setter: (next: CharacterData) => void, nextValue: number, currentValue: number) => {
  const value = Math.max(0, Math.min(MAX_SKILL_VALUE, Number.isFinite(nextValue) ? Math.round(nextValue) : 0))
  const delta = value - currentValue
  if (delta > 0 && remainingSkillPoints(data.skills) < delta) return
  setter(data)
}

export const isInitialDataValid = (data: CharacterData) => remainingStatPoints(data.stats) === 0
