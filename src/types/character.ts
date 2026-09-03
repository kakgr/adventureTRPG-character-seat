export type StatId = 'vitality' | 'strength' | 'mental' | 'speed' | 'education' | 'luck'

export type CommonSkillId =
  | 'athletics'
  | 'martialArts'
  | 'stealth'
  | 'insight'
  | 'search'
  | 'negotiation'
  | 'intimidation'
  | 'technology'
  | 'medicine'
  | 'survival'
  | 'piloting'
  | 'attunement'

export type SpecializedSkillId = 'weapon' | 'ranged' | 'knowledge'

export interface Profile {
  reading: string
  age: number | null
  gender: string
  occupation: string
  summary: string
  description: string
}

export interface Stats {
  vitality: number
  strength: number
  mental: number
  speed: number
  education: number
  luck: number
}

export type StatBonuses = Partial<Record<StatId, number>>

export interface SpecializedSkill {
  id: string
  specialty: string
  value: number
}

export interface CustomSkill {
  id: string
  name: string
  value: number
}

export interface Skills {
  common: Record<CommonSkillId, number>
  weapon: SpecializedSkill[]
  ranged: SpecializedSkill[]
  knowledge: SpecializedSkill[]
  custom: CustomSkill[]
}

export interface Item {
  id: string
  name: string
  quantity: number
  description: string
}

export interface Experience {
  notes: string
}

export interface CharacterData {
  profile: Profile
  stats: Stats
  statBonuses?: StatBonuses
  skills: Skills
  items: Item[]
  experience: Experience
  tags: string[]
}

export interface CharacterRecord {
  id: string
  user_id: string
  name: string
  data: CharacterData
  portrait_path: string | null
  created_at: string
  updated_at: string
  portrait_url?: string | null
}
