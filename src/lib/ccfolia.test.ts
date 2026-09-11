import { describe, expect, it } from "vitest";
import { DEFAULT_DATA } from "../constants/game";
import type { CharacterRecord } from "../types/character";
import { buildCocofoliaCharacter, serializeCocofoliaCharacter } from "./ccfolia";

const character = (): CharacterRecord => ({
  id: "character-1",
  user_id: "user-1",
  name: "アリア・ノクス",
  data: {
    ...structuredClone(DEFAULT_DATA),
    profile: {
      ...DEFAULT_DATA.profile,
      reading: "ありあ・のくす",
      age: 21,
      gender: "女性",
      occupation: "遺跡調査員",
      summary: "静かな観察者",
      description: "古代遺跡を巡る。",
    },
    stats: { vitality: 4, strength: 5, magic: 6, speed: 3, mental: 2 },
    statBonuses: { vitality: 1, speed: 2 },
    skills: {
      ...DEFAULT_DATA.skills,
      luck: 42,
      common: { ...DEFAULT_DATA.skills.common, search: 65, medicine: 40 },
      bonuses: {
        ...DEFAULT_DATA.skills.bonuses,
        common: { ...DEFAULT_DATA.skills.bonuses.common, search: 10 },
      },
      weapon: [{ id: "weapon-1", specialty: "短剣", value: 55 }],
      custom: [{ id: "custom-1", name: "古代文字", value: 80 }],
    },
    equipment: [],
    equippedEquipmentIds: [],
    items: [{ id: "item-1", name: "ランタン", quantity: 2, description: "油式" }],
    currency: { platinum: 1, gold: 2, silver: 3, copper: 4 } as never,
    experience: { notes: "港町の事件" },
    tags: ["探索", "古代遺跡"],
  },
  portrait_path: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
});

describe("CCFOLIA character export", () => {
  it("builds the CCFOLIA character payload", () => {
    const result = buildCocofoliaCharacter(character());

    expect(result.kind).toBe("character");
    expect(result.data.name).toBe("アリア・ノクス");
    expect(result.data.initiative).toBe(5);
    expect(result.data.status).toEqual([
      { label: "HP", value: 15, max: 15 },
      { label: "MP", value: 18, max: 18 },
      { label: "正気度", value: 6, max: 6 },
      { label: "所持金", value: 1020304, max: 0 },
    ]);
    expect(result.data.params).toEqual(
      expect.arrayContaining([
        { label: "体力", value: "5" },
        { label: "速力", value: "5" },
        { label: "魔力", value: "6" },
        { label: "ダメージボーナス", value: "1" },
        { label: "探索", value: "75" },
        { label: "幸運", value: "42" },
        { label: "短剣", value: "55" },
        { label: "古代文字", value: "80" },
      ]),
    );
    expect(result.data.memo).toBe(
      [
        "PC：アリア・ノクス",
        "HP：15",
        "MP：18",
        "正気度：6",
        "ダメージボーナス：1",
        "所持金：1020304",
      ].join("\r\n"),
    );
    expect(result.data.memo).not.toContain("遺跡調査員");
    expect(result.data.memo).not.toContain("ランタン");
    expect(result.data.commands).toBe(
      [
        "1d100<=75 〖探索〗",
        "1d100<=40 〖医療〗",
        "1d100<=42 〖幸運〗",
        "1d100<=55 〖短剣〗",
        "1d100<=80 〖古代文字〗",
        "1d100 〖正気度チェック（判定値はシナリオ指定）〗",
      ].join("\r\n"),
    );
  });

  it("serializes to compact JSON without raw line breaks", () => {
    const serialized = serializeCocofoliaCharacter(buildCocofoliaCharacter(character()));

    expect(serialized).not.toContain("\n");
    expect(JSON.parse(serialized)).toEqual(buildCocofoliaCharacter(character()));
  });

  it("keeps the luck command when luck is zero", () => {
    const source = character();
    source.data.skills.luck = 0;

    expect(buildCocofoliaCharacter(source).data.commands).toContain("1d100<=0 〖幸運〗");
  });

  it("includes weapon durability in the memo", () => {
    const source = character();
    source.data.equipment = [
      {
        id: "weapon-1",
        name: "短銃",
        category: "weapon",
        weaponKind: "gun",
        skill: "射撃・投擲",
        damage: "1d6",
        durability: 8,
        description: "",
      },
    ];

    expect(buildCocofoliaCharacter(source).data.memo).toContain(
      "武器：短銃（銃） 技能：射撃・投擲 ダメージ：1d6 耐久値：8",
    );
  });

  it("exports staff and non-weapon equipment without irrelevant fields", () => {
    const source = character();
    source.data.equipment = [
      {
        id: "staff-1",
        name: "魔道具",
        category: "weapon",
        weaponKind: "staff",
        description: "魔力を増幅する。",
      },
      {
        id: "armor-1",
        name: "革鎧",
        category: "armor",
        durability: 12,
        description: "軽い鎧。",
      },
    ];

    expect(buildCocofoliaCharacter(source).data.memo).toContain(
      "装備品：魔道具（武器・杖/魔道具） 説明：魔力を増幅する。",
    );
    expect(buildCocofoliaCharacter(source).data.memo).toContain(
      "装備品：革鎧（防具） 耐久値：12 説明：軽い鎧。",
    );
  });
});
