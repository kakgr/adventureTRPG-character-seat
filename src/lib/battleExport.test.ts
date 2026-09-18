import { describe, expect, it } from "vitest";
import { DEFAULT_DATA } from "../constants/game";
import type { CharacterRecord } from "../types/character";
import { buildBattleExport } from "./battleExport";

const character = (): CharacterRecord => ({
  id: "character-1", user_id: "user-1", name: "錬金術師",
  data: {
    ...structuredClone(DEFAULT_DATA),
    skills: { ...structuredClone(DEFAULT_DATA.skills), magic: [{ id: "alchemy", specialty: "錬金術", value: 65, referenceId: "20000" }] },
    equipment: [
      { id: "alchemy-tool", name: "錬金術", category: "magicTool", referenceId: "20000", description: "錬金用の魔道具" },
      { id: "unused-accessory", name: "指輪", category: "accessory", referenceId: "50001", description: "" },
      { id: "armor", name: "革鎧", category: "armor", defense: 12, description: "" },
    ],
    equippedEquipmentIds: ["alchemy-tool", "armor"],
  },
  portrait_path: null, created_at: "2026-01-01T00:00:00.000Z", updated_at: "2026-01-01T00:00:00.000Z",
});

describe("戦闘用JSON出力", () => {
  it("錬金術の魔道具と魔術技能を戦闘用装備として出力する", () => {
    const result = buildBattleExport(character());

    expect(result).toEqual({
      name: "錬金術師",
      vitality: 1,
      magic: 1,
      damageBonus: 0,
      speed: 1,
      defense: 12,
      shields: [],
      skills: [{ name: "錬金術", value: 65 }],
      ids: ["20000", "50001"],
    });
  });

  it("exports every positive skill and every owned external ID", () => {
    const source = character();
    source.data.skills.common.search = 20;
    source.data.skills.common.athletics = 0;
    source.data.skills.weapon = [{ id: "sword", specialty: "剣", value: 30 }];
    source.data.skills.custom = [{ id: "custom", name: "交渉術", value: 10 }];
    source.data.equipment = [
      { id: "weapon", name: "剣", category: "melee", referenceId: "30001", description: "" },
      { id: "accessory", name: "指輪", category: "accessory", referenceId: "50001", description: "" },
      { id: "armor", name: "鎧", category: "armor", defense: 8, description: "" },
      { id: "armor-2", name: "外套", category: "armor", defense: 5, description: "" },
      { id: "shield", name: "盾", category: "shield", referenceId: "40001", durability: 7, description: "" },
    ];
    source.data.equippedEquipmentIds = ["weapon", "armor", "armor-2", "shield"];

    const result = buildBattleExport(source);

    expect(result.skills).toEqual([
      { name: "探索", value: 20 },
      { name: "剣", value: 30 },
      { name: "錬金術", value: 65 },
      { name: "交渉術", value: 10 },
    ]);
    expect(result.defense).toBe(13);
    expect(result.shields).toEqual([{ id: "40001", durability: 7 }]);
    expect(result.ids).toEqual(["20000", "30001", "50001", "40001"]);
  });
});
