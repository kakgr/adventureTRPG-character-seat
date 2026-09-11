import { describe, expect, it } from "vitest";
import { normalizeCharacterData, sortEquipmentByEquipped } from "./characterData";

describe("character data normalization", () => {
  it("fills the new magic stat when loading an old six-stat record", () => {
    const result = normalizeCharacterData({
      stats: { vitality: 4, strength: 5, mental: 6, speed: 3 } as never,
      statBonuses: { mental: 2 } as never,
    });

    expect(result.stats).toEqual({ vitality: 4, strength: 5, magic: 1, speed: 3, mental: 6 });
    expect(result.statBonuses).toEqual({ vitality: 0, strength: 0, magic: 0, speed: 0, mental: 2 });
    expect(result.skills.luck).toBe(0);
    expect(result.skills.bonuses.common.athletics).toBe(0);
  });

  it("normalizes luck to its 0 through 90 range", () => {
    expect(normalizeCharacterData({ skills: { luck: 120 } as never }).skills.luck).toBe(90);
  });

  it("normalizes skill bonuses independently from the 400-point allocation", () => {
    const result = normalizeCharacterData({
      skills: { bonuses: { common: { search: 12 }, custom: { "skill-1": 140 } } },
    } as never);

    expect(result.skills.bonuses.common.search).toBe(12);
    expect(result.skills.bonuses.custom["skill-1"]).toBe(100);
  });

  it("preserves line breaks in item notes", () => {
    const result = normalizeCharacterData({
      items: [{ id: "item-1", name: "手帳", quantity: 1, description: "一行目\n二行目" }],
    } as never);

    expect(result.items[0].description).toBe("一行目\n二行目");
  });

  it("migrates legacy weapons into equipment and keeps weapon details", () => {
    const result = normalizeCharacterData({
      weapons: [
        {
          id: "weapon-1",
          name: "短剣",
          kind: "melee",
          skill: "武器",
          damage: "1d4",
          durability: -3,
          description: "受け流し用",
        },
      ],
    } as never);

    expect(result.equipment[0]).toEqual({
      id: "weapon-1",
      name: "短剣",
      category: "weapon",
      description: "受け流し用",
      weaponKind: "melee",
      skill: "武器",
      damage: "1d4",
      durability: 0,
    });
    expect(result.equippedEquipmentIds).toEqual(["weapon-1"]);
  });

  it("limits equipped equipment to six existing items", () => {
    const equipment = Array.from({ length: 7 }, (_, index) => ({
      id: `equipment-${index + 1}`,
      name: `装備${index + 1}`,
      category: "accessory",
      description: "",
    }));

    const result = normalizeCharacterData({
      equipment,
      equippedEquipmentIds: [...equipment.map((item) => item.id), "missing"],
    } as never);

    expect(result.equippedEquipmentIds).toEqual(
      equipment.slice(0, 6).map((item) => item.id),
    );
  });

  it("normalizes staff equipment without weapon stats and keeps armor durability", () => {
    const result = normalizeCharacterData({
      equipment: [
        {
          id: "staff-1",
          name: "古杖",
          category: "weapon",
          weaponKind: "staff",
          skill: "使わない",
          damage: "使わない",
          durability: 9,
          description: "魔力を増幅する。",
        },
        {
          id: "armor-1",
          name: "革鎧",
          category: "armor",
          durability: 12,
          description: "",
        },
      ],
    } as never);

    expect(result.equipment).toEqual([
      {
        id: "staff-1",
        name: "古杖",
        category: "weapon",
        weaponKind: "staff",
        description: "魔力を増幅する。",
      },
      {
        id: "armor-1",
        name: "革鎧",
        category: "armor",
        durability: 12,
        description: "",
      },
    ]);
  });

  it("converts the legacy currency object for existing characters", () => {
    const result = normalizeCharacterData({
      currency: { platinum: 0, gold: 0, silver: 100, copper: 4 },
    } as never);

    expect(result.currency).toBe(10004);
  });

  it("sorts equipped equipment first while keeping each group stable", () => {
    const equipment = [
      { id: "a", name: "A", category: "accessory" as const, description: "" },
      { id: "b", name: "B", category: "armor" as const, description: "" },
      { id: "c", name: "C", category: "weapon" as const, description: "" },
    ];

    expect(sortEquipmentByEquipped(equipment, ["c", "a"]).map((item) => item.id)).toEqual([
      "a",
      "c",
      "b",
    ]);
    expect(sortEquipmentByEquipped(equipment, ["c"]).map((item) => item.id)).toEqual([
      "c",
      "a",
      "b",
    ]);
  });
});
