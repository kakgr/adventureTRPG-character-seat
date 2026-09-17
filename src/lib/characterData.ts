import { DEFAULT_DATA, INITIAL_STAT_BASE, MAX_SKILL_BONUS } from "../constants/game";
import { normalizeLuck } from "./characterRules";
import { normalizeCurrency } from "./currency";
import type {
  CharacterData,
  EquipmentItem,
  EquipmentCategory,
  Skills,
  SpecializedSkill,
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

const normalizeReferenceId = (value: unknown) =>
  typeof value === "string" && /^\d{0,5}$/.test(value) ? value : "";

const normalizeEquipmentCategory = (value: unknown, weaponKind?: unknown): EquipmentCategory => {
  if (["melee", "gun", "bow", "magicTool", "armor", "shield", "accessory"].includes(value as string))
    return value as EquipmentCategory;
  if (value === "weapon") return weaponKind === "staff" ? "magicTool" : weaponKind === "gun" ? "gun" : "melee";
  return value === "armor" ? "armor" : "accessory";
};

const normalizeEquipmentItem = (source: unknown, index: number): EquipmentItem => {
  const value = (source ?? {}) as Partial<EquipmentItem>;
  const category = normalizeEquipmentCategory(value.category, (value as { weaponKind?: unknown }).weaponKind);
  const item: EquipmentItem = {
    id: typeof value.id === "string" && value.id ? value.id : `equipment-${index + 1}`,
    referenceId: normalizeReferenceId(value.referenceId),
    name: typeof value.name === "string" ? value.name : "",
    category,
    description: typeof value.description === "string" ? value.description : "",
  };
  if (["melee", "gun", "bow"].includes(category)) {
    item.damage = typeof value.damage === "string" ? value.damage : "";
    item.attacks = Math.max(0, Math.round(finiteNumber(value.attacks, 0)));
    item.mpCost = Math.max(0, Math.round(finiteNumber(value.mpCost, 0)));
  }
  if (category === "armor" || category === "shield") item.defense = Math.max(0, Math.round(finiteNumber(value.defense, 0)));
  if (category === "shield") item.durability = Math.max(0, Math.round(finiteNumber(value.durability, 0)));
  return item;
};

const normalizeEquipment = (source: unknown, legacyWeapons: unknown): EquipmentItem[] => {
  if (Array.isArray(source)) return source.map(normalizeEquipmentItem);
  return normalizeWeapons(legacyWeapons).map((weapon) => ({
    id: weapon.id,
    referenceId: "",
    name: weapon.name,
    category: weapon.kind === "gun" ? "gun" as const : weapon.kind === "staff" ? "magicTool" as const : "melee" as const,
    description: weapon.description,
    damage: weapon.damage,
    attacks: 0,
    mpCost: 0,
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

const normalizeSkillEntries = (source: unknown, preserveReferenceId: boolean): SpecializedSkill[] =>
  Array.isArray(source)
    ? source.map((value) => {
        const skill = { ...((value ?? {}) as SpecializedSkill) };
        if (preserveReferenceId) skill.referenceId = normalizeReferenceId(skill.referenceId);
        else delete skill.referenceId;
        return skill;
      })
    : [];

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
  weapon: normalizeSkillEntries(source?.weapon, false),
  ranged: normalizeSkillEntries(source?.ranged, false),
  knowledge: normalizeSkillEntries(source?.knowledge, true),
  magic: normalizeSkillEntries(source?.magic, true),
  custom: Array.isArray(source?.custom) ? source.custom.map(skill => ({...skill, referenceId: normalizeReferenceId(skill.referenceId)})) : [],
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
