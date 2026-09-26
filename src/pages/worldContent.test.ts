import { describe, expect, it } from "vitest";
import { groupGlossaryEntries, worldGlossaryGenres } from "./worldContent";

describe("world content", () => {
  it("groups the defined glossary terms by genre", () => {
    expect(worldGlossaryGenres.map((genre) => genre.id)).toEqual([
      "magic-technology",
      "pollution-anomalies",
      "status-effects",
      "geography",
      "people",
    ]);
    expect(worldGlossaryGenres.map((genre) => genre.title)).toEqual([
      "魔力・魔術・機械",
      "汚染・異形",
      "状態異常・特殊効果",
      "地理",
      "人物・役割",
    ]);
    expect(
      worldGlossaryGenres.flatMap((genre) => genre.entries).map((entry) => entry.term),
    ).toEqual([
      "魔力",
      "魔術",
      "錬金術",
      "機械",
      "銃",
      "汚染",
      "異形",
      "湿潤",
      "寒冷",
      "凍結",
      "拘束",
      "電裂（でんれつ）",
      "火傷",
      "照準",
      "出血",
      "氷砕き",
      "貫通",
      "ラース大陸",
      "中央海",
      "バルトの街",
      "サダム連合国",
      "ユギの街",
      "渡り手",
    ]);
    expect(
      worldGlossaryGenres.flatMap((genre) => genre.entries).map((entry) => entry.description),
    ).toEqual([
      "物質全てに宿るエネルギー。人など一部の生物は操る力を持っている。",
      "道具を使って自在に魔力を制御する術のこと。イメージが複雑なものほど難しくなる。",
      "等価交換そのものであり、新しい物を生み出すことはできない。使用する規模によってMPの使用量が変わり、小さいものから巨大な変更まで可能だ。主に地面の形状を変更させて自分の使いやすい形に変えたり、所持しているものの形を変えることができる。",
      "魔力を使って自動で動く道具。産業革命の根本であり、今や全てのものに使われている。",
      "魔力を使うことで間接攻撃ができる武器。様々な種類があるが、特徴として他の魔術と違い簡単な訓練ですぐ撃てる良さがある。",
      "魔力が結晶化し、物質に変異する現象のこと。ほとんどのものに対して有害であり、濃度が高くなるとその地域は危険域になる。",
      "汚染によって生まれた生物。または汚染によって変異した生物。様々な種類がおり、凶暴で基本的に有害。",
      "特殊な効果はありません。",
      "特殊な効果はありません。",
      "湿潤状態の時に寒冷を付与する、または寒冷状態の時に湿潤を付与すると発生する。次のターンの間、対象の攻撃に追加で70%の命中判定を行わせる。",
      "指定したターン数の間、対象は行動不能になる。",
      "指定したターン数の間、対象に与えられるダメージが1増える。",
      "2ターンの間、ターンの初めにダメージを1受ける。",
      "指定したターン数の間、対象への攻撃命中率が味方全員90%になる。",
      "5ターンの間、ターンの初めに1ダメージを受ける。治療などで簡単に治せる。",
      "「凍結」状態の相手に追加で1D2ダメージを与える。ダメージを与えた後、「凍結」状態はなくなる。",
      "対象の防御力が指定値以下の場合、最低でも1ダメージを与える。",
      "中央海から西側にある大陸で、縦に長く様々な気候帯を持っている。三大陸の中で最も人口が多く、安全圏が広い。",
      "3つの大陸に挟まれた海。場所がちょうどいいため何かと基準にされがち。",
      "ラース大陸東部の沿岸に位置し、漁業と貿易の出入り口として発展した港町。この世界でも屈指の安全圏であり、周辺地域の様々なものが集結する場所になった。サダム連合国を構成する都市国家の一つ。",
      "ラース大陸東部の沿岸都市が結成した国。豊かな海の資源と貿易によって栄えている。北部には広い危険域があり、防衛線を構築している。",
      "サダム連合国では珍しい内陸の街。造船・修理を生業として栄えてきた街であり、バルトの街とともに国の物流を支えている。",
      "PCのこと。CoCでいう探索者、エモクロアでいう共鳴者。",
    ]);
  });

  it("keeps the geography glossary genre ready for future entries", () => {
    expect(worldGlossaryGenres.find((genre) => genre.id === "geography")).toMatchObject({
      id: "geography",
      title: "地理",
      categories: ["自然地名", "人文地名"],
    });
  });

  it("groups glossary entries into smaller sections within a genre", () => {
    const magicTechnology = worldGlossaryGenres.find((genre) => genre.id === "magic-technology");
    expect(
      groupGlossaryEntries(magicTechnology?.entries ?? []).map((group) => ({
        title: group.title,
        terms: group.entries.map((entry) => entry.term),
      })),
    ).toEqual([
      { title: "魔力", terms: ["魔力"] },
      { title: "魔術", terms: ["魔術", "錬金術"] },
      { title: "機械", terms: ["機械", "銃"] },
    ]);
  });

  it("adds status conditions and special effects to the glossary", () => {
    const glossary = worldGlossaryGenres.find((genre) => genre.id === "status-effects");
    expect(glossary).toMatchObject({
      id: "status-effects",
      title: "状態異常・特殊効果",
    });
    expect(
      groupGlossaryEntries(glossary?.entries ?? []).map((group) => ({
        title: group.title,
        terms: group.entries.map((entry) => entry.term),
      })),
    ).toEqual([
      {
        title: "状態異常",
        terms: ["湿潤", "寒冷", "凍結", "拘束", "電裂（でんれつ）", "火傷", "照準", "出血"],
      },
      { title: "特殊効果", terms: ["氷砕き", "貫通"] },
    ]);
  });

  it("places geography terms under the natural place-name category", () => {
    const geography = worldGlossaryGenres.find((genre) => genre.id === "geography");
    expect(geography?.entries.filter((entry) => entry.category === "自然地名")).toEqual([
      {
        id: "laas-continent",
        term: "ラース大陸",
        category: "自然地名",
        subcategory: "自然地形",
        description:
          "中央海から西側にある大陸で、縦に長く様々な気候帯を持っている。三大陸の中で最も人口が多く、安全圏が広い。",
      },
      {
        id: "central-sea",
        term: "中央海",
        category: "自然地名",
        subcategory: "自然地形",
        description: "3つの大陸に挟まれた海。場所がちょうどいいため何かと基準にされがち。",
      },
    ]);
  });

  it("places the new geography terms under the human place-name category", () => {
    const geography = worldGlossaryGenres.find((genre) => genre.id === "geography");
    expect(geography?.entries.filter((entry) => entry.category === "人文地名")).toEqual([
      {
        id: "bart-town",
        term: "バルトの街",
        category: "人文地名",
        subcategory: "都市・国家",
        description:
          "ラース大陸東部の沿岸に位置し、漁業と貿易の出入り口として発展した港町。この世界でも屈指の安全圏であり、周辺地域の様々なものが集結する場所になった。サダム連合国を構成する都市国家の一つ。",
      },
      {
        id: "sadam-union",
        term: "サダム連合国",
        category: "人文地名",
        subcategory: "都市・国家",
        description:
          "ラース大陸東部の沿岸都市が結成した国。豊かな海の資源と貿易によって栄えている。北部には広い危険域があり、防衛線を構築している。",
      },
      {
        id: "yugi-town",
        term: "ユギの街",
        category: "人文地名",
        subcategory: "都市・国家",
        description:
          "サダム連合国では珍しい内陸の街。造船・修理を生業として栄えてきた街であり、バルトの街とともに国の物流を支えている。",
      },
    ]);
  });
});
