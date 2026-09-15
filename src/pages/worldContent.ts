export type WorldGlossaryEntry = {
  id: string;
  term: string;
  category: string;
  subcategory?: string;
  description: string;
};

export type WorldGlossaryEntryGroup = {
  title: string;
  entries: WorldGlossaryEntry[];
};

export type WorldGlossaryGenre = {
  id: string;
  title: string;
  categories?: string[];
  entries: WorldGlossaryEntry[];
};

export function groupGlossaryEntries(
  entries: WorldGlossaryEntry[],
  categories: string[] = [],
): WorldGlossaryEntryGroup[] {
  const groups: WorldGlossaryEntryGroup[] = categories.map((title) => ({ title, entries: [] }));
  for (const entry of entries) {
    const group = groups.find((candidate) => candidate.title === entry.category);
    if (group) group.entries.push(entry);
    else groups.push({ title: entry.category, entries: [entry] });
  }
  return groups;
}

export const worldGlossaryGenres: WorldGlossaryGenre[] = [
  {
    id: "magic-technology",
    title: "魔力・魔術・機械",
    entries: [
      {
        id: "magic-power",
        term: "魔力",
        category: "魔力",
        description: "物質全てに宿るエネルギー。人など一部の生物は操る力を持っている。",
      },
      {
        id: "sorcery",
        term: "魔術",
        category: "魔術",
        description:
          "道具を使って自在に魔力を制御する術のこと。イメージが複雑なものほど難しくなる。",
      },
      {
        id: "alchemy",
        term: "錬金術",
        category: "魔術",
        description:
          "等価交換そのものであり、新しい物を生み出すことはできない。使用する規模によってMPの使用量が変わり、小さいものから巨大な変更まで可能だ。主に地面の形状を変更させて自分の使いやすい形に変えたり、所持しているものの形を変えることができる。",
      },
      {
        id: "machine",
        term: "機械",
        category: "機械",
        description:
          "魔力を使って自動で動く道具。産業革命の根本であり、今や全てのものに使われている。",
      },
      {
        id: "gun",
        term: "銃",
        category: "機械",
        description:
          "魔力を使うことで間接攻撃ができる武器。様々な種類があるが、特徴として他の魔術と違い簡単な訓練ですぐ撃てる良さがある。",
      },
    ],
  },
  {
    id: "pollution-anomalies",
    title: "汚染・異形",
    entries: [
      {
        id: "pollution",
        term: "汚染",
        category: "汚染",
        description:
          "魔力が結晶化し、物質に変異する現象のこと。ほとんどのものに対して有害であり、濃度が高くなるとその地域は危険域になる。",
      },
      {
        id: "anomalies",
        term: "異形",
        category: "異形",
        description:
          "汚染によって生まれた生物。または汚染によって変異した生物。様々な種類がおり、凶暴で基本的に有害。",
      },
    ],
  },
  {
    id: "status-effects",
    title: "状態異常・特殊効果",
    entries: [
      {
        id: "wet",
        term: "湿潤",
        category: "状態異常",
        description: "特殊な効果はありません。",
      },
      {
        id: "cold",
        term: "寒冷",
        category: "状態異常",
        description: "特殊な効果はありません。",
      },
      {
        id: "frozen",
        term: "凍結",
        category: "状態異常",
        description:
          "湿潤状態の時に寒冷を付与する、または寒冷状態の時に湿潤を付与すると発生する。次のターンの間、対象の攻撃に追加で70%の命中判定を行わせる。",
      },
      {
        id: "bound",
        term: "拘束",
        category: "状態異常",
        description: "指定したターン数の間、対象は行動不能になる。",
      },
      {
        id: "electric-rift",
        term: "電裂（でんれつ）",
        category: "状態異常",
        description: "指定したターン数の間、対象に与えられるダメージが1増える。",
      },
      {
        id: "burn",
        term: "火傷",
        category: "状態異常",
        description: "2ターンの間、ターンの初めにダメージを1受ける。",
      },
      {
        id: "aim",
        term: "照準",
        category: "状態異常",
        description: "指定したターン数の間、対象への攻撃命中率が味方全員90%になる。",
      },
      {
        id: "bleeding",
        term: "出血",
        category: "状態異常",
        description: "5ターンの間、ターンの初めに1ダメージを受ける。治療などで簡単に治せる。",
      },
      {
        id: "ice-break",
        term: "氷砕き",
        category: "特殊効果",
        description:
          "「凍結」状態の相手に追加で1D2ダメージを与える。ダメージを与えた後、「凍結」状態はなくなる。",
      },
      {
        id: "piercing",
        term: "貫通",
        category: "特殊効果",
        description: "対象の防御力が指定値以下の場合、最低でも1ダメージを与える。",
      },
    ],
  },
  {
    id: "geography",
    title: "地理",
    categories: ["自然地名", "人文地名"],
    entries: [
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
    ],
  },
  {
    id: "people",
    title: "人物・役割",
    entries: [
      {
        id: "wanderers",
        term: "渡り手",
        category: "渡り手",
        description: "PCのこと。CoCでいう探索者、エモクロアでいう共鳴者。",
      },
    ],
  },
];
