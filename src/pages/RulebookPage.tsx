import { WORLD_IMAGES } from '../constants/world'
import { commonSkills, insanityTable, luckRules, playerTerm, rulebookSections, skillRules, specializedSkills, statDefinitions } from './rulebookContent'

export function RulebookPage() {
  return <div className="page world-page rulebook-page" style={{ backgroundImage: `linear-gradient(color-mix(in srgb, var(--background) 78%, transparent), color-mix(in srgb, var(--background) 94%, transparent)), url(${WORLD_IMAGES.riverRoad})` }}>
    <section className="rulebook-hero page-intro">
      <div><h1>ルールブック</h1><p>adventureTRPG 第1版の基本ルールを一覧で確認できます。</p></div>
    </section>

    <div className="rulebook-layout">
      <nav className="rulebook-nav" aria-label="ルールブック目次">
        {rulebookSections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.label}</a>)}
      </nav>

      <main className="rulebook-content">
        <RuleSection id="overview" title="基本方針">
          <div className="rulebook-columns">
            <RuleCard title="判定" variant="mechanics"><p><Keyword>技能判定</Keyword>は<Keyword>D100</Keyword>で行います。<Keyword>技能値以下</Keyword>なら<Keyword>成功</Keyword>です。</p><p><Keyword>能力値</Keyword>は、通常の技能判定には基本的に加えません。</p></RuleCard>
            <RuleCard title="裁定"><p>ルールにない状況は、GMがその場で判断します。必要に応じて参加者と相談できます。</p><p>行動の提案は、状況に合う技能や方法を説明して判定につなげます。</p></RuleCard>
          </div>
          <div className="rulebook-callout"><strong>{playerTerm}</strong></div>
        </RuleSection>

        <RuleSection id="character" title="能力値とキャラクター作成">
          <p className="rulebook-lead">初期作成では、<Keyword>能力値</Keyword>に18ポイントを自由に割り振ります。能力値に上限はなく、成長によって上昇します。</p>
          <div className="stat-rule-grid">{statDefinitions.map((stat) => <div className="stat-rule-card" key={stat.name}><span>{stat.effect}</span><strong>{stat.name}</strong></div>)}</div>
          <div className="rulebook-columns">
            <RuleCard title="派生値"><ul><li><Keyword>HP</Keyword> ＝ 体力 × 3</li><li><Keyword>MP</Keyword> ＝ 魔力 × 3</li><li><Keyword>正気度</Keyword> ＝ 精神力 × 3</li><li><Keyword>ダメージボーナス</Keyword> ＝ ⌊(体力＋筋力) / 6⌋</li></ul></RuleCard>
            <RuleCard title="作成時の注意"><ul><li>初期能力値はすべて1から開始</li><li>能力値ポイント18点を使い切る</li><li>能力値の成長上限は設けない</li><li>能力値は基本的に判定の修正値にしない</li></ul></RuleCard>
          </div>
        </RuleSection>

        <RuleSection id="checks" title="判定">
          <div className="check-rule-grid">
            <RuleCard title="技能判定" variant="mechanics"><div className="rulebook-number"><strong>D100</strong><span>{skillRules.success}</span></div><p><Keyword>初期値</Keyword>の上限は{skillRules.maximum}。初期値は{skillRules.initial}です。<Keyword>技能ポイント</Keyword>{skillRules.points}点を、各技能0〜100の範囲で自由に配分します。初期作成の400点とは別に、各技能へ<Keyword>追加値</Keyword>を加えることもできます。</p><div className="critical-line"><span><Keyword>クリティカル</Keyword> {skillRules.critical}</span><span><Keyword>ファンブル</Keyword> {skillRules.fumble}</span></div><p className="rulebook-note">クリティカル・ファンブルの具体的な効果は、各自の判断に委ねます。</p></RuleCard>
            <RuleCard title="対抗判定" variant="mechanics"><p><Keyword>対抗判定</Keyword>は技能ではなく、基本能力値を使います。</p><p>双方の能力値の差1点につき、成功率を±5%します。</p><p>能力値が同じなら基準値は50%です。</p></RuleCard>
          </div>
          <RuleCard title="幸運" variant="mechanics"><div className="rulebook-number"><strong>{luckRules.minimum}〜{luckRules.maximum}</strong><span>乱数で決定</span></div><p><Keyword>幸運</Keyword>は技能ポイントを使わずに決定します。キャラクター作成時に何度でも振り直せます。</p></RuleCard>
          <RuleCard title="組み付け" variant="mechanics"><p><Keyword>組み付き</Keyword>を仕掛ける側の筋力と、対象の筋力の差で判定します。</p><div className="formula">50% ＋（仕掛ける側の筋力 − 対象側の筋力）× 5%</div><p>効果は主に1ターンまたは1分程度。継続する場合は再度判定します。</p></RuleCard>
        </RuleSection>

        <RuleSection id="combat" title="戦闘">
          <div className="formation-grid">{['前衛', '中衛', '後衛'].map((position, index) => <div className="formation-card" key={position}><span>0{index + 1}</span><strong>{position}</strong><small>{index === 0 ? '近接攻撃' : index === 1 ? '遠距離 −10%' : '遠距離 −20%'}</small></div>)}</div>
          <div className="rulebook-columns">
            <RuleCard title="配置と行動順"><ul><li>味方・敵ともに<Keyword>前衛／中衛／後衛</Keyword>へ配置</li><li>開始時に自分の配置を宣言</li><li>味方・敵をまとめて<Keyword>速力</Keyword>の速い順に行動</li><li>同速なら筋力、場所に応じた技能、RPで決定</li><li><Keyword>配置変更</Keyword>は1ターンを消費</li></ul></RuleCard>
            <RuleCard title="ターン"><ul><li>自分の<Keyword>ターン</Keyword>の最初に行動を宣言</li><li><Keyword>攻撃</Keyword>、回避専念、回復など自由に選択</li><li>攻撃以外の行動はGM裁量</li><li>戦闘終了まで各ターンを繰り返す</li></ul></RuleCard>
          </div>
          <RuleCard title="攻撃の流れ" variant="mechanics"><ol><li><Keyword>攻撃側</Keyword>が技能判定</li><li>対象が<Keyword>回避</Keyword>または<Keyword>防御</Keyword></li><li>攻撃が通れば<Keyword>ダメージ処理</Keyword></li></ol><p>近接攻撃は前衛からのみ。前衛に敵がいなければ中衛、さらにいなければ後衛へ届きます。最も近い位置の敵を対象にします。</p><p>遠距離攻撃は中衛で命中率−10%、後衛で−20%。敵側にも同じ補正を適用します。</p><p>回避は回避技能。防御はキャラクターシートの防御数値を参照します。ダメージは武器・魔法に記載された計算方法、回復はキャラクターシートを参照します。</p></RuleCard>
        </RuleSection>

        <RuleSection id="resources" title="リソース">
          <div className="resource-rule-grid"><RuleCard title="HP"><div className="formula">体力 × 3</div><p>最大値と現在値を管理します。0になると死亡・ロストです。</p><p>休息していた時間に応じて自動的に回復します。ぐっすり眠る、または半日休憩するなどすれば、半分以上を回復できます。</p></RuleCard><RuleCard title="MP"><div className="formula">魔力 × 3</div><p>最大値と現在値を管理します。0になっても、何らかの手段で回復できます。</p><p>休息していた時間に応じて自動的に回復します。ぐっすり眠る、または半日休憩するなどすれば、半分以上を回復できます。</p></RuleCard><RuleCard title="正気度"><div className="formula">精神力 × 3</div><p>最大値と現在値を管理します。精神を壊すようなイベントで判定します。</p></RuleCard></div>
          <div className="rulebook-callout"><strong>正気度の成功率・減少量・回復方法はシナリオ指定。</strong><span>正気度が0になると発狂します。発狂内容はその場のGM判断です。</span></div>
          <details className="insanity-details"><summary>発狂表（任意使用）</summary><p className="rulebook-note">迷ったときだけD20。効果の強さ・継続時間・終了条件はGM判断です。</p><div className="insanity-table">{insanityTable.map((entry) => <div key={entry.roll}><b>{entry.roll}</b><span>{entry.text}</span></div>)}</div></details>
        </RuleSection>

        <RuleSection id="growth" title="成長">
          <div className="growth-grid"><RuleCard title="きっかけ"><p><Keyword>クリティカル</Keyword>を出したとき、または成長につながるイベントが起きたとき、GM判断で成長します。</p></RuleCard><RuleCard title="目安"><div className="growth-value"><strong>+1</strong><span>能力値 / 1シナリオ</span></div><div className="growth-value"><strong>+3</strong><span>技能値の合計 / 1シナリオ程度</span></div></RuleCard></div>
          <p className="rulebook-note">成長の有無・タイミング・具体的な配分はGMが判断します。</p>
        </RuleSection>

        <RuleSection id="special" title="魔術・特殊技能">
          <div className="rulebook-columns"><RuleCard title="魔術"><p><Keyword>魔術</Keyword>は基本的に、杖や本などの道具を使って発動します。</p><p>魔術ごとの効果・消費・判定方法は、シナリオや魔術の記載を参照します。</p></RuleCard><RuleCard title="特殊技能"><p><Keyword>特殊技能</Keyword>の使用方法や効果は、GMと相談して決めます。</p><p>専門知識、武器、射撃・投擲、魔術なども、必要に応じて個別に定義します。</p></RuleCard></div>
          <div className="skill-catalog-rule"><p><strong>通常技能：</strong>{commonSkills.join(' / ')}</p><p><strong>専門技能：</strong>{specializedSkills.join(' / ')} / カスタム技能</p></div>
        </RuleSection>

        <RuleSection id="gm" title="GM裁定">
          <div className="rulebook-callout"><strong>未定義の状況はGMが判断します。</strong><span>判断に迷う場合は、その場で参加者と相談し、必要なら後から調整します。</span></div>
          <div className="rulebook-columns"><RuleCard title="許可されていること"><ul><li>PvP可</li><li>ルールへのこじつけ提案</li><li>状況に応じた発狂内容の決定</li><li>蘇生の可否をGMが判断</li></ul></RuleCard><RuleCard title="第1版の扱い"><p>このルールブックは、現在決まっている基本ルールをまとめた第1版です。戦闘の細部や魔術の個別データは、必要に応じて追加・更新します。</p></RuleCard></div>
        </RuleSection>
      </main>
    </div>
  </div>
}

function RuleSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return <section className="rulebook-section" id={id}><div className="rulebook-section-heading"><h2>{title}</h2></div>{children}</section>
}

function RuleCard({ title, children, variant = 'plain' }: { title: string; children: React.ReactNode; variant?: 'plain' | 'mechanics' }) {
  return <article className={`rulebook-card ${variant === 'mechanics' ? 'rulebook-card-mechanics' : ''}`}><h3>{title}</h3>{children}</article>
}

function Keyword({ children }: { children: React.ReactNode }) {
  return <strong className="rulebook-keyword">{children}</strong>
}
