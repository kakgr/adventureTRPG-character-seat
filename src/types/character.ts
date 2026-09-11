export type StatId = "vitality" | "strength" | "magic" | "speed" | "mental";

export type CommonSkillId =
  | "athletics"
  | "martialArts"
  | "evasion"
  | "stealth"
  | "insight"
  | "search"
  | "negotiation"
  | "intimidation"
  | "technology"
  | "medicine"
  | "survival"
  | "piloting"
  | "attunement";

export type SpecializedSkillId = "weapon" | "ranged" | "knowledge" | "magic";

export interface Profile {
  reading: string;
  age: number | null;
  gender: string;
  occupation: string;
  summary: string;
  description: string;
}

export interface Stats {
  vitality: number;
  strength: number;
  magic: number;
  speed: number;
  mental: number;
}

export type StatBonuses = Partial<Record<StatId, number>>;

export interface SpecializedSkill {
  id: string;
  specialty: string;
  value: number;
}

export interface CustomSkill {
  id: string;
  name: string;
  value: number;
}

export interface SkillBonuses {
  common: Record<CommonSkillId, number>;
  weapon: Record<string, number>;
  ranged: Record<string, number>;
  knowledge: Record<string, number>;
  magic: Record<string, number>;
  custom: Record<string, number>;
}

export interface Skills {
  common: Record<CommonSkillId, number>;
  luck: number;
  bonuses: SkillBonuses;
  weapon: SpecializedSkill[];
  ranged: SpecializedSkill[];
  knowledge: SpecializedSkill[];
  magic: SpecializedSkill[];
  custom: CustomSkill[];
}

export interface Item {
  id: string;
  name: string;
  quantity: number;
  description: string;
}

export type WeaponKind = "melee" | "gun" | "staff";

export type EquipmentCategory = "weapon" | "armor" | "accessory";

export interface EquipmentItem {
  id: string;
  name: string;
  category: EquipmentCategory;
  description: string;
  weaponKind?: WeaponKind;
  skill?: string;
  damage?: string;
  durability?: number;
}

/** 旧保存形式の武器。読み込み時にEquipmentItemへ変換する。 */
export interface Weapon {
  id: string;
  name: string;
  kind: WeaponKind;
  skill: string;
  damage: string;
  durability: number;
  description: string;
}

/** 1カッパー＝1円を基準にした所持金の合計値。 */
export type Currency = number;

/** 既存キャラクターに保存されている旧通貨形式。読み込み時のみ利用する。 */
export interface LegacyCurrency {
  platinum: number;
  gold: number;
  silver: number;
  copper: number;
}

export interface Experience {
  notes: string;
}

export interface CharacterData {
  profile: Profile;
  stats: Stats;
  statBonuses?: StatBonuses;
  skills: Skills;
  equipment: EquipmentItem[];
  equippedEquipmentIds: string[];
  currency: Currency;
  items: Item[];
  experience: Experience;
  tags: string[];
}

export interface CharacterRecord {
  id: string;
  user_id: string;
  name: string;
  data: CharacterData;
  portrait_path: string | null;
  created_at: string;
  updated_at: string;
  portrait_url?: string | null;
}

export interface PublicCharacterRecord {
  id: string;
  name: string;
  data: CharacterData;
  portrait_path: string | null;
  created_at: string;
  updated_at: string;
  portrait_url?: string | null;
}
