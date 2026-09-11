import { DEFAULT_DATA, INITIAL_STAT_BASE, MAX_SKILL_BONUS } from "../constants/game";
import { normalizeLuck } from "./characterRules";
import { normalizeCurrency } from "./currency";
import type {
  CharacterData,
  EquipmentItem,
  EquipmentCategory,
  Skills,
  StatBonuses,
  Stats,
  Weapon,
  WeaponKind,
} from "../types/character";

const finiteNumber = (value: unknown, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const normalizeStats = (source: Partial<Stats> | undefined): Stats => ({
  vitality: finiteNumber(source?.vitality, INITIAL_STAT_BASE),
  strength: finiteNumber(source?.strength, INITIAL_STAT_BASE),
  magic: finiteNumber(source?.magic, INITIAL_STAT_BASE),
  speed: finiteNumber(source?.speed, INITIAL_STAT_BASE),
  mental: finiteNumber(source?.mental, INITIAL_STAT_BASE),
});

const normalizeStatBonuses = (source: Partial<StatBonuses> | undefined): StatBonuses => ({
  vitality: finiteNumber(source?.vitality, 0),
  strength: finiteNumber(source?.strength, 0),
  magic: finiteNumber(source?.magic, 0),
  speed: finiteNumber(source?.speed, 0),
  mental: finiteNumber(source?.mental, 0),
});

const normalizeSkillBonus = (value: unknown) =>
  Math.max(
    0,
    Math.min(
      MAX_SKILL_BONUS,
      typeof value === "number" && Number.isFinite(value) ? Math.round(value) : 0,
    ),
  );
const normalizeSkillBonusMap = (source: Record<string, unknown> | undefined) =>
  Object.fromEntries(
    Object.entries(source ?? {}).map(([id, value]) => [id, normalizeSkillBonus(value)]),
  );

const normalizeWeapon = (source: Partial<Weapon>, index: number): Weapon => ({
  id: typeof source.id === "string" && source.id ? source.id : `weapon-${index + 1}`,
  name: typeof source.name === "string" ? source.name : "",
  kind: (source.kind === "gun" ? "gun" : "melee") as WeaponKind,
  skill: typeof source.skill === "string" ? source.skill : "",
  damage: typeof source.damage === "string" ? source.damage : "",
  durability: Math.max(0, Math.round(finiteNumber(source.durability, 0))),
  description: typeof source.description === "string" ? source.description : "",
});

const normalizeWeapons = (source: unknown): Weapon[] =>
  Array.isArray(source)
    ? source.map((weapon, index) => normalizeWeapon((weapon ?? {}) as Partial<Weapon>, index))
    : [];

const normalizeEquipmentCategory = (value: unknown): EquipmentCategory =>
  value === "weapon" || value === "armor" || value === "accessory" ? value : "accessory";

const normalizeWeaponKind = (value: unknown): WeaponKind =>
  value === "gun" ? "gun" : value === "staff" ? "staff" : "melee";

const normalizeEquipmentItem = (source: unknown, index: number): EquipmentItem => {
  const value = (source ?? {}) as Partial<EquipmentItem>;
  const category = normalizeEquipmentCategory(value.category);
  const item: EquipmentItem = {
    id: typeof value.id === "string" && value.id ? value.id : `equipment-${index + 1}`,
    name: typeof value.name === "string" ? value.name : "",
    category,
    description: typeof value.description === "string" ? value.description : "",
  };
  if (category === "weapon") {
    item.weaponKind = normalizeWeaponKind(value.weaponKind);
    if (item.weaponKind !== "staff") {
      item.skill = typeof value.skill === "string" ? value.skill : "";
      item.damage = typeof value.damage === "string" ? value.damage : "";
      item.durability = Math.max(0, Math.round(finiteNumber(value.durability, 0)));
    }
  } else {
    item.durability = Math.max(0, Math.round(finiteNumber(value.durability, 0)));
  }
  return item;
};

const normalizeEquipment = (source: unknown, legacyWeapons: unknown): EquipmentItem[] => {
  if (Array.isArray(source)) return source.map(normalizeEquipmentItem);
  return normalizeWeapons(legacyWeapons).map((weapon) => ({
    id: weapon.id,
    name: weapon.name,
    category: "weapon" as const,
    description: weapon.description,
    weaponKind: weapon.kind,
    skill: weapon.skill,
    damage: weapon.damage,
    durability: weapon.durability,
  }));
};

const normalizeEquippedEquipmentIds = (
  source: unknown,
  equipment: EquipmentItem[],
  legacyWeapons: unknown,
): string[] => {
  const ids = Array.isArray(source)
    ? source.filter((id): id is string => typeof id === "string")
    : Array.isArray(legacyWeapons)
      ? equipment.map((item) => item.id)
      : [];
  const equipmentIds = new Set(equipment.map((item) => item.id));
  return [...new Set(ids)].filter((id) => equipmentIds.has(id)).slice(0, 6);
};

export function sortEquipmentByEquipped(
  equipment: EquipmentItem[],
  equippedEquipmentIds: string[],
): EquipmentItem[] {
  const equippedIds = new Set(equippedEquipmentIds);
  return equipment
    .map((item, index) => ({ item, index }))
    .sort(
      (left, right) =>
        Number(equippedIds.has(right.item.id)) - Number(equippedIds.has(left.item.id)) ||
        left.index - right.index,
    )
    .map(({ item }) => item);
}

const normalizeSkills = (source: Partial<Skills> | undefined): Skills => ({
  common: { ...DEFAULT_DATA.skills.common, ...(source?.common ?? {}) },
  luck: normalizeLuck(source?.luck),
  bonuses: {
    common: {
      ...DEFAULT_DATA.skills.bonuses.common,
      ...normalizeSkillBonusMap(source?.bonuses?.common),
    },
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
});

/** 旧6能力値データも読み込めるよう、新しい5能力値モデルへそろえる。 */
export function normalizeCharacterData(
  source: Partial<CharacterData> | null | undefined,
): CharacterData {
  const data = (source ?? {}) as Partial<CharacterData> & { weapons?: unknown };
  const equipment = normalizeEquipment(data.equipment, data.weapons);
  return {
    profile: { ...DEFAULT_DATA.profile, ...(data.profile ?? {}) },
    stats: normalizeStats(data.stats),
    statBonuses: normalizeStatBonuses(data.statBonuses),
    skills: normalizeSkills(data.skills),
    equipment,
    equippedEquipmentIds: normalizeEquippedEquipmentIds(
      data.equippedEquipmentIds,
      equipment,
      data.weapons,
    ),
    currency: normalizeCurrency(data.currency),
    items: Array.isArray(data.items) ? data.items : [],
    experience: { ...DEFAULT_DATA.experience, ...(data.experience ?? {}) },
    tags: Array.isArray(data.tags) ? data.tags : [],
  };
}
