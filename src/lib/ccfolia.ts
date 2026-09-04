import { calculateDamageBonus, calculateHp, calculateMp, calculateSanity, totalStatValue } from './characterRules'
import { COMMON_SKILLS, SPECIALIZED_SKILLS, STAT_LABELS } from '../constants/game'
import type { CharacterRecord, SpecializedSkill, SpecializedSkillId, StatId } from '../types/character'

const CRLF = '\r\n'

export interface CocofoliaStatus {
  label: string
  value: number
  max: number
}

export interface CocofoliaParam {
  label: string
  value: string
}

export interface CocofoliaCharacter {
  kind: 'character'
  data: {
    name: string
    initiative: number
    memo: string
    externalUrl: string
    color: string
    commands: string
    status: CocofoliaStatus[]
    params: CocofoliaParam[]
  }
}

const DEFAULT_COLOR = '#d5774d'

const nonEmpty = (value: string | null | undefined) => value?.trim() ?? ''

function buildMemo(character: CharacterRecord) {
  const { data } = character
  const lines = [`PC：${character.name || '名前未設定'}`]
  const profile = data.profile

  if (nonEmpty(profile.reading)) lines.push(`読み方：${profile.reading.trim()}`)
  if (nonEmpty(profile.occupation)) lines.push(`職業：${profile.occupation.trim()}`)
  if (profile.age !== null) lines.push(`年齢：${profile.age}`)
  if (nonEmpty(profile.gender)) lines.push(`性別：${profile.gender.trim()}`)
  if (nonEmpty(profile.summary)) lines.push(`一言：${profile.summary.trim()}`)
  if (nonEmpty(profile.description)) lines.push(`プロフィール：${profile.description.trim()}`)

  const items = data.items
    .filter((item) => nonEmpty(item.name))
    .map((item) => `${item.name.trim()} ×${item.quantity}${nonEmpty(item.description) ? `（${item.description.trim()}）` : ''}`)
  if (items.length > 0) lines.push(`持ち物：${items.join('、')}`)
  if (nonEmpty(data.experience.notes)) lines.push(`通過シナリオ：${data.experience.notes.trim()}`)
  if (data.tags.length > 0) lines.push(`タグ：${data.tags.filter(nonEmpty).join('、')}`)

  lines.push('技能判定：1D100／技能値以下で成功')
  lines.push('クリティカル：1〜5／ファンブル：95〜100')
  lines.push('組み付け：50%＋（自分の筋力−対象の筋力）×5%')
  lines.push('組み付け継続：1ターンまたは1分程度。継続には再判定')
  lines.push('正気度：0で発狂。成功率・減少量・回復はシナリオ指定')
  lines.push('戦闘：速力順／攻撃→回避または防御→ダメージ')
  lines.push('遠距離：中衛は命中率−10%、後衛は命中率−20%')
  lines.push('ダメージ：武器・魔法の記載を参照／防御・回復：キャラクターシートを参照')
  lines.push('HP0：死亡・ロスト／蘇生：GM判断')

  return lines.join(CRLF)
}

function buildParams(character: CharacterRecord): CocofoliaParam[] {
  const { data } = character
  const params = (Object.keys(STAT_LABELS) as StatId[]).map((statId) => ({
    label: STAT_LABELS[statId],
    value: String(totalStatValue(data.stats, data.statBonuses, statId)),
  }))

  for (const skill of COMMON_SKILLS) {
    params.push({ label: skill.label, value: String(data.skills.common[skill.id]) })
  }

  for (const group of SPECIALIZED_SKILLS) {
    for (const skill of data.skills[group.id]) {
      const label = nonEmpty(skill.specialty)
      if (label) params.push({ label, value: String(skill.value) })
    }
  }

  for (const skill of data.skills.custom) {
    const label = nonEmpty(skill.name)
    if (label) params.push({ label, value: String(skill.value) })
  }

  return params
}

function buildSkillEntries(character: CharacterRecord) {
  const { data } = character
  const entries: Array<{ label: string; value: number }> = COMMON_SKILLS.map((skill) => ({
    label: skill.label,
    value: data.skills.common[skill.id],
  }))

  for (const group of SPECIALIZED_SKILLS) {
    entries.push(...data.skills[group.id]
      .filter((skill: SpecializedSkill) => nonEmpty(skill.specialty))
      .map((skill: SpecializedSkill) => ({ label: skill.specialty.trim(), value: skill.value })))
  }
  entries.push(...data.skills.custom
    .filter((skill) => nonEmpty(skill.name))
    .map((skill) => ({ label: skill.name.trim(), value: skill.value })))
  return entries
}

function buildCommands(character: CharacterRecord) {
  const skillLines = buildSkillEntries(character)
    .filter(({ value }) => value > 0)
    .map(({ label, value }) => `1d100<=${value} 〖${label}〗`)
  const sanityLine = '1d100 〖正気度ロール（判定値はシナリオ指定）〗'
  return [...skillLines, sanityLine].join(CRLF)
}

/**
 * ココフォリアの盤面へ貼り付けるキャラクター駒データを作る。
 * 立ち絵はココフォリア側の画像管理を使うため、外部ストレージURLは出力しない。
 */
export function buildCocofoliaCharacter(character: CharacterRecord, externalUrl = ''): CocofoliaCharacter {
  const { data } = character
  const hp = calculateHp(data.stats, data.statBonuses)
  const mp = calculateMp(data.stats, data.statBonuses)
  const sanity = calculateSanity(data.stats, data.statBonuses)

  return {
    kind: 'character',
    data: {
      name: character.name || '名前未設定',
      initiative: totalStatValue(data.stats, data.statBonuses, 'speed'),
      memo: buildMemo(character),
      externalUrl,
      color: DEFAULT_COLOR,
      commands: buildCommands(character),
      status: [
        { label: 'HP', value: hp, max: hp },
        { label: 'MP', value: mp, max: mp },
        { label: '正気度', value: sanity, max: sanity },
      ],
      params: [...buildParams(character), { label: 'ダメージボーナス', value: String(calculateDamageBonus(data.stats, data.statBonuses)) }],
    },
  }
}

export function serializeCocofoliaCharacter(character: CocofoliaCharacter) {
  return JSON.stringify(character)
}

export function getCocofoliaSpecializedSkillIds() {
  return SPECIALIZED_SKILLS.map(({ id }) => id as SpecializedSkillId)
}
