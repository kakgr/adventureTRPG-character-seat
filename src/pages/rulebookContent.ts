export interface RulebookSection {
  id: string
  label: string
}

export const rulebookSections: RulebookSection[] = [
  { id: 'overview', label: '基本方針' },
  { id: 'character', label: '能力値と作成' },
  { id: 'checks', label: '判定' },
  { id: 'combat', label: '戦闘' },
  { id: 'resources', label: 'リソース' },
  { id: 'growth', label: '成長' },
  { id: 'special', label: '魔術・特殊技能' },
  { id: 'gm', label: 'GM裁定' },
]

export const playerTerm = 'PLたちは「渡り手」と呼ばれます。'

export const statDefinitions = [
  { name: '体力', effect: 'HP' },
  { name: '筋力', effect: 'ダメージボーナス' },
  { name: '魔力', effect: 'MP' },
  { name: '速力', effect: '行動順' },
  { name: '精神力', effect: '正気度' },
] as const

export const skillRules = {
  maximum: 100,
  initial: 0,
  points: 400,
  success: '技能値以下で成功',
  critical: '1〜5',
  fumble: '95〜100',
} as const

export const luckRules = {
  minimum: 0,
  maximum: 90,
  points: 0,
  reroll: '何度でも振り直し可能',
} as const

export const commonSkills = [
  '運動', '格闘', '回避', '隠密', '洞察', '探索', '交渉',
  '威圧', '技術', '医療', 'サバイバル', '操縦', '感応',
]

export const specializedSkills = ['武器', '射撃・投擲', '専門知識', '魔術']

export const insanityTable = [
  'その場で硬直し、短時間行動できない',
  'その場から逃走しようとする',
  '大声で叫ぶ、または泣き出す',
  '呼吸が乱れ、会話や行動が困難になる',
  '周囲のものに対して攻撃的になる',
  '身を守ることだけを優先し、動かなくなる',
  'ありもしないものを見たり聞いたりする',
  '同じ言葉や行動を繰り返す',
  '特定の人物・物・場所に強く執着する',
  '直前の出来事や状況を理解できなくなる',
  '自分を責め続ける、または自分を傷つけようとする',
  '危険を顧みず、無謀な行動を取る',
  '味方を敵と誤認する',
  '身近なものを武器や脅威だと思い込む',
  '起きた事実を認めず、現実を否定する',
  '直近の人物の言葉や命令に盲目的に従う',
  '根拠のない妄想や使命感にとらわれる',
  '感情が麻痺し、反応がほとんどなくなる',
  '一時的に意識を失う、またはその場に倒れる',
  'その場に適した内容をGMとプレイヤーで決める',
].map((text, index) => ({ roll: String(index + 1), text }))
