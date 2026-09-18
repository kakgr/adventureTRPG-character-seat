import {
  calculateDamageBonus,
  calculateHp,
  calculateMp,
  totalSkillValue,
  totalStatValue,
} from "./characterRules";
import { COMMON_SKILLS } from "../constants/game";
import type { CharacterRecord, SpecializedSkill } from "../types/character";

export type BattleExportSkill = {
  name: string;
  value: number;
};

export type BattleExportShield = {
  id: string;
  durability: number;
};

export type BattleExport = {
  name: string;
  vitality: number;
  magic: number;
  damageBonus: number;
  speed: number;
  defense: number;
  shields: BattleExportShield[];
  skills: BattleExportSkill[];
  ids: string[];
};

const nonEmpty = (value: string | undefined) => value?.trim() ?? "";

function buildPositiveSkills(character: CharacterRecord): BattleExportSkill[] {
  const { data } = character;
  const entries: BattleExportSkill[] = [];
  const add = (name: string | undefined, value: number) => {
    const label = nonEmpty(name);
    if (label && value > 0) entries.push({ name: label, value });
  };

  for (const skill of COMMON_SKILLS) {
    add(
      skill.label,
      totalSkillValue(data.skills.common[skill.id], data.skills.bonuses.common[skill.id]),
    );
  }
  add("幸運", data.skills.luck);

  const addSpecialized = (
    skills: SpecializedSkill[],
    group: "weapon" | "ranged" | "knowledge" | "magic",
  ) => {
    for (const skill of skills) {
      add(
        skill.specialty,
        totalSkillValue(skill.value, data.skills.bonuses[group][skill.id]),
      );
    }
  };
  addSpecialized(data.skills.weapon, "weapon");
  addSpecialized(data.skills.ranged, "ranged");
  addSpecialized(data.skills.knowledge, "knowledge");
  addSpecialized(data.skills.magic, "magic");
  for (const skill of data.skills.custom) {
    add(skill.name, totalSkillValue(skill.value, data.skills.bonuses.custom[skill.id]));
  }

  return entries;
}

function buildOwnedIds(character: CharacterRecord): string[] {
  const { data } = character;
  const ids = [
    ...data.skills.magic,
    ...data.skills.knowledge,
    ...data.skills.custom,
  ].map((skill) => skill.referenceId);
  ids.push(...data.equipment.map((item) => item.referenceId));
  return [...new Set(ids.map(nonEmpty).filter(Boolean))];
}

function buildEquippedShields(character: CharacterRecord): BattleExportShield[] {
  const { data } = character;
  return data.equipment
    .filter(
      (item) =>
        item.category === "shield" && data.equippedEquipmentIds.includes(item.id),
    )
    .map((item) => ({
      id: nonEmpty(item.referenceId),
      durability: Math.max(0, Math.round(item.durability ?? 0)),
    }));
}

export function buildBattleExport(character: CharacterRecord): BattleExport {
  const { data } = character;
  return {
    name: character.name,
    vitality: calculateHp(data.stats, data.statBonuses),
    magic: calculateMp(data.stats, data.statBonuses),
    damageBonus: calculateDamageBonus(data.stats, data.statBonuses),
    speed: totalStatValue(data.stats, data.statBonuses, "speed"),
    defense: data.equipment
      .filter(
        (item) =>
          item.category === "armor" && data.equippedEquipmentIds.includes(item.id),
      )
      .reduce((total, item) => total + (item.defense ?? 0), 0),
    shields: buildEquippedShields(character),
    skills: buildPositiveSkills(character),
    ids: buildOwnedIds(character),
  };
}

export const serializeBattleExport = (value: BattleExport) => JSON.stringify(value);
